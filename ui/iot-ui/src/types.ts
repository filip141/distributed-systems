export interface Measurement {
  id: number
  group_id?: string
  device_id: string
  sensor: string
  value: number
  unit?: string
  ts_ms: number
  seq?: number
  topic: string
}