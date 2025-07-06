export interface LogSessionForm {
  date: string;
  time: string;
  hours: number;
  role: string;
  cause: string;
  customCause: string;
  organisation: string;
  description: string;
  photo: File | null;
}