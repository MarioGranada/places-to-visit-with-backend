// Schema + seed SQL, kept in JS so the Vercel function bundle always includes it
// (no runtime file reads). Both statements are idempotent.

// Idempotent schema + seed. Safe to run repeatedly.
export const migration = `
create schema if not exists places;

create table if not exists places.places (
  id        text primary key,
  title     text not null,
  image_src text not null,
  image_alt text not null,
  lat       double precision not null,
  lon       double precision not null,
  position  int not null
);

-- One shared "places I'd like to visit" list for the public demo.
create table if not exists places.user_places (
  place_id text primary key references places.places (id) on delete cascade,
  position int not null
);

-- Only the server (postgres role) talks to this schema; keep the Data API out.
alter table places.places enable row level security;
alter table places.user_places enable row level security;

insert into places.places (id, title, image_src, image_alt, lat, lon, position) values
  ('p1', 'Forest Waterfall', 'forest-waterfall.jpg', 'A tranquil forest with a cascading waterfall amidst greenery.', 44.5588, -80.344, 1),
  ('p2', 'Sahara Desert Dunes', 'desert-dunes.jpg', 'Golden dunes stretching to the horizon in the Sahara Desert.', 25.0, 0.0, 2),
  ('p3', 'Himalayan Peaks', 'majestic-mountains.jpg', 'The sun setting behind snow-capped peaks of majestic mountains.', 27.9881, 86.925, 3),
  ('p4', 'Caribbean Beach', 'caribbean-beach.jpg', 'Pristine white sand and turquoise waters of a Caribbean beach.', 18.2208, -66.5901, 4),
  ('p5', 'Ancient Grecian Ruins', 'ruins.jpg', 'Historic ruins standing tall against the backdrop of the Grecian sky.', 37.9715, 23.7257, 5),
  ('p6', 'Amazon Rainforest Canopy', 'rainforest.jpg', 'Lush canopy of a rainforest, teeming with life.', -3.4653, -62.2159, 6),
  ('p7', 'Northern Lights', 'northern-lights.jpg', 'Dazzling display of the Northern Lights in a starry sky.', 64.9631, -19.0208, 7),
  ('p8', 'Japanese Temple', 'japanese-temple.jpg', 'Ancient Japanese temple surrounded by autumn foliage.', 34.9949, 135.785, 8),
  ('p9', 'Great Barrier Reef', 'great-barrier-reef.jpg', 'Vibrant coral formations of the Great Barrier Reef underwater.', -18.2871, 147.6992, 9),
  ('p10', 'Parisian Streets', 'parisian-streets.jpg', 'Charming streets of Paris with historic buildings and cafes.', 48.8566, 2.3522, 10),
  ('p11', 'Grand Canyon', 'grand-canyon.jpg', 'Expansive view of the deep gorges and ridges of the Grand Canyon.', 36.1069, -112.1129, 11),
  ('p12', 'Venetian Canals', 'venetian-canals.jpg', 'Glistening waters of the Venetian canals as gondolas glide by at sunset.', 45.4408, 12.3155, 12),
  ('p13', 'Taj Mahal', 'taj-mahal.jpg', 'The iconic Taj Mahal reflecting in its surrounding waters during sunrise.', 27.1751, 78.0421, 13),
  ('p14', 'Kerala Backwaters', 'kerala-backwaters.jpg', 'Tranquil waters and lush greenery of the Kerala backwaters.', 9.4981, 76.3388, 14),
  ('p15', 'African Savanna', 'african-savanna.jpg', 'Wild animals roaming freely in the vast landscapes of the African savanna.', -2.153, 34.6857, 15),
  ('p16', 'Victoria Falls', 'victoria-falls.jpg', 'The powerful cascade of Victoria Falls, a natural wonder between Zambia and Zimbabwe.', -17.9243, 25.8572, 16),
  ('p17', 'Machu Picchu', 'machu-picchu.jpg', 'The historic Incan citadel of Machu Picchu illuminated by the morning sun.', -13.1631, -72.545, 17),
  ('p18', 'Amazon River', 'amazon-river.jpg', 'Navigating the waters of the Amazon River, surrounded by dense rainforest.', -3.4653, -58.38, 18)
on conflict (id) do nothing;
`;

// Empties the shared list; running \`migration\` afterwards keeps the catalogue.
export const reset = `
truncate places.user_places;
`;
