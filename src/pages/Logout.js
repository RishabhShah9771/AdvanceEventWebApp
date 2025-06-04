import { redirect } from "react-router-dom";

export function actionLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  return redirect("/");
}
