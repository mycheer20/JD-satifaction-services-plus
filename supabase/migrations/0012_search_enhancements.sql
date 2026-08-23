-- 0012 — Recherche élargie, filtres taxonomy/modèle, tolérance aux fautes (pg_trgm).

-- ---------------------------------------------------------------------------
-- text_matches_query — substring OR fuzzy trigram match
-- ---------------------------------------------------------------------------

create or replace function public.text_matches_query(haystack text, needle text)
returns boolean
language sql
immutable
strict
set search_path = public, extensions, pg_catalog
as $$
  select
    nullif(trim(coalesce(needle, '')), '') is null
    or nullif(trim(coalesce(haystack, '')), '') is not null
       and (
         public.normalize_text(haystack) like '%' || public.normalize_text(needle) || '%'
         or extensions.similarity(
              public.normalize_text(haystack),
              public.normalize_text(needle)
            ) >= 0.28
         or extensions.word_similarity(
              public.normalize_text(needle),
              public.normalize_text(haystack)
            ) >= 0.38
       );
$$;

-- ---------------------------------------------------------------------------
-- product_matches_query — a single search token against all searchable fields
-- ---------------------------------------------------------------------------

create or replace function public.product_matches_word(p_product_id uuid, p_word text)
returns boolean
language sql
stable
set search_path = public, extensions, pg_catalog
as $$
  select exists (
    select 1
    from public.products p
    left join public.brands b on b.id = p.brand_id
    join public.subcategories s on s.id = p.subcategory_id
    join public.categories c on c.id = s.category_id
    join public.families f on f.id = c.family_id
    where p.id = p_product_id
      and (
        public.text_matches_query(p.name, p_word)
        or public.text_matches_query(coalesce(p.model, ''), p_word)
        or public.text_matches_query(coalesce(p.sku, ''), p_word)
        or public.text_matches_query(coalesce(p.short_description, ''), p_word)
        or public.text_matches_query(coalesce(b.name, ''), p_word)
        or public.text_matches_query(s.name, p_word)
        or public.text_matches_query(c.name, p_word)
        or public.text_matches_query(f.name, p_word)
        or public.text_matches_query(public.tags_to_text(p.tags), p_word)
        or exists (
          select 1
          from public.product_attributes pa
          where pa.product_id = p.id
            and public.text_matches_query(coalesce(pa.value_text, ''), p_word)
        )
      )
  );
$$;

create or replace function public.product_matches_query(p_product_id uuid, p_query text)
returns boolean
language sql
stable
set search_path = public, extensions, pg_catalog
as $$
  select
    nullif(trim(coalesce(p_query, '')), '') is null
    or not exists (
      select 1
      from unnest(regexp_split_to_array(trim(p_query), '\s+')) as parts(word)
      where word <> ''
        and not public.product_matches_word(p_product_id, word)
    );
$$;

-- ---------------------------------------------------------------------------
-- search_product_ids — extended filters + fuzzy query
-- ---------------------------------------------------------------------------

drop function if exists public.search_product_ids(
  text, text, text, text, text[], numeric, numeric, boolean,
  numeric, boolean, jsonb, text, integer, integer
);

create or replace function public.search_product_ids(
  p_query             text default null,
  p_family            text default null,
  p_category          text default null,
  p_subcategory       text default null,
  p_brand_slugs       text[] default null,
  p_min_price         numeric default null,
  p_max_price         numeric default null,
  p_in_stock          boolean default null,
  p_min_rating        numeric default null,
  p_featured          boolean default null,
  p_attributes        jsonb default '{}'::jsonb,
  p_sort              text default 'relevance',
  p_limit             integer default 24,
  p_offset            integer default 0,
  p_family_slugs      text[] default null,
  p_category_slugs    text[] default null,
  p_subcategory_slugs text[] default null,
  p_models            text[] default null
)
returns table (id uuid, total_count bigint)
language sql
stable
set search_path = public, extensions, pg_catalog
as $$
  with scoped as (
    select p.*,
           case
             when nullif(trim(coalesce(p_query, '')), '') is null then 0
             else greatest(
               extensions.similarity(public.normalize_text(p.name), public.normalize_text(p_query)),
               extensions.similarity(public.normalize_text(coalesce(p.model, '')), public.normalize_text(p_query)),
               extensions.similarity(public.normalize_text(coalesce(b.name, '')), public.normalize_text(p_query)),
               ts_rank(p.search_document, plainto_tsquery('simple', p_query))
             )
           end as rank
    from public.products p
    join public.subcategories s on s.id = p.subcategory_id
    join public.categories c on c.id = s.category_id
    join public.families f on f.id = c.family_id
    left join public.brands b on b.id = p.brand_id
    where p.status = 'active'
      and s.is_active and c.is_active and f.is_active
      and (p_family is null or f.slug = p_family)
      and (p_category is null or c.slug = p_category)
      and (p_subcategory is null or s.slug = p_subcategory)
      and (
        p_family_slugs is null or array_length(p_family_slugs, 1) is null
        or f.slug = any (p_family_slugs)
      )
      and (
        p_category_slugs is null or array_length(p_category_slugs, 1) is null
        or c.slug = any (p_category_slugs)
      )
      and (
        p_subcategory_slugs is null or array_length(p_subcategory_slugs, 1) is null
        or s.slug = any (p_subcategory_slugs)
      )
      and (p_brand_slugs is null or array_length(p_brand_slugs, 1) is null or b.slug = any (p_brand_slugs))
      and (
        p_models is null or array_length(p_models, 1) is null
        or p.model = any (p_models)
      )
      and (p_min_price is null or coalesce(p.sale_price, p.price) >= p_min_price)
      and (p_max_price is null or coalesce(p.sale_price, p.price) <= p_max_price)
      and (p_in_stock is not true or p.track_inventory = false or p.stock > 0)
      and (p_min_rating is null or p.rating_average >= p_min_rating)
      and (p_featured is null or p.is_featured = p_featured)
      and public.product_matches_query(p.id, p_query)
      and (
        p_attributes is null
        or p_attributes = '{}'::jsonb
        or not exists (
          select 1
          from jsonb_each(p_attributes) as filt(field_key, wanted)
          where not exists (
            select 1
            from public.product_attributes pa
            where pa.product_id = p.id
              and pa.field_key = filt.field_key
              and pa.value_text = any (
                select jsonb_array_elements_text(filt.wanted)
              )
          )
        )
      )
  ),
  counted as (select count(*) as total from scoped)
  select scoped.id, counted.total
  from scoped, counted
  order by
    case when p_sort = 'price_asc'  then coalesce(scoped.sale_price, scoped.price) end asc,
    case when p_sort = 'price_desc' then coalesce(scoped.sale_price, scoped.price) end desc,
    case when p_sort = 'rating'     then scoped.rating_average end desc,
    case when p_sort = 'newest'     then scoped.published_at end desc,
    case when p_sort = 'name'       then scoped.name end asc,
    scoped.rank desc,
    scoped.is_featured desc,
    scoped.published_at desc nulls last
  limit greatest(coalesce(p_limit, 24), 1)
  offset greatest(coalesce(p_offset, 0), 0);
$$;

grant execute on function public.search_product_ids(
  text, text, text, text, text[], numeric, numeric, boolean,
  numeric, boolean, jsonb, text, integer, integer,
  text[], text[], text[], text[]
) to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- catalog_facets — taxonomy + models
-- ---------------------------------------------------------------------------

drop function if exists public.catalog_facets(text, text, text, text);

