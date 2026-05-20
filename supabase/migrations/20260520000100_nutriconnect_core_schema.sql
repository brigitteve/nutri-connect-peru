-- NutriConnect core schema
-- Covers Freemium/Premium users, verified restaurants, custom dishes,
-- reservations, chat, order tracking, gamification, ratings, notifications,
-- and restaurant income reporting.

create extension if not exists pgcrypto;

create type public.user_role as enum ('customer', 'restaurant', 'admin');
create type public.subscription_tier as enum ('freemium', 'premium');
create type public.restaurant_verification_status as enum ('pending', 'verified', 'rejected', 'suspended');
create type public.fulfillment_mode as enum ('delivery', 'pickup');
create type public.reservation_status as enum (
  'draft',
  'pending_restaurant',
  'accepted',
  'adjusted_time',
  'rejected',
  'preparing',
  'ready',
  'on_the_way',
  'delivered',
  'cancelled'
);
create type public.chat_message_type as enum ('free_text', 'preset', 'system');
create type public.notification_type as enum ('reservation', 'order_status', 'gamification', 'nutrition_tip', 'payment', 'system');
create type public.rating_target as enum ('dish', 'restaurant', 'reservation');
create type public.income_entry_status as enum ('pending', 'payable', 'paid', 'disputed');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'customer',
  subscription public.subscription_tier not null default 'freemium',
  full_name text not null,
  age integer check (age is null or age between 1 and 120),
  weight_kg numeric(6,2) check (weight_kg is null or weight_kg > 0),
  allergies text[] not null default '{}',
  restrictions text[] not null default '{}',
  goals text[] not null default '{}',
  onboarding_completed boolean not null default false,
  points integer not null default 0 check (points >= 0),
  level integer not null default 1 check (level >= 1),
  data_processing_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  specialty text,
  tags text[] not null default '{}',
  address text,
  district text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  verification_status public.restaurant_verification_status not null default 'pending',
  is_verified boolean generated always as (verification_status = 'verified') stored,
  accepts_custom_dishes boolean not null default false,
  rating_average numeric(3,2) not null default 0 check (rating_average between 0 and 5),
  rating_count integer not null default 0 check (rating_count >= 0),
  medal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dishes (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text,
  category text not null,
  image_url text,
  ingredients jsonb not null default '[]'::jsonb,
  macros jsonb not null default '{"protein_g":0,"carbs_g":0,"fat_g":0}'::jsonb,
  calories integer not null check (calories >= 0),
  cost_pen numeric(10,2) not null check (cost_pen >= 0),
  prep_minutes integer not null default 30 check (prep_minutes > 0),
  is_available boolean not null default true,
  is_customizable boolean not null default true,
  premium_only boolean not null default false,
  allergy_tags text[] not null default '{}',
  restriction_tags text[] not null default '{}',
  objective_tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.weekly_plan_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  dish_id uuid not null references public.dishes(id) on delete cascade,
  planned_for date not null,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, dish_id, planned_for)
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete restrict,
  dish_id uuid not null references public.dishes(id) on delete restrict,
  status public.reservation_status not null default 'pending_restaurant',
  fulfillment public.fulfillment_mode not null,
  scheduled_at timestamptz not null,
  adjusted_scheduled_at timestamptz,
  address text,
  user_notes text,
  restaurant_notes text,
  subtotal_pen numeric(10,2) not null check (subtotal_pen >= 0),
  delivery_fee_pen numeric(10,2) not null default 0 check (delivery_fee_pen >= 0),
  total_pen numeric(10,2) generated always as (subtotal_pen + delivery_fee_pen) stored,
  points_awarded integer not null default 0 check (points_awarded >= 0),
  user_confirmed_at timestamptz,
  restaurant_confirmed_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (adjusted_scheduled_at is null or adjusted_scheduled_at >= created_at)
);

create table public.order_status_events (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  status public.reservation_status not null,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null unique references public.reservations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  message_type public.chat_message_type not null default 'free_text',
  preset_key text,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.nutrition_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  measured_on date not null default current_date,
  weight_kg numeric(6,2),
  calories integer,
  protein_g numeric(7,2),
  carbs_g numeric(7,2),
  fat_g numeric(7,2),
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, measured_on)
);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tier public.subscription_tier not null default 'freemium',
  points_reward integer not null default 0 check (points_reward >= 0),
  starts_on date,
  ends_on date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.user_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  progress integer not null default 0 check (progress >= 0),
  target integer not null default 1 check (target > 0),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, challenge_id)
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  tier public.subscription_tier not null default 'freemium',
  badge_kind text not null default 'bronze',
  points_reward integer not null default 0 check (points_reward >= 0),
  created_at timestamptz not null default now()
);

