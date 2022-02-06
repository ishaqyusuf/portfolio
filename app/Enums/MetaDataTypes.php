<?php

namespace App\Enums;


use BenSampo\Enum\Enum;


class MetaDataTypes extends Enum
{
    const STATUS = "default_status";
    const STATUS_LIST = "status_list";
    const LOCATIONS = "locations";
    const TRACKING_NOTES = "track_notes";
    const PARCEL_STATUS = "parcel_status";
    const SHIPMENT_STATUS = "shipment_status";
    const INVOICE_STATUS = "invoice_status";
    const COURIERS = "couriers";
    const TRACKING_STATUS = "tracking_status";
    const TRACKING_NOTE = "tracking_note";
    const TRACKING_LOCATION = "tracking_location";
    const UNIT_SYSTEM = "unit_system";
    const DEFAULT_INVOICE = "default_invoice";
    const DEFAULT_ADDRESS = "default_address";

    const PARCEL_CLIENT_DATA = "parcel_client_data";
    const PARCEL_SENDER_DATA = "parcel_sender_data";
    const PARCEL_DATA = "parcel_data";
}
