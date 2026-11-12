-- OPTIONAL. Clearly fictional SAMPLE listings so a brand-new board does not look empty.
-- They are never ranked, carry no price, no clicks and no outbound link, and the UI labels them "Sample".
-- They disappear from the page automatically once 5 real paid listings exist (see SAMPLE_THRESHOLD in lib/db.ts).
-- Delete them any time:  delete from public.listings where is_demo;
insert into public.listings (slug, url, host, title, tagline, category, is_demo, total_cents) values
 ('sample-acme-agents',  'https://acme.example',    'acme.example',    'Acme Agents',        'Example: autonomous AI agents for small teams',        'ai-agents',        true, 0),
 ('sample-globex-forms', 'https://globex.example',  'globex.example',  'Globex Forms',       'Example: one-question forms that convert',             'saas-web-apps',    true, 0),
 ('sample-initech-vps',  'https://initech.example', 'initech.example', 'Initech Cloud VPS',  'Example: developer VPS with simple pricing',           'developer-tools',  true, 0),
 ('sample-umbrella-seo', 'https://umbrella.example','umbrella.example','Umbrella Analytics', 'Example: revenue-aware web analytics',                'marketing-seo',    true, 0),
 ('sample-hooli-studio', 'https://hooli.example',   'hooli.example',   'Hooli Studio',       'Example: a design and development studio for startups','agencies-services',true, 0)
on conflict (slug) do nothing;