create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete cascade,
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  dish_id uuid references public.dishes(id) on delete cascade,
  target public.rating_target not null,
  score integer not null check (score between 1 and 5),
  comment text,
  is_moderated boolean not null default false,
  created_at timestamptz not null default now(),
  check (
    (target = 'reservation' and reservation_id is not null)
    or (target = 'restaurant' and restaurant_id is not null)
    or (target = 'dish' and dish_id is not null)
  )
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.restaurant_income_entries (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete set null,
  gross_pen numeric(10,2) not null check (gross_pen >= 0),
  commission_pen numeric(10,2) not null default 0 check (commission_pen >= 0),
  net_pen numeric(10,2) generated always as (gross_pen - commission_pen) stored,
  status public.income_entry_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.restaurant_payment_reports (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  gross_pen numeric(10,2) not null default 0,
  commission_pen numeric(10,2) not null default 0,
  net_pen numeric(10,2) not null default 0,
  generated_at timestamptz not null default now(),
  check (period_end >= period_start)
);

create index idx_profiles_subscription on public.profiles(subscription);
create index idx_restaurants_owner on public.restaurants(owner_id);
create index idx_restaurants_verified on public.restaurants(verification_status);
create index idx_dishes_restaurant on public.dishes(restaurant_id);
create index idx_dishes_filters on public.dishes using gin ((allergy_tags || restriction_tags || objective_tags));
create index idx_reservations_user_status on public.reservations(user_id, status);
create index idx_reservations_restaurant_status on public.reservations(restaurant_id, status);
create index idx_chat_messages_thread_created on public.chat_messages(thread_id, created_at);
create index idx_notifications_user_read on public.notifications(user_id, read_at);

alter table public.reservations replica identity full;
alter table public.order_status_events replica identity full;
alter table public.chat_threads replica identity full;
alter table public.chat_messages replica identity full;
alter table public.notifications replica identity full;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_restaurants_updated_at
before update on public.restaurants
for each row execute function public.set_updated_at();

create trigger set_dishes_updated_at
before update on public.dishes
for each row execute function public.set_updated_at();

create trigger set_reservations_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();

create trigger set_chat_threads_updated_at
before update on public.chat_threads
for each row execute function public.set_updated_at();

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.user_owns_restaurant(target_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.restaurants
    where id = target_restaurant_id and owner_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.dishes enable row level security;
alter table public.weekly_plan_items enable row level security;
alter table public.reservations enable row level security;
alter table public.order_status_events enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;
alter table public.nutrition_progress enable row level security;
alter table public.challenges enable row level security;
alter table public.user_challenges enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.ratings enable row level security;
alter table public.notifications enable row level security;
alter table public.restaurant_income_entries enable row level security;
alter table public.restaurant_payment_reports enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles
for select using (id = auth.uid() or public.current_user_is_admin());

create policy "profiles_insert_own" on public.profiles
for insert with check (id = auth.uid());

create policy "profiles_update_own" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

create policy "restaurants_public_verified" on public.restaurants
for select using (verification_status = 'verified' or owner_id = auth.uid() or public.current_user_is_admin());

create policy "restaurants_insert_owner" on public.restaurants
for insert with check (owner_id = auth.uid());

create policy "restaurants_update_owner_or_admin" on public.restaurants
for update using (owner_id = auth.uid() or public.current_user_is_admin());

create policy "dishes_public_available" on public.dishes
for select using (
  is_available
  and exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.verification_status = 'verified'
  )
  or public.user_owns_restaurant(restaurant_id)
  or public.current_user_is_admin()
);

create policy "dishes_manage_restaurant_owner" on public.dishes
for all using (public.user_owns_restaurant(restaurant_id) or public.current_user_is_admin())
with check (public.user_owns_restaurant(restaurant_id) or public.current_user_is_admin());

create policy "weekly_plan_manage_own" on public.weekly_plan_items
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "reservations_select_participants" on public.reservations
for select using (
  user_id = auth.uid()
  or public.user_owns_restaurant(restaurant_id)
  or public.current_user_is_admin()
);

create policy "reservations_insert_own_premium_verified" on public.reservations
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.subscription = 'premium'
  )
  and exists (
    select 1 from public.restaurants r
    where r.id = restaurant_id and r.verification_status = 'verified' and r.accepts_custom_dishes
  )
);

