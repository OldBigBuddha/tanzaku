// deno-kv/server.ts

import { Hono } from 'https://deno.land/x/hono/mod.ts';
import { cors } from 'https://deno.land/x/hono/middleware.ts';
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const app = new Hono();
app.use('/api/*', cors({
  origin: '*',
}))
const kv = await Deno.openKv();

app.get('/api/tanzaku', async (c) => {
  const entries = [];
  for await (const entry of kv.list({ prefix: "" })) {
    entries.push({ id: entry.key, ...entry.value });
  }
  return c.json(entries, 200);
});

app.post('/api/tanzaku', async (c) => {
  const body = await c.req.json();
  const id = crypto.randomUUID();
  await kv.set([id], body);
  return c.json({ id }, 201);
});

app.notFound((c) => c.text('Not Found', 404));

serve(app.fetch);

console.log("Deno KV Server running on http://localhost:8000");