create or replace function public.catalog_facets(
  p_family            text default null,
  p_category          text default null,
  p_subcategory       text default null,
  p_query             text default null,
  p_brand_slugs       text[] default null,
  p_family_slugs      text[] default null,
  p_category_slugs    text[] default null,
  p_subcategory_slugs text[] default null,
  p_models            text[] default null
)
returns jsonb
language sql
stable
set search_path = public, extensions, pg_catalog
as $$
  with scoped as (
    select p.id, p.brand_id, p.price, p.sale_price, p.subcategory_id, p.model,
           f.slug as family_slug, f.name as family_name,
           c.slug as category_slug, c.name as category_name,
           s.slug as subcategory_slug, s.name as subcategory_name
    from public.products p
    join public.subcategories s on s.id = p.subcategory_id
    join public.categories c on c.id = s.category_id
    join public.families f on f.id = c.family_id
    left join public.brands b on b.id = p.brand_id
    where p.status = 'active'
      and s.is_active and c.is_active and f.is_active
      and (p_family is null or f.slug = p_family)
      and (p_category is null or c.slug = p_category)
      and (p_subcategory is null or s.slug = p_subcategory)
      and (
        p_family_slugs is null or array_length(p_family_slugs, 1) is null
        or f.slug = any (p_family_slugs)
      )
      and (
        p_category_slugs is null or array_length(p_category_slugs, 1) is null
        or c.slug = any (p_category_slugs)
      )
      and (
        p_subcategory_slugs is null or array_length(p_subcategory_slugs, 1) is null
        or s.slug = any (p_subcategory_slugs)
      )
      and (p_brand_slugs is null or array_length(p_brand_slugs, 1) is null or b.slug = any (p_brand_slugs))
      and (
        p_models is null or array_length(p_models, 1) is null
        or p.model = any (p_models)
      )
      and public.product_matches_query(p.id, p_query)
  )
  select jsonb_build_object(
    'total', (select count(*) from scoped),
    'price', (
      select jsonb_build_object(
        'min', coalesce(min(coalesce(sale_price, price)), 0),
        'max', coalesce(max(coalesce(sale_price, price)), 0)
      ) from scoped
    ),
    'brands', coalesce((
      select jsonb_agg(x order by x ->> 'name')
      from (
        select jsonb_build_object('slug', b.slug, 'name', b.name, 'count', count(*)) as x
        from scoped sc
        join public.brands b on b.id = sc.brand_id
        group by b.slug, b.name
      ) t
    ), '[]'::jsonb),
    'families', coalesce((
      select jsonb_agg(x order by x ->> 'name')
      from (
        select jsonb_build_object(
          'slug', sc.family_slug, 'name', sc.family_name, 'count', count(*)
        ) as x
        from scoped sc
        group by sc.family_slug, sc.family_name
      ) t
    ), '[]'::jsonb),
    'categories', coalesce((
      select jsonb_agg(x order by x ->> 'name')
      from (
        select jsonb_build_object(
          'slug', sc.category_slug, 'name', sc.category_name,
          'familySlug', sc.family_slug, 'count', count(*)
        ) as x
        from scoped sc
        group by sc.category_slug, sc.category_name, sc.family_slug
      ) t
    ), '[]'::jsonb),
    'subcategories', coalesce((
      select jsonb_agg(x order by x ->> 'name')
      from (
        select jsonb_build_object(
          'slug', sc.subcategory_slug, 'name', sc.subcategory_name,
          'categorySlug', sc.category_slug, 'count', count(*)
        ) as x
        from scoped sc
        group by sc.subcategory_slug, sc.subcategory_name, sc.category_slug
      ) t
    ), '[]'::jsonb),
    'models', coalesce((
      select jsonb_agg(x order by x ->> 'name')
      from (
        select jsonb_build_object('name', sc.model, 'count', count(*)) as x
        from scoped sc
        where sc.model is not null and trim(sc.model) <> ''
        group by sc.model
      ) t
    ), '[]'::jsonb),
    'attributes', coalesce((
      select jsonb_agg(x order by x ->> 'position')
      from (
        select jsonb_build_object(
                 'key', vals.field_key,
                 'label', def.label,
                 'position', lpad(def.position::text, 4, '0'),
                 'values', jsonb_agg(
                   jsonb_build_object('value', vals.value_text, 'count', vals.n)
                   order by vals.value_text
                 )
               ) as x
        from (
          select pa.field_key, pa.value_text, count(*) as n
          from public.product_attributes pa
          join scoped sc on sc.id = pa.product_id
          where pa.value_text is not null and pa.value_text <> ''
          group by pa.field_key, pa.value_text
        ) vals
        join lateral (
          select fd.label, fd.position
          from public.field_definitions fd
          where fd.key = vals.field_key
            and fd.is_filterable
            and fd.field_set_id in (
              select distinct s2.field_set_id
              from scoped sc2
              join public.subcategories s2 on s2.id = sc2.subcategory_id
              where s2.field_set_id is not null
            )
          limit 1
        ) def on true
        group by vals.field_key, def.label, def.position
      ) t
    ), '[]'::jsonb)
  );
