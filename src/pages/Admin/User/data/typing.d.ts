declare namespace UserFeature {
  type UserListItem = {
    id?: number;
    name?: string;
    email?: string;
    verification_status?: string;
    roles?: array;
    permissions?: array;
  };

  type UserList = {
    current_page?: number;
    total?: number;
    data?: UserListItem[];
  };
}
