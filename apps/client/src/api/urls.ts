export const authUrls = {
  register: "/auth/register",
  login: "/auth/login",
  verifyOtp: "/auth/verify-otp",
  getUser: "/user/me",
  refreshToken: "/auth/refresh",
  forgotpassword: "/auth/forgot-password",
  verifyAndReset: "/auth/verify-and-reset",
  updateUser: "/user/edit",
  resetPassword: "/auth/reset-password",
  logout: "/auth/logout",
};

export const companyUrls = {
  createCompany: "/company/create",
  getSellerCompany: "/company/my",
  getAllCompanies: "/company/all",
  toggleCompanyStatus: "/company/toggle/",
};

export const productUrls = {
  getSellerProducts: "/product/my",
  getAllProducts: "/product/all",
  getSingleProduct: "/product/",
  upsertProduct: "/product/modify",
};

export const cartUrls = {
  addToCart: "/cart/add/",
  removeFromCart: "/cart/remove/",
  getMyCart: "/cart/get",
};
