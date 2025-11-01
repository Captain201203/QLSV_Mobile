export interface Student {
  _id?: string;
  studentId: string;
  studentName: string;
  dateOfBirth: string; // ISO string từ backend
  phoneNumber: string;
  email: string;
  className: string;
}
