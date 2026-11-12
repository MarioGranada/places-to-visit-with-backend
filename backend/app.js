import express from 'express';

import cronRoutes from './routes/cron.js';
import { sql } from './db/index.js';

const app = express();
app.use(express.json({ limit: '50kb' }));

// Same JSON shape as the original file-based API.
const toPlace = (row) => ({
  id: row.id,
  title: row.title,
  image: { src: row.image_src, alt: row.image_alt },
  lat: row.lat,
  lon: row.lon,
});

// Everything lives under /api: on Vercel the SPA and the API share one origin,
// and in development Vite proxies /api to this server.
const api = express.Router();

api.get('/places', async (req, res) => {
  const rows = await sql`select * from places.places order by position`;
  res.status(200).json({ places: rows.map(toPlace) });
});

api.get('/user-places', async (req, res) => {
  const rows = await sql`
    select p.* from places.user_places u
    join places.places p on p.id = u.place_id
    order by u.position`;
  res.status(200).json({ places: rows.map(toPlace) });
});

// Replaces the whole list, like the original endpoint. Only ids of known
// places are stored; everything else about a place comes from the catalogue.
api.put('/user-places', async (req, res) => {
  const places = req.body?.places;
  if (!Array.isArray(places) || places.length > 100) {
    return res.status(400).json({ message: 'A list of places is required.' });
  }
  const ids = [...new Set(places.map((place) => place?.id).filter((id) => typeof id === 'string'))];

  await sql.begin(async (tx) => {
    await tx`delete from places.user_places`;
    if (ids.length > 0) {
      await tx`
        insert into places.user_places (place_id, position)
        select p.id, array_position(${ids}::text[], p.id)
        from places.places p
        where p.id = any(${ids}::text[])`;
    }
  });

  res.status(200).json({ message: 'User places updated!' });
});

api.use('/cron', cronRoutes);
api.use((req, res) => res.status(404).json({ message: '404 - Not Found' }));
app.use('/api', api);

// Express 5 forwards rejected promises from async handlers here.
// Never send database errors to the browser.
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong.' });
});

export default app;
