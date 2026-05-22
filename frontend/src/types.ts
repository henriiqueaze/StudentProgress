export type StudentStatus = "APPROVED" | "FAILED" | "RECOVERY";
export type AuthMode = "login" | "register";
export type TabKey =
  | "register"
  | "partial"
  | "search"
  | "analytics"
  | "students";

export type Student = {
  id?: number;
  name: string;
  birthDate: string | number;
  cpf?: string;
  email?: string;
  registration: string;
  course: string;
  classSchool: string;
  notes: number[];
};

export type StudentAverage = {
  studentName: string;
  notes: number[];
  average: number;
  status: StudentStatus;
};

export type PagedStudentsResponse = {
  _embedded?: {
    students?: Student[];
  };
  page?: {
    number?: number;
    totalPages?: number;
    totalElements?: number;
  };
};

export type ApiErrorBody = {
  message?: string;
  error?: string;
  status?: number | string;
};

export type AlertType = "success" | "error" | "info";

export type Alert = {
  type: AlertType;
  message: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  token: string;
  tokenType: string;
  user: AuthUser;
};

export type AuthForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type StudentForm = {
  id: string;
  name: string;
  birthDate: string;
  cpf: string;
  email: string;
  registration: string;
  course: string;
  classSchool: string;
  note1: string;
  note2: string;
  note3: string;
};
