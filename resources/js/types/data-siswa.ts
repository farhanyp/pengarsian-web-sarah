export interface StudentClass {
  id: string | number;
  name: string;
  pivot: {
    academic_year: string;
  };
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  classes?: StudentClass[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface StudentsPaginated {
  data: Student[];
  links: PaginationLink[];
  from: number;
  to: number;
  total: number;
}
