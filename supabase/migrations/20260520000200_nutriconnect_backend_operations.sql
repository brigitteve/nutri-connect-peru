-- NutriConnect backend operations
-- Adds payments, push devices, digital scale integration, audit logs,
-- dish customization, storage buckets, and business RPCs/triggers.

create type public.payment_provider as enum ('stripe', 'mercadopago', 'culqi', 'manual');
create type public.subscription_status as enum ('inactive', 'trialing', 'active', 'past_due', 'cancelled');
create type public.payment_event_status as enum ('received', 'processed', 'failed', 'ignored');
create type public.push_platform as enum ('ios', 'android', 'web');
create type public.scale_device_status as enum ('pending', 'active', 'revoked');
create type public.audit_action as enum (
  'reservation_created',
  'reservation_status_changed',
  'payment_processed',
  'dish_changed',
  'restaurant_verified',
  'scale_measurement_ingested',
  'rating_created',
  'profile_changed'
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider public.payment_provider not null,
  provider_customer_id text,
  provider_subscription_id text,
  status public.subscription_status not null default 'inactive',
  tier public.subscription_tier not null default 'premium',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_subscription_id)
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider public.payment_provider not null,
  provider_event_id text not null,
  user_id uuid references public.profiles(id) on delete set null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  status public.payment_event_status not null default 'received',
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  error_message text,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create table public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  platform public.push_platform not null,
  token text not null,
  enabled boolean not null default true,
  preferences jsonb not null default '{"reservation":true,"order_status":true,"gamification":true,"nutrition_tip":true,"payment":true,"system":true,"chat":true}'::jsonb,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (platform, token)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action public.audit_action not null,
  target_table text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.digital_scale_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  device_name text not null,
  provider text not null default 'generic',
  external_device_id text,
  status public.scale_device_status not null default 'pending',
  paired_at timestamptz,
  last_seen_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, external_device_id)
);

create table public.scale_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  device_id uuid references public.digital_scale_devices(id) on delete set null,
  reservation_id uuid references public.reservations(id) on delete set null,
  dish_id uuid references public.dishes(id) on delete set null,
  measured_at timestamptz not null default now(),
  gross_weight_g numeric(10,2) check (gross_weight_g is null or gross_weight_g >= 0),
  tare_weight_g numeric(10,2) not null default 0 check (tare_weight_g >= 0),
  net_weight_g numeric(10,2) generated always as (greatest(coalesce(gross_weight_g, 0) - tare_weight_g, 0)) stored,
  macros jsonb not null default '{"protein_g":0,"carbs_g":0,"fat_g":0,"calories":0}'::jsonb,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.dish_customizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  base_dish_id uuid references public.dishes(id) on delete set null,
  nutritionist_id uuid references public.profiles(id) on delete set null,
  name text not null,
  instructions text,
  ingredients jsonb not null default '[]'::jsonb,
  macros jsonb not null default '{"protein_g":0,"carbs_g":0,"fat_g":0}'::jsonb,
  calories integer not null default 0 check (calories >= 0),
  cost_pen numeric(10,2) not null default 0 check (cost_pen >= 0),
  allergy_tags text[] not null default '{}',
  restriction_tags text[] not null default '{}',
  objective_tags text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications(id) on delete cascade,
  push_token_id uuid references public.push_tokens(id) on delete set null,
  status text not null default 'pending',
  provider_response jsonb not null default '{}'::jsonb,
  attempted_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_subscriptions_user_status on public.subscriptions(user_id, status);
create index idx_payment_events_subscription on public.payment_events(subscription_id);
create index idx_push_tokens_user_enabled on public.push_tokens(user_id, enabled);
create index idx_audit_logs_target on public.audit_logs(target_table, target_id);
create index idx_scale_devices_user_status on public.digital_scale_devices(user_id, status);
create index idx_scale_measurements_user_measured on public.scale_measurements(user_id, measured_at desc);
create index idx_dish_customizations_user_restaurant on public.dish_customizations(user_id, restaurant_id);
create index idx_notification_deliveries_notification on public.notification_deliveries(notification_id);

