import Cookies from "js-cookie";

export function getAccessToken() {
  const access = Cookies.get("access");
  console.log("Token before removal:", access);
  return access || undefined;
}
export function getRefreshToken() {
  const refresh = Cookies.get("refresh");
  if (!refresh) throw new Error("No refresh token found");
  return refresh;
}

export const removeAccessToken = () => {
  Cookies.remove("access");
  Cookies.remove("refresh");
};