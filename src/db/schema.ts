import { relations } from "drizzle-orm";
import {
  text,
  integer,
  real,
  blob,
  sqliteTable,
} from "drizzle-orm/sqlite-core";

export const especies = sqliteTable("especies", {
  sp_id: integer("sp_id").primaryKey(),
  reino: text("reino").notNull(),
  phydiv: text("phydiv"),
  clase: text("clase"),
  orden: text("orden"),
  familia: text("familia"),
  nombre_cientifico: text("nombre_cientifico"),
  origen: text("origen"),
  imagen: text("imagen"),
});
export type Especie = typeof especies.$inferSelect;
export const especiesRelations = relations(especies, ({ many }) => ({
  reportes: many(reportes),
}));

export const reportes = sqliteTable("reportes", {
  id: integer("id").primaryKey(),
  sp_id: integer("sp_id"),
  latitud: real("latitud").notNull(),
  longitud: real("longitud").notNull(),
  fecha: text("fecha").notNull(),
  hora: text("hora").notNull(),
  descripcion: text("descripcion").notNull(),
  imagen: text("imagen"),
});
export type Reporte = typeof reportes.$inferSelect;

export const reportesRelations = relations(reportes, ({ one }) => ({
  author: one(especies, {
    fields: [reportes.sp_id],
    references: [especies.sp_id],
  }),
}));
