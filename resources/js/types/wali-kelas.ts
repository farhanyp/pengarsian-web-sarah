import { SchoolClass, PaginationLink } from './kelas';
import { User } from './auth';

export interface ClassTeacher {
  id: number;
  class_id: number;
  teacher_id: string;
  academic_year: string;
  created_at: string;
  updated_at: string;
  class?: SchoolClass;
  teacher?: User;
}

export interface ClassTeachersPaginated {
  data: ClassTeacher[];
  links: PaginationLink[];
  from: number;
  to: number;
  total: number;
}
