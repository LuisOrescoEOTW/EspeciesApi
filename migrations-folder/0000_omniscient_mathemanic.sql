CREATE TABLE `especies` (
	`sp_id` integer PRIMARY KEY NOT NULL,
	`reino` text,
	`phydiv` text,
	`clase` text,
	`orden` text,
	`familia` text,
	`nombre_cientifico` text,
	`origen` text,
	`imagen` text,
	`reportes` integer DEFAULT 0
);
