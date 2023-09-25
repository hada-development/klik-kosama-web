export interface AttendanceTableRow {
  id: number;
  date: string;
  type: string;
  in_time: string;
  out_time: string;
  created_at: string;
  in_file_id: number;
  shift_data: ShiftData;
  updated_at: string;
  hr_shift_id: number;
  in_distance: number;
  in_location: LocationData;
  office_data: OfficeData;
  out_file_id: number;
  hr_office_id: number;
  late_minutes: number;
  out_distance: number;
  out_location: LocationData;
  early_minutes: number;
  employee_data: EmployeeData;
  work_duration: number;
  hr_employee_id: number;
}

export interface ShiftData {
  start_time: string;
  end_time: string;
  // Add other properties related to shift data
}

export interface LocationData {
  latitude: number;
  longitude: number;
  // Add other properties related to location data
}

export interface OfficeData {
  // Define the properties of the office data here
  // For example, office_id, office_name, etc.
}

export interface EmployeeData {
  name: string;
  nip: string;
  position: string;
  // Add other properties related to employee data
}
