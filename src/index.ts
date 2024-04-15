import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { count, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { especies } from "./db/schema";
import { readFile } from "fs/promises";

// setup DB
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "migrations-folder" });
db.select({ count: count() })
  .from(especies)
  .then((result) => {
    console.log(result);
    if (result?.[0]?.count === 0) {
      readFile("src/db/tdf-especies-simplificado.json").then((data) => {
        const especiesData = JSON.parse(data.toString());
        db.insert(especies).values(especiesData).execute();
      });
      console.log("Data inserted");
    }
  });

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/especies", async (c) => {
  const result = await db.select().from(especies).execute();
  return c.json(result);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
