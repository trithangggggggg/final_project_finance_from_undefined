
// user 
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: boolean |string | null;
  status: boolean | null;
}


//regitstter
export interface AuthState {
  user: any;
  loading: boolean;
  successMessage: string;
  errorMessage: string 
}


// admin manager user 
export interface UserManagerState {
  users: User[];
  totalPages: number;
  loading: boolean;
  error: string | null;
}



export interface ITransaction {
  id: number;
  createdDate: string;
  total: number;
  description: string;
  categoryId: number;
  monthlycategoryId: number;
}

export interface IMonthlyCategory {
  id: number;
  month: string;
  totalBudget: number;
  categories?: { id: number; categoryId: number; budget: number }[];
  userId:number
}

export interface FinanceState {
  monthlycategories: IMonthlyCategory[];
  transactions: ITransaction[];
  selectedMonth: string;
  currentMonthData: IMonthlyCategory | null;
  remaining: number;
  warningMessage: string;
  loading: boolean;
  error: string | null;
  flag: boolean;
}


export interface Category {
  id: number;
  name: string;
  image: string; 
  status: boolean | null;
}

export interface CategoryState {
  categories: Category[];
  totalPages: number;
  loading: boolean;
  error: string | null;
}



