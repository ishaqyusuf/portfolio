<?php

/**
 * Created by PhpStorm.
 * User: ABOO SOFIYYAT
 * Date: 3/9/2019
 * Time: 6:45 PM
 */

namespace App\Enums;

use BenSampo\Enum\Enum;

class Shortee extends Enum
{
    const CompanyAddress = "company_address";
    const DefaultShippingAddress = "default_shipping_address";


    const ParcelData = "parcel_data";
    const InvoiceConfig = "invoice_config";
    const ParcelTracking = "parcel_tracking";
    const LabelConfig = "label_config";

    // const GeoData = self::Base . '' . self::Route;
}