create policy "reservations_update_participants" on public.reservations
for update using (
  user_id = auth.uid()
  or public.user_owns_restaurant(restaurant_id)
  or public.current_user_is_admin()
);

create policy "order_events_select_participants" on public.order_status_events
for select using (
  exists (
    select 1 from public.reservations r
    where r.id = reservation_id
    and (r.user_id = auth.uid() or public.user_owns_restaurant(r.restaurant_id))
  )
  or public.current_user_is_admin()
);

create policy "order_events_insert_restaurant_or_admin" on public.order_status_events
for insert with check (
  exists (
    select 1 from public.reservations r
    where r.id = reservation_id and public.user_owns_restaurant(r.restaurant_id)
  )
  or public.current_user_is_admin()
);

create policy "chat_threads_select_participants" on public.chat_threads
for select using (user_id = auth.uid() or public.user_owns_restaurant(restaurant_id) or public.current_user_is_admin());

create policy "chat_threads_insert_for_own_reservation" on public.chat_threads
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.reservations r
    where r.id = reservation_id and r.user_id = auth.uid()
  )
);

create policy "chat_messages_select_thread_participants" on public.chat_messages
for select using (
  exists (
    select 1 from public.chat_threads t
    where t.id = thread_id
    and (t.user_id = auth.uid() or public.user_owns_restaurant(t.restaurant_id))
  )
  or public.current_user_is_admin()
);

create policy "chat_messages_insert_thread_participants" on public.chat_messages
for insert with check (
  exists (
    select 1 from public.chat_threads t
    where t.id = thread_id
    and (t.user_id = auth.uid() or public.user_owns_restaurant(t.restaurant_id))
  )
);

create policy "nutrition_progress_manage_own" on public.nutrition_progress
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "challenges_public_active" on public.challenges
for select using (is_active or public.current_user_is_admin());

create policy "challenges_admin_manage" on public.challenges
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

create policy "user_challenges_manage_own" on public.user_challenges
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "achievements_public" on public.achievements
for select using (true);

create policy "achievements_admin_manage" on public.achievements
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

create policy "user_achievements_select_own" on public.user_achievements
for select using (user_id = auth.uid() or public.current_user_is_admin());

create policy "user_achievements_insert_admin" on public.user_achievements
for insert with check (public.current_user_is_admin());

create policy "ratings_select_public" on public.ratings
for select using (is_moderated = false or user_id = auth.uid() or public.current_user_is_admin());

create policy "ratings_insert_own_delivered" on public.ratings
for insert with check (
  user_id = auth.uid()
  and (
    reservation_id is null
    or exists (
      select 1 from public.reservations r
      where r.id = reservation_id and r.user_id = auth.uid() and r.status = 'delivered'
    )
  )
);

create policy "notifications_manage_own" on public.notifications
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "income_select_restaurant_owner" on public.restaurant_income_entries
for select using (public.user_owns_restaurant(restaurant_id) or public.current_user_is_admin());

create policy "income_admin_manage" on public.restaurant_income_entries
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

create policy "payment_reports_select_restaurant_owner" on public.restaurant_payment_reports
for select using (public.user_owns_restaurant(restaurant_id) or public.current_user_is_admin());

create policy "payment_reports_admin_manage" on public.restaurant_payment_reports
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

insert into public.challenges (title, description, tier, points_reward)
values
  ('Primer plato saludable', 'Agrega tu primer plato al plan semanal.', 'freemium', 20),
  ('Reserva premium a medida', 'Completa una reserva con un restaurante verificado.', 'premium', 50),
  ('Semana consistente', 'Registra progreso nutricional durante 7 dias.', 'premium', 100);

insert into public.achievements (name, description, tier, badge_kind, points_reward)
values
  ('Inicio NutriConnect', 'Completo el perfil inicial.', 'freemium', 'bronze', 10),
  ('Reserva verificada', 'Recibio un plato a medida confirmado.', 'premium', 'silver', 50),
  ('Constancia nutricional', 'Mantuvo seguimiento semanal completo.', 'premium', 'gold', 100);

alter publication supabase_realtime add table public.reservations;
alter publication supabase_realtime add table public.order_status_events;
alter publication supabase_realtime add table public.chat_threads;
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.notifications;
