export interface Subject {
  id: string | number;
  name: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface SubjectsPaginated {
  data: Subject[];
  links: PaginationLink[];
  from: number;
  to: number;
  total: number;
}
