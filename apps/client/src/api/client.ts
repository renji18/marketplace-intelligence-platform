import type { UserInterface } from "@/interfaces/user.interface";
import axios, { AxiosError } from "axios";
import { authUrls } from "./urls";

const baseURL = import.meta.env.VITE_MIP_BASE_API_URL || "";

// the main client which has access to baseUrl, and the cookies stored in frontend
const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// This is the array, which includes frontend urls which should be accessed without token verification
const EXCLUDE_URL = [
  "/login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
  "/products",
  "/product/",
];

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (err1) => {
    // the frontend URL page which is calling any API
    const URL_PATH = window.location.pathname;

    // is this url in the exclude URL array?
    const isExclude = EXCLUDE_URL.some((path) => URL_PATH.startsWith(path));

    // first error check (normal error checks)
    if (err1 instanceof AxiosError) {
      const errorMessage1 = err1.response?.data["error"];

      // if the api error message is something which says "You are not logged in", then navigate to login page
      if (
        (errorMessage1 === "No token provided" ||
          errorMessage1 === "Invalid token" ||
          errorMessage1 === "Not logged in") &&
        !isExclude
      ) {
        window.location.replace("/login");
      }
      // if the user is logged in but the access token is expired, then try calling the refresh token api. Check if it is an excluded URL, if excluded, go to else block.
      else if (
        (errorMessage1 === "Access token expired" ||
          errorMessage1 === "jwt expired") &&
        !isExclude
      ) {
        try {
          const res = await apiClient.get(authUrls.refreshToken);

          // the refresh token api call is success then just navigate back to specific dashboard
          if (res.status === 200 && res.data?.user) {
            const user: UserInterface = res.data?.user;
            if (user.buyer?.id) window.location.replace("/buyer/dashboard");
            if (user.seller?.id) window.location.replace("/seller/dashboard");
            if (user.admin?.id) window.location.replace("/admin/dashboard");
            // if refresh token api fails show unexpected error
          } else {
            throw new Error("Unexpected error occurred");
          }
          // if unhandled api error occurs, then just navigate them back to the login page as they are not logged in properly.
        } catch (err2) {
          window.location.replace("/login");
          if (err2 instanceof AxiosError && !isExclude) {
            throw new Error(err2.response?.data["error"]);
          } else {
            throw new Error("Unexpected error occurred");
          }
        }
      }
      // else just show an unexpected error message
    } else {
      throw new Error("Unexpected error occurred");
    }
    return Promise.reject(err1);
  },
);

export default apiClient;
