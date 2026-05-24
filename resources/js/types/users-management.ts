export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface UsersPaginated {
  data: UserData[];
  links: PaginationLink[];
  from: number;
  to: number;
  total: number;
}
