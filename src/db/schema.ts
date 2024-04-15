import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const especies = sqliteTable("especies", {
  sp_id: integer("sp_id").primaryKey(),
  reino: text("reino"),
  phydiv: text("phydiv"),
  clase: text("clase"),
  orden: text("orden"),
  familia: text("familia"),
  nombre_cientifico: text("nombre_cientifico"),
  origen: text("origen"),
  imagen: text("imagen"),
  likes: integer("likes").default(0),
});

export type Especie = typeof especies.$inferSelect;
