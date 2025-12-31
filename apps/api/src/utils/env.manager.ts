export const envData = () => {
  const cookie_secret = process.env.COOKIE_SECRET!;
  const access_secret = process.env.JWT_ACCESS_SECRET!;
  const refresh_secret = process.env.JWT_REFRESH_SECRET!;
  const access_expiry = process.env
    .JWT_ACCESS_EXPIRY! as import('ms').StringValue;
  const refresh_expiry = process.env
    .JWT_REFRESH_EXPIRY! as import('ms').StringValue;
  const access_cookie = process.env.JWT_ACCESS_COOKIE!;
  const refresh_cookie = process.env.JWT_REFRESH_COOKIE!;

  return {
    cookie_secret,
    access_secret,
    refresh_secret,
    access_expiry,
    refresh_expiry,
    access_cookie,
    refresh_cookie,
  };
};
