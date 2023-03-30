export interface IGoogleLoginBody {
  code: string;
  redirectUri: string;
}

export interface IGoogleLoginLinkQuery {
  state: string;
  redirectUri: string;
}

export interface ICreateUserBody {
  name: string;
  email: string;
  password: string;
  gpa: number;
  school: string;
  major: string;
  avatar: string;
  linkedln_link: string;
  phone: string;
  role: number;
  cv: string;
}
