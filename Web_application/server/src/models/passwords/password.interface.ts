export interface PasswordData {
    token: string;
    role: string;
  }
  
  export interface PasswordRO {
    loginInfo: PasswordData;
  }