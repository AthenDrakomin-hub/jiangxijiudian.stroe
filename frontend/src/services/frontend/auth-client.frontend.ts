const authClient = {
  signIn: async (email: string, password: string) => ({ success: true, user: { id: '1', email } }),
  signOut: async () => {},
  signUp: async (email: string, password: string) => ({ success: true }),
  forgotPassword: async (email: string) => ({ success: true }),
  resetPassword: async (token: string, newPassword: string) => ({ success: true }),
  getSession: async () => ({ user: null }),
  getUser: async () => null
};

export default authClient;