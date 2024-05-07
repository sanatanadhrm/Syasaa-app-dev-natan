type PaginatedResponse<T> = {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    links: any[];
  };
};

// Menyediakan nilai default untuk setiap properti
type DefaultPaginatedResponse<T> = Partial<PaginatedResponse<T>>;

// Contoh penggunaan
export const defaultResponse: DefaultPaginatedResponse<any> = {
  data: [],
  links: {
    first: "",
    last: "",
    prev: null,
    next: null,
  },
  meta: {
    current_page: 1,
    from: 0,
    last_page: 0,
    path: "",
    per_page: 0,
    to: 0,
    total: 0,
    links: [],
  },
};
