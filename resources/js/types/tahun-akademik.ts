export interface AcademicYear {
  id: string | number;
  year: string;
  is_active: boolean;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface AcademicYearsPaginated {
  data: AcademicYear[];
  links: PaginationLink[];
  from: number;
  to: number;
  total: number;
}