$$;

grant execute on function public.catalog_facets(
  text, text, text, text, text[], text[], text[], text[], text[]
) to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- search_suggestions — autocomplete with fuzzy matching
-- Returns: [{ kind, label, slug?, familySlug?, categorySlug?, score, meta }]
-- ---------------------------------------------------------------------------

create or replace function public.search_suggestions(p_query text, p_limit integer default 8)
returns jsonb
language sql
stable
set search_path = public, extensions, pg_catalog
as $$
  with q as (
    select trim(coalesce(p_query, '')) as raw,
           public.normalize_text(trim(coalesce(p_query, ''))) as norm
  ),
  hits as (
    select * from (
      select
        'product'::text as kind,
        p.name as label,
        p.slug as slug,
        null::text as family_slug,
        null::text as category_slug,
        coalesce(b.name, 'Produit') as meta,
        greatest(
          extensions.similarity(public.normalize_text(p.name), (select norm from q)),
          extensions.word_similarity((select norm from q), public.normalize_text(p.name))
        ) as score
      from public.products p
      left join public.brands b on b.id = p.brand_id
      where p.status = 'active'
        and (select raw from q) <> ''
        and public.product_matches_word(p.id, (select raw from q))

      union all

      select
        'brand', b.name, b.slug, null, null, 'Marque',
        extensions.similarity(public.normalize_text(b.name), (select norm from q))
      from public.brands b
      where (select raw from q) <> ''
        and public.text_matches_query(b.name, (select raw from q))

      union all

      select
        'category', c.name, c.slug, null, null, 'Catégorie',
        extensions.similarity(public.normalize_text(c.name), (select norm from q))
      from public.categories c
      where c.is_active
        and (select raw from q) <> ''
        and public.text_matches_query(c.name, (select raw from q))

      union all

      select
        'subcategory', s.name, s.slug, null, null, 'Sous-catégorie',
        extensions.similarity(public.normalize_text(s.name), (select norm from q))
      from public.subcategories s
      where s.is_active
        and (select raw from q) <> ''
        and public.text_matches_query(s.name, (select raw from q))

      union all

      select
        'family', f.name, f.slug, null, null, 'Famille',
        extensions.similarity(public.normalize_text(f.name), (select norm from q))
      from public.families f
      where f.is_active
        and (select raw from q) <> ''
        and public.text_matches_query(f.name, (select raw from q))

      union all

      select
        'model', p.model, p.model, null, null, 'Modèle',
        extensions.similarity(public.normalize_text(p.model), (select norm from q))
      from public.products p
      where p.status = 'active'
        and p.model is not null and trim(p.model) <> ''
        and (select raw from q) <> ''
        and public.text_matches_query(p.model, (select raw from q))
      group by p.model
    ) ranked
    order by score desc
    limit greatest(coalesce(p_limit, 8), 1)
  ),
  correction as (
    select jsonb_build_object(
      'kind', 'correction',
      'label', cand.label,
      'slug', cand.slug,
      'meta', 'Vouliez-vous dire…',
      'score', cand.score
    ) as item
    from (
      select label, slug, score
      from (
        select b.name as label, b.slug,
               extensions.similarity(public.normalize_text(b.name), (select norm from q)) as score
        from public.brands b
        union all
        select c.name, c.slug,
               extensions.similarity(public.normalize_text(c.name), (select norm from q))
        from public.categories c where c.is_active
        union all
        select f.name, f.slug,
               extensions.similarity(public.normalize_text(f.name), (select norm from q))
        from public.families f where f.is_active
        union all
        select p.name, p.slug,
               extensions.similarity(public.normalize_text(p.name), (select norm from q))
        from public.products p where p.status = 'active'
      ) candidates
      where score >= 0.4
        and public.normalize_text(label) <> (select norm from q)
      order by score desc
      limit 1
    ) cand
    where (select count(*) from hits) = 0
  )
  select coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'kind', kind, 'label', label, 'slug', slug,
          'meta', meta, 'score', score
        )
        order by score desc
      )
      from hits
    ),
    coalesce((select jsonb_build_array(item) from correction where item is not null), '[]'::jsonb)
  );
