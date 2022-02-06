CREATE TABLE `invoices` (
  `id` int(10) UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `status` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bill_amount` int(11) DEFAULT NULL,
  `paid` int(11) DEFAULT NULL,
  `due_at` timestamp NULL DEFAULT NULL,
  `invoice_template_id` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `invoice_templates` (
  `id` int(10) UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `status` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

CREATE TABLE `invoice_metas` (
  `id` int(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `meta_key` text NOT NULL,
  `meta_value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `invoice_template_metas` (
  `id` int(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  `invoice_template_id` int(11) NOT NULL,
  `meta_key` text NOT NULL,
  `meta_value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
