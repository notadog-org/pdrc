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

export interface Change {
  id: string;
  deleted: boolean;
  error?: string;
  doc: Doc;
}
export class Doc {
  _id?: string;
  _rev?: string;
  type?: string;
  _deleted?: boolean;

  constructor({ _id, _rev, type, _deleted }: any) {
    this._id = _id;
    this._rev = _rev;
    this.type = type;
    this._deleted = _deleted;
  }
}

export class Order extends Doc {
  title: string;

  constructor(data: any) {
    super(data);

    const { title } = data;
    this.title = title ?? 'Empty title';
  }
}
