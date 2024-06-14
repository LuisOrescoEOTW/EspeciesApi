CREATE TABLE `especies` (
	`sp_id` integer PRIMARY KEY NOT NULL,
	`reino` text NOT NULL,
	`phydiv` text,
	`clase` text,
	`orden` text,
	`familia` text,
	`nombre_cientifico` text,
	`origen` text,
	`imagen` text
);
--> statement-breakpoint
CREATE TABLE `reportes` (
	`id` integer PRIMARY KEY NOT NULL,
	`sp_id` integer,
	`latitud` real NOT NULL,
	`longitud` real NOT NULL,
	`fecha` text NOT NULL,
	`hora` text NOT NULL,
	`descripcion` text NOT NULL,
	`imagen` text
);
