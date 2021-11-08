export interface Doc {
  _id?: string;
  _rev?: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserRegisterRequest {
  username: string;
  password: string;
}

export interface UserResponse {
  token: string;
  userCtx: {
    name: string;
  };
}

export interface Order extends Doc {
  title: string;
}
