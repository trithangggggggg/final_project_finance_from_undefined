
// user 
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: boolean | null;
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

