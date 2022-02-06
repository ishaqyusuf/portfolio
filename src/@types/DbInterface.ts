export interface IParcel {
  id?;
  track_code?;
  user_id?;
  scanned_by?;
  department_id?;
  from_address_id?;
  to_address_id?;
  sender_id?;
  receiver_id?;
  status?;
  progress_status?;
  courier?;
  type?;
  storage_id?;
  shipment_id?;
  group_id?;
  scan_location_id?;
  weight?;
  weight_unit?;
  length?;
  width?;
  height?;
  dimension_unit?;
  created_at?;
  archived_at?;
  description?;
  quantity?;
  invoice_id?;
}
export interface ITransformedParcel extends IParcel {}

export interface IFormMeta {
  data?;
  hidden?;
  readonly?;
}
