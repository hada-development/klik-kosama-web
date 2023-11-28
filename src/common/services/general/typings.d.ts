declare namespace Auth {
  type CurrentUser = {
    id?: integer;
    name?: string;
    email?: string;
    roles?: string[];
    email?: string;
    profile_photo?: {
      id?: integer;
      address?: string;
    };
    permissions: any;
    stores?: array;
  };

  type LoginParams = {
    email?: string;
    password?: string;
    autoLogin?: boolean;
  };

  type LoginResult = {
    status?: string;
    name?: string;
    token?: string;
    roles?: string[];
  };
}
