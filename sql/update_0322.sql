CREATE TABLE `crash_reports` (
  `id` int(10) UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `code` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

CREATE TABLE `crash_report_metas` (
  `id` int(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `crash_report_id` int(11) NOT NULL,
  `meta_key` text NOT NULL,
  `meta_value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `crash_reports` ADD `frequency` INT NOT NULL DEFAULT '0' AFTER `url`, ADD `status` TEXT NOT NULL DEFAULT 'open' AFTER `frequency`;
ALTER TABLE `parcels` ADD `scan_location_id` INT NULL AFTER `group_id`;
ALTER TABLE `address_books` ADD `type` TEXT NULL AFTER `email`;