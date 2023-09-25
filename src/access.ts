/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: Auth.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    ...currentUser?.permissions,
  };
}
