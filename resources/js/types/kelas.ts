export interface SchoolClass {
  id: string | number;
  name: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ClassesPaginated {
  data: SchoolClass[];
  links: PaginationLink[];
  from: number;
  to: number;
  total: number;
}