alter table public.subscriptions enable row level security;
alter table public.payment_events enable row level security;
alter table public.push_tokens enable row level security;
alter table public.audit_logs enable row level security;
alter table public.digital_scale_devices enable row level security;
alter table public.scale_measurements enable row level security;
alter table public.dish_customizations enable row level security;
alter table public.notification_deliveries enable row level security;

create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create trigger set_scale_devices_updated_at
before update on public.digital_scale_devices
for each row execute function public.set_updated_at();

create trigger set_dish_customizations_updated_at
before update on public.dish_customizations
for each row execute function public.set_updated_at();

create policy "subscriptions_select_own_or_admin" on public.subscriptions
for select using (user_id = auth.uid() or public.current_user_is_admin());

create policy "subscriptions_admin_manage" on public.subscriptions
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

create policy "payment_events_select_own_or_admin" on public.payment_events
for select using (user_id = auth.uid() or public.current_user_is_admin());

create policy "payment_events_admin_manage" on public.payment_events
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

create policy "push_tokens_manage_own" on public.push_tokens
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "audit_logs_admin_select" on public.audit_logs
for select using (public.current_user_is_admin());

create policy "audit_logs_admin_insert" on public.audit_logs
for insert with check (public.current_user_is_admin());

create policy "scale_devices_manage_own" on public.digital_scale_devices
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "scale_measurements_manage_own" on public.scale_measurements
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "dish_customizations_select_participants" on public.dish_customizations
for select using (
  user_id = auth.uid()
  or public.user_owns_restaurant(restaurant_id)
  or nutritionist_id = auth.uid()
  or public.current_user_is_admin()
);

create policy "dish_customizations_insert_premium_verified" on public.dish_customizations
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

create policy "dish_customizations_update_participants" on public.dish_customizations
for update using (
  user_id = auth.uid()
  or public.user_owns_restaurant(restaurant_id)
  or nutritionist_id = auth.uid()
  or public.current_user_is_admin()
);

create policy "notification_deliveries_select_own" on public.notification_deliveries
for select using (
  exists (
    select 1 from public.notifications n
    where n.id = notification_id and n.user_id = auth.uid()
  )
  or public.current_user_is_admin()
);

create policy "notification_deliveries_admin_manage" on public.notification_deliveries
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('dish-photos', 'dish-photos', true, 5242880, array['image/png', 'image/jpeg', 'image/webp']),
  ('restaurant-verification', 'restaurant-verification', false, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'application/pdf']),
  ('exports', 'exports', false, 10485760, array['text/csv', 'application/pdf', 'application/json'])
on conflict (id) do nothing;

create policy "dish_photos_public_read" on storage.objects
for select using (bucket_id = 'dish-photos');

create policy "dish_photos_authenticated_upload" on storage.objects
for insert with check (bucket_id = 'dish-photos' and auth.role() = 'authenticated');

create policy "private_storage_admin_read" on storage.objects
for select using (
  bucket_id in ('restaurant-verification', 'exports')
  and public.current_user_is_admin()
);

create policy "restaurant_verification_owner_upload" on storage.objects
for insert with check (
  bucket_id = 'restaurant-verification'
  and auth.role() = 'authenticated'
);

create policy "exports_owner_read" on storage.objects
for select using (
  bucket_id = 'exports'
  and auth.role() = 'authenticated'
  and owner = auth.uid()
);