$$;

grant execute on function public.search_suggestions(text, integer)
  to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- global_search — fuzzy matching (legacy shape for callers expecting buckets)
-- ---------------------------------------------------------------------------

create or replace function public.global_search(p_query text, p_limit integer default 5)
returns jsonb
language sql
stable
set search_path = public, extensions, pg_catalog
as $$
  select jsonb_build_object(
    'products', coalesce((
      select jsonb_agg(jsonb_build_object(
        'slug', p.slug, 'name', p.name,
        'price', coalesce(p.sale_price, p.price),
        'image', (select url from public.product_images
                  where product_id = p.id
                  order by is_primary desc, position asc limit 1)
      ))
      from (
        select p.*
        from public.products p
        where p.status = 'active'
          and nullif(trim(coalesce(p_query, '')), '') is not null
          and public.product_matches_word(p.id, trim(p_query))
        order by p.is_featured desc, p.rating_average desc
        limit p_limit
      ) p
    ), '[]'::jsonb),
    'brands', coalesce((
      select jsonb_agg(jsonb_build_object('slug', slug, 'name', name))
      from (
        select slug, name from public.brands
        where public.text_matches_query(name, p_query)
        order by name limit p_limit
      ) b
    ), '[]'::jsonb),
    'categories', coalesce((
      select jsonb_agg(jsonb_build_object('slug', slug, 'name', name))
      from (
        select slug, name from public.categories
        where is_active and public.text_matches_query(name, p_query)
        order by name limit p_limit
      ) c
    ), '[]'::jsonb),
    'subcategories', coalesce((
      select jsonb_agg(jsonb_build_object('slug', slug, 'name', name))
      from (
        select slug, name from public.subcategories
        where is_active and public.text_matches_query(name, p_query)
        order by name limit p_limit
      ) s
    ), '[]'::jsonb),
    'families', coalesce((
      select jsonb_agg(jsonb_build_object('slug', slug, 'name', name))
      from (
        select slug, name from public.families
        where is_active and public.text_matches_query(name, p_query)
        order by name limit p_limit
      ) f
    ), '[]'::jsonb),
    'models', coalesce((
      select jsonb_agg(jsonb_build_object('name', model))
      from (
        select distinct model from public.products
        where status = 'active'
          and model is not null and trim(model) <> ''
          and public.text_matches_query(model, p_query)
        order by model limit p_limit
      ) m
    ), '[]'::jsonb)
  );
$$;

grant execute on function public.global_search(text, integer)
  to anon, authenticated, service_role;

-- Trigram indexes for faster fuzzy lookups
create index if not exists brands_name_trgm_idx
  on public.brands using gin (public.normalize_text(name) extensions.gin_trgm_ops);

create index if not exists products_model_trgm_idx
  on public.products using gin (public.normalize_text(coalesce(model, '')) extensions.gin_trgm_ops)
  where model is not null and trim(model) <> '';

alter function public.text_matches_query(text, text) set search_path = '';
alter function public.product_matches_word(uuid, text) set search_path = '';
alter function public.product_matches_query(uuid, text) set search_path = '';
