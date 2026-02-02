export const authUrls = {
  login: "/auth/login",
  verifyOtp: "/auth/verify-otp",
  getUser: "/user/me",
  refreshToken: "/auth/refresh",
  validateUser: "/assets/permissions",
  onboardUser: "/user/onboard",
  forgotpassword: "/auth/forgot-password",
  forgotpasswordReset: "/auth/forgot-password-reset",
  signedUrl: "/signed-url/?key=",
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
  upsertProduct: "/product/modify"
};