create or replace function public.log_audit(
  target_action public.audit_action,
  target_table_name text default null,
  target_row_id uuid default null,
  target_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  audit_id uuid;
begin
  insert into public.audit_logs (actor_id, action, target_table, target_id, metadata)
  values (auth.uid(), target_action, target_table_name, target_row_id, target_metadata)
  returning id into audit_id;

  return audit_id;
end;
$$;

create or replace function public.calculate_level(total_points integer)
returns integer
language sql
immutable
as $$
  select greatest(1, floor(sqrt(greatest(total_points, 0) / 100.0))::integer + 1);
$$;

create or replace function public.award_user_points(
  target_user_id uuid,
  points_to_add integer,
  reason text,
  metadata jsonb default '{}'::jsonb
)
returns table (new_points integer, new_level integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  if points_to_add <= 0 then
    raise exception 'points_to_add must be positive';
  end if;

  update public.profiles
  set
    points = points + points_to_add,
    level = public.calculate_level(points + points_to_add)
  where id = target_user_id
  returning points, level into new_points, new_level;

  if new_points is null then
    raise exception 'Profile % not found', target_user_id;
  end if;

  insert into public.notifications (user_id, type, title, body, metadata)
  values (
    target_user_id,
    'gamification',
    'Puntos ganados',
    'Ganaste ' || points_to_add || ' puntos.',
    metadata || jsonb_build_object('reason', reason, 'points', points_to_add)
  );

  return next;
end;
$$;

create or replace function public.create_premium_reservation(
  target_dish_id uuid,
  target_fulfillment public.fulfillment_mode,
  target_scheduled_at timestamptz,
  target_address text default null,
  target_user_notes text default null
)
returns public.reservations
language plpgsql
security definer
set search_path = public
as $$
declare
  current_profile public.profiles;
  selected_dish public.dishes;
  selected_restaurant public.restaurants;
  created_reservation public.reservations;
begin
  select * into current_profile
  from public.profiles
  where id = auth.uid();

  if current_profile.id is null then
    raise exception 'Profile not found';
  end if;

  if current_profile.subscription <> 'premium' then
    raise exception 'Premium subscription required';
  end if;

  select * into selected_dish
  from public.dishes
  where id = target_dish_id and is_available = true;

  if selected_dish.id is null then
    raise exception 'Dish is not available';
  end if;

  select * into selected_restaurant
  from public.restaurants
  where id = selected_dish.restaurant_id;

  if selected_restaurant.verification_status <> 'verified' or selected_restaurant.accepts_custom_dishes is false then
    raise exception 'Restaurant is not verified for custom dishes';
  end if;

  if target_scheduled_at < now() + interval '30 minutes' then
    raise exception 'Reservation must be scheduled at least 30 minutes in advance';
  end if;

  insert into public.reservations (
    user_id,
    restaurant_id,
    dish_id,
    status,
    fulfillment,
    scheduled_at,
    address,
    user_notes,
    subtotal_pen,
    delivery_fee_pen,
    points_awarded,
    user_confirmed_at
  )
  values (
    auth.uid(),
    selected_dish.restaurant_id,
    selected_dish.id,
    'pending_restaurant',
    target_fulfillment,
    target_scheduled_at,
    target_address,
    target_user_notes,
    selected_dish.cost_pen,
    case when target_fulfillment = 'delivery' then 6.00 else 0 end,
    0,
    now()
  )
  returning * into created_reservation;

  insert into public.order_status_events (reservation_id, status, note, created_by)
  values (created_reservation.id, created_reservation.status, 'Reserva creada', auth.uid());

  insert into public.chat_threads (reservation_id, user_id, restaurant_id)
  values (created_reservation.id, created_reservation.user_id, created_reservation.restaurant_id);

  insert into public.notifications (user_id, type, title, body, metadata)
  values (
    selected_restaurant.owner_id,
    'reservation',
    'Nueva reserva premium',
    current_profile.full_name || ' solicito una reserva.',
    jsonb_build_object('reservation_id', created_reservation.id)
  );

  perform public.log_audit(
    'reservation_created',
    'reservations',
    created_reservation.id,
    jsonb_build_object('dish_id', selected_dish.id, 'restaurant_id', selected_restaurant.id)
  );

  return created_reservation;
end;
$$;

create or replace function public.advance_reservation_status(
  target_reservation_id uuid,
  next_status public.reservation_status,
  status_note text default null
)
returns public.reservations
language plpgsql
security definer
set search_path = public
as $$
declare
  current_reservation public.reservations;
  updated_reservation public.reservations;
  allowed boolean := false;
begin
  select * into current_reservation
  from public.reservations
  where id = target_reservation_id
  for update;

  if current_reservation.id is null then
    raise exception 'Reservation not found';
  end if;

  if not (
    current_reservation.user_id = auth.uid()
    or public.user_owns_restaurant(current_reservation.restaurant_id)
    or public.current_user_is_admin()
  ) then
    raise exception 'Not allowed';
  end if;

  allowed := case current_reservation.status
    when 'pending_restaurant' then next_status in ('accepted', 'adjusted_time', 'rejected', 'cancelled')
    when 'accepted' then next_status in ('preparing', 'cancelled')
    when 'adjusted_time' then next_status in ('accepted', 'cancelled')
    when 'preparing' then next_status in ('ready', 'cancelled')
    when 'ready' then next_status in ('on_the_way', 'delivered')
    when 'on_the_way' then next_status in ('delivered')
    else false
  end;

  if not allowed then
    raise exception 'Invalid status transition from % to %', current_reservation.status, next_status;
  end if;

  update public.reservations
  set
    status = next_status,
    restaurant_confirmed_at = case when next_status in ('accepted', 'adjusted_time') and restaurant_confirmed_at is null then now() else restaurant_confirmed_at end,
    delivered_at = case when next_status = 'delivered' then now() else delivered_at end
  where id = target_reservation_id
  returning * into updated_reservation;

  insert into public.order_status_events (reservation_id, status, note, created_by)
  values (target_reservation_id, next_status, status_note, auth.uid());

  insert into public.notifications (user_id, type, title, body, metadata)
  values (
    updated_reservation.user_id,
    'order_status',
    'Pedido actualizado',
    'Tu pedido ahora esta en estado ' || next_status::text || '.',
    jsonb_build_object('reservation_id', target_reservation_id, 'status', next_status)
  );

  if next_status = 'delivered' and updated_reservation.points_awarded = 0 then
    update public.reservations
    set points_awarded = 50
    where id = target_reservation_id
    returning * into updated_reservation;

    perform public.award_user_points(updated_reservation.user_id, 50, 'reservation_delivered', jsonb_build_object('reservation_id', target_reservation_id));

    insert into public.restaurant_income_entries (restaurant_id, reservation_id, gross_pen, commission_pen, status)
    values (
      updated_reservation.restaurant_id,
      updated_reservation.id,
      updated_reservation.total_pen,
      round(updated_reservation.total_pen * 0.12, 2),
      'payable'
    )
    on conflict do nothing;
  end if;

  perform public.log_audit(
    'reservation_status_changed',
    'reservations',
    target_reservation_id,
    jsonb_build_object('from', current_reservation.status, 'to', next_status)
  );

  return updated_reservation;
end;
$$;

create or replace function public.recalculate_restaurant_rating(target_restaurant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  average_score numeric(3,2);
  total_count integer;
  new_medal text;
begin
  select coalesce(round(avg(score)::numeric, 2), 0), count(*)
  into average_score, total_count
  from public.ratings
  where restaurant_id = target_restaurant_id and is_moderated = false;

  new_medal := case
    when total_count >= 50 and average_score >= 4.7 then 'gold'
    when total_count >= 20 and average_score >= 4.4 then 'silver'
    when total_count >= 10 and average_score >= 4.0 then 'bronze'
    else null
  end;

  update public.restaurants
  set rating_average = average_score,
      rating_count = total_count,
      medal = new_medal
  where id = target_restaurant_id;
end;
$$;

create or replace function public.moderate_rating_comment()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.comment is not null and (
    length(new.comment) > 1000
    or new.comment ~* '(https?://|www\.|casino|spam|abuso|insulto)'
  ) then
    new.is_moderated = true;
  end if;

  return new;
end;
$$;

create trigger ratings_before_moderation
before insert or update on public.ratings
for each row execute function public.moderate_rating_comment();

create or replace function public.after_rating_changed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' and old.restaurant_id is not null then
    perform public.recalculate_restaurant_rating(old.restaurant_id);
  elsif tg_op <> 'DELETE' and new.restaurant_id is not null then
    perform public.recalculate_restaurant_rating(new.restaurant_id);
  end if;

  if tg_op = 'INSERT' then
    perform public.award_user_points(new.user_id, 10, 'rating_created', jsonb_build_object('rating_id', new.id));
    perform public.log_audit('rating_created', 'ratings', new.id, jsonb_build_object('target', new.target));
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create trigger ratings_after_change
after insert or update or delete on public.ratings
for each row execute function public.after_rating_changed();

create or replace function public.verify_restaurant(
  target_restaurant_id uuid,
  target_status public.restaurant_verification_status,
  target_accepts_custom_dishes boolean default true,
  target_note text default null
)
returns public.restaurants
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_restaurant public.restaurants;
begin
  if not public.current_user_is_admin() then
    raise exception 'Admin role required';
  end if;

  update public.restaurants
  set
    verification_status = target_status,
    accepts_custom_dishes = case when target_status = 'verified' then target_accepts_custom_dishes else false end
  where id = target_restaurant_id
  returning * into updated_restaurant;

  if updated_restaurant.id is null then
    raise exception 'Restaurant not found';
  end if;

  insert into public.notifications (user_id, type, title, body, metadata)
  values (
    updated_restaurant.owner_id,
    'system',
    'Verificacion de restaurante',
    'El estado de tu restaurante ahora es ' || target_status::text || '.',
    jsonb_build_object('restaurant_id', updated_restaurant.id, 'note', target_note)
  );

  perform public.log_audit(
    'restaurant_verified',
    'restaurants',
    updated_restaurant.id,
    jsonb_build_object('status', target_status, 'note', target_note)
  );

  return updated_restaurant;
end;
$$;

create or replace function public.register_push_token(
  target_platform public.push_platform,
  target_token text,
  target_preferences jsonb default null
)
returns public.push_tokens
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_token public.push_tokens;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  insert into public.push_tokens (user_id, platform, token, preferences, last_seen_at)
  values (
    auth.uid(),
    target_platform,
    target_token,
    coalesce(target_preferences, '{"reservation":true,"order_status":true,"gamification":true,"nutrition_tip":true,"payment":true,"system":true,"chat":true}'::jsonb),
    now()
  )
  on conflict (platform, token) do update
  set
    user_id = excluded.user_id,
    enabled = true,
    preferences = excluded.preferences,
    last_seen_at = now()
  returning * into saved_token;

  return saved_token;
end;
$$;

create or replace function public.pair_scale_device(
  target_device_name text,
  target_provider text,
  target_external_device_id text,
  target_metadata jsonb default '{}'::jsonb
)
returns public.digital_scale_devices
language plpgsql
security definer
set search_path = public
as $$
declare
  current_subscription public.subscription_tier;
  saved_device public.digital_scale_devices;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select subscription into current_subscription
  from public.profiles
  where id = auth.uid();

  if current_subscription is distinct from 'premium' then
    raise exception 'Premium subscription required';
  end if;

  insert into public.digital_scale_devices (
    user_id,
    device_name,
    provider,
    external_device_id,
    status,
    paired_at,
    last_seen_at,
    metadata
  )
  values (
    auth.uid(),
    target_device_name,
    target_provider,
    target_external_device_id,
    'active',
    now(),
    now(),
    target_metadata
  )
  on conflict (provider, external_device_id) do update
  set
    user_id = excluded.user_id,
    device_name = excluded.device_name,
    status = 'active',
    paired_at = coalesce(public.digital_scale_devices.paired_at, now()),
    last_seen_at = now(),
    metadata = public.digital_scale_devices.metadata || excluded.metadata
  returning * into saved_device;

  return saved_device;
end;
$$;

create or replace function public.create_dish_customization(
  target_restaurant_id uuid,
  target_base_dish_id uuid,
  target_name text,
  target_instructions text,
  target_ingredients jsonb,
  target_macros jsonb,
  target_calories integer,
  target_cost_pen numeric,
  target_allergy_tags text[] default '{}',
  target_restriction_tags text[] default '{}',
  target_objective_tags text[] default '{}'
)
returns public.dish_customizations
language plpgsql
security definer
set search_path = public
as $$
declare
  current_profile public.profiles;
  target_restaurant public.restaurants;
  created_customization public.dish_customizations;
begin
  select * into current_profile
  from public.profiles
  where id = auth.uid();

  if current_profile.id is null then
    raise exception 'Authentication required';
  end if;

  if current_profile.subscription <> 'premium' then
    raise exception 'Premium subscription required';
  end if;

  select * into target_restaurant
  from public.restaurants
  where id = target_restaurant_id;

  if target_restaurant.id is null then
    raise exception 'Restaurant not found';
  end if;

  if target_restaurant.verification_status <> 'verified' or target_restaurant.accepts_custom_dishes is false then
    raise exception 'Restaurant is not verified for custom dishes';
  end if;

  insert into public.dish_customizations (
    user_id,
    restaurant_id,
    base_dish_id,
    name,
    instructions,
    ingredients,
    macros,
    calories,
    cost_pen,
    allergy_tags,
    restriction_tags,
    objective_tags
  )
  values (
    auth.uid(),
    target_restaurant_id,
    target_base_dish_id,
    target_name,
    target_instructions,
    coalesce(target_ingredients, '[]'::jsonb),
    coalesce(target_macros, '{"protein_g":0,"carbs_g":0,"fat_g":0}'::jsonb),
    target_calories,
    target_cost_pen,
    target_allergy_tags,
    target_restriction_tags,
    target_objective_tags
  )
  returning * into created_customization;

  perform public.log_audit(
    'dish_changed',
    'dish_customizations',
    created_customization.id,
    jsonb_build_object('restaurant_id', target_restaurant_id, 'base_dish_id', target_base_dish_id)
  );

  return created_customization;
end;
$$;

create or replace function public.process_subscription_payment(
  target_provider public.payment_provider,
  target_provider_event_id text,
  target_user_id uuid,
  target_provider_customer_id text,
  target_provider_subscription_id text,
  target_status public.subscription_status,
  target_period_start timestamptz default null,
  target_period_end timestamptz default null,
  target_payload jsonb default '{}'::jsonb
)
returns public.subscriptions
language plpgsql
security definer
set search_path = public
as $$
declare
  target_subscription public.subscriptions;
begin
  insert into public.subscriptions (
    user_id,
    provider,
    provider_customer_id,
    provider_subscription_id,
    status,
    tier,
    current_period_start,
    current_period_end,
    metadata
  )
  values (
    target_user_id,
    target_provider,
    target_provider_customer_id,
    target_provider_subscription_id,
    target_status,
    'premium',
    target_period_start,
    target_period_end,
    target_payload
  )
  on conflict (provider, provider_subscription_id) do update
  set
    status = excluded.status,
    current_period_start = excluded.current_period_start,
    current_period_end = excluded.current_period_end,
    metadata = public.subscriptions.metadata || excluded.metadata,
    updated_at = now()
  returning * into target_subscription;

  insert into public.payment_events (
    provider,
    provider_event_id,
    user_id,
    subscription_id,
    status,
    event_type,
    payload,
    processed_at
  )
  values (
    target_provider,
    target_provider_event_id,
    target_user_id,
    target_subscription.id,
    'processed',
    coalesce(target_payload->>'type', 'subscription.updated'),
    target_payload,
    now()
  )
  on conflict (provider, provider_event_id) do nothing;

  update public.profiles
  set subscription = case when target_status in ('trialing', 'active') then 'premium' else 'freemium' end
  where id = target_user_id;

  insert into public.notifications (user_id, type, title, body, metadata)
  values (
    target_user_id,
    'payment',
    'Suscripcion actualizada',
    'Tu suscripcion ahora esta ' || target_status::text || '.',
    jsonb_build_object('subscription_id', target_subscription.id, 'status', target_status)
  );

  perform public.log_audit(
    'payment_processed',
    'subscriptions',
    target_subscription.id,
    jsonb_build_object('provider', target_provider, 'status', target_status)
  );

  return target_subscription;
end;
$$;

create or replace function public.ingest_scale_measurement(
  target_device_id uuid,
  target_gross_weight_g numeric,
  target_tare_weight_g numeric default 0,
  target_reservation_id uuid default null,
  target_dish_id uuid default null,
  target_macros jsonb default '{"protein_g":0,"carbs_g":0,"fat_g":0,"calories":0}'::jsonb,
  target_raw_payload jsonb default '{}'::jsonb
)
returns public.scale_measurements
language plpgsql
security definer
set search_path = public
as $$
declare
  target_device public.digital_scale_devices;
  current_profile public.profiles;
  created_measurement public.scale_measurements;
begin
  select * into target_device
  from public.digital_scale_devices
  where id = target_device_id and status = 'active';

  if target_device.id is null then
    raise exception 'Active scale device not found';
  end if;

  select * into current_profile
  from public.profiles
  where id = target_device.user_id;

  if current_profile.subscription <> 'premium' then
    raise exception 'Premium subscription required';
  end if;

  if auth.uid() is not null and auth.uid() <> target_device.user_id and not public.current_user_is_admin() then
    raise exception 'Not allowed';
  end if;

  insert into public.scale_measurements (
    user_id,
    device_id,
    reservation_id,
    dish_id,
    gross_weight_g,
    tare_weight_g,
    macros,
    raw_payload
  )
  values (
    target_device.user_id,
    target_device.id,
    target_reservation_id,
    target_dish_id,
    target_gross_weight_g,
    target_tare_weight_g,
    target_macros,
    target_raw_payload
  )
  returning * into created_measurement;

  update public.digital_scale_devices
  set last_seen_at = now()
  where id = target_device.id;

  insert into public.nutrition_progress (
    user_id,
    measured_on,
    calories,
    protein_g,
    carbs_g,
    fat_g,
    notes
  )
  values (
    target_device.user_id,
    current_date,
    coalesce((target_macros->>'calories')::integer, 0),
    coalesce((target_macros->>'protein_g')::numeric, 0),
    coalesce((target_macros->>'carbs_g')::numeric, 0),
    coalesce((target_macros->>'fat_g')::numeric, 0),
    'Registro desde balanza digital'
  )
  on conflict (user_id, measured_on) do update
  set
    calories = coalesce(public.nutrition_progress.calories, 0) + excluded.calories,
    protein_g = coalesce(public.nutrition_progress.protein_g, 0) + excluded.protein_g,
    carbs_g = coalesce(public.nutrition_progress.carbs_g, 0) + excluded.carbs_g,
    fat_g = coalesce(public.nutrition_progress.fat_g, 0) + excluded.fat_g;

  perform public.log_audit(
    'scale_measurement_ingested',
    'scale_measurements',
    created_measurement.id,
    jsonb_build_object('device_id', target_device.id)
  );

  return created_measurement;
end;
$$;

create or replace function public.generate_restaurant_payment_report(
  target_restaurant_id uuid,
  target_period_start date,
  target_period_end date
)
returns public.restaurant_payment_reports
language plpgsql
security definer
set search_path = public
as $$
declare
  generated_report public.restaurant_payment_reports;
begin
  if target_period_end < target_period_start then
    raise exception 'Invalid report period';
  end if;

  if not (public.user_owns_restaurant(target_restaurant_id) or public.current_user_is_admin()) then
    raise exception 'Not allowed';
  end if;

  insert into public.restaurant_payment_reports (
    restaurant_id,
    period_start,
    period_end,
    gross_pen,
    commission_pen,
    net_pen
  )
  select
    target_restaurant_id,
    target_period_start,
    target_period_end,
    coalesce(sum(gross_pen), 0),
    coalesce(sum(commission_pen), 0),
    coalesce(sum(net_pen), 0)
  from public.restaurant_income_entries
  where restaurant_id = target_restaurant_id
    and created_at::date between target_period_start and target_period_end
    and status in ('payable', 'paid')
  returning * into generated_report;

  return generated_report;
end;
$$;

alter table public.subscriptions replica identity full;
alter table public.push_tokens replica identity full;
alter table public.scale_measurements replica identity full;
alter table public.notification_deliveries replica identity full;

alter publication supabase_realtime add table public.push_tokens;
alter publication supabase_realtime add table public.scale_measurements;
alter publication supabase_realtime add table public.notification_deliveries;
