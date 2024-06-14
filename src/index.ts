import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { count, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./db/schema";
import { readFile } from "fs/promises";

// setup DB
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema: { ...schema } });

migrate(db, { migrationsFolder: "migrations-folder" });
db.select({ count: count() })
  .from(schema.especies)
  .then((result) => {
    console.log(result);
    if (result?.[0]?.count === 0) {
      readFile("src/db/tdf-especies-simplificado.json").then((data) => {
        const especiesData = JSON.parse(data.toString());
        db.insert(schema.especies).values(especiesData).execute();
      });
      console.log("Data inserted");
    }
  });

const app = new Hono();
app.use("*", cors({ origin: "*" }));
app.notFound((c) => c.json({ message: "Not found" }, { status: 404 }));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/especies", async (c) => {
  const result = await db.query.especies.findMany();
  return c.json(result);
});

app.get("/especies/:id", async (c) => {
  const result = await db.query.especies.findFirst({
    where: sql`sp_id = ${c.req.param("id")}`,
    with: { reportes: true },
  });
  const especie = result ?? null;
  return c.json(especie);
});

app.post("/especies/:id/reportar", async (c) => {
  const sp_id = c.req.param("id");
  const formData = await c.req.formData();
  const reporteData = {
    sp_id: sp_id,
    latitud: formData.get("latitud"),
    longitud: formData.get("longitud"),
    fecha: formData.get("fecha"),
    hora: formData.get("hora"),
    descripcion: formData.get("descripcion"),
    imagen: formData.get("imagen") ?? null,
  };

  await db.insert(schema.reportes).values(reporteData).execute();
  const result = await db.query.especies.findFirst({
    where: sql`sp_id = ${sp_id}`,
    with: { reportes: true },
  });
  const especie = result ?? null;
  return c.json(especie);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
