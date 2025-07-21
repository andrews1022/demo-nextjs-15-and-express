// helper object to hold cookie options
export const cookieHelper = {
  alg: "HS256",
  duration: "1d",
  name: "jwt",
  options: {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
  },
};
