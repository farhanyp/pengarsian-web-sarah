export interface Student {
  id: string;
  nis: string;
  nisn?: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface GradeCategory {
  id: string;
  name: string;
  default_weight: number;
}

export interface Grade {
  id: string;
  student_id: string;
  subject_id: string;
  grade_category_id: string;
  title: string;
  score: number | null;
  semester: string;
  academic_year: string;
  student?: Student;
  subject?: Subject;
  category?: GradeCategory;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface GradesPaginated {
  data: Grade[];
  links: PaginationLink[];
  from: number;
  to: number;
  total: number;
}

export interface AcademicYearOption {
  id: string;
  name: string;
}
