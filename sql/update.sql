ALTER TABLE `shipments` ADD `slug` TEXT NULL AFTER `shipment_id`;
ALTER TABLE `shipment_routes` ADD `slug` TEXT NULL AFTER `title`;
ALTER TABLE `shipment_routes` CHANGE `div_id` `department_id` INT(11) NULL DEFAULT NULL;


-- // updated
ALTER TABLE `shipments` ADD `automatic` BOOLEAN NULL AFTER `tags`;
ALTER TABLE `shipments` ADD `track_code` TEXT NULL AFTER `title`, ADD `prefix` TEXT NULL AFTER `track_code`;
ALTER TABLE `shipments` CHANGE `status` `status` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;
ALTER TABLE `shipments` CHANGE `shipment_id` `shipment_id` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;
ALTER TABLE `parcels` ADD `type` TEXT NULL AFTER `courier`;
ALTER TABLE `shipments` CHANGE `tags` `active_until` TIMESTAMP(1) NULL DEFAULT NULL;
ALTER TABLE `shipments` ADD `active` BOOLEAN NULL AFTER `active_until`;
ALTER TABLE `shipments` ADD `start_date` TIMESTAMP NULL AFTER `automatic`, ADD `end_date` TIMESTAMP NULL AFTER `start_date`;

--//
