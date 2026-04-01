export interface Student {
  student_id: number;
  student_name: string;
  course: string;
  year_level: number;
  email: string;
}

export interface Library {
  library_id: number;
  library_name: string;
  location: string;
}

export interface Admin {
  admin_id: number;
  admin_name: string;
  username: string;
  password?: string;
}

export interface QRCode {
  qr_id: number;
  qr_value: string;
  generated_date: string;
  status: string;
  admin_id: number;
}

export interface Attendance {
  attendance_id: number;
  attendance_date: string;
  time_in: string;
  time_out: string | null;
  student_id: number;
  qr_id: number;
  library_id: number;
}
