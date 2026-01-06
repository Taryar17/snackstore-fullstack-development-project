import { redirect } from "react-router-dom";
import { authApi } from "../../api";
import useAuthStore, { Status } from "../../store/authStore";

export const loginLoader = async () => {
  try {
    const response = await authApi.get("auth-check");
    if (response.status !== 200) {
      return null;
    }
    return redirect("/");
  } catch (error) {
    console.log("loginLoader error: ", error);
  }
};

export const confirmLoader = async () => {
  const authStore = useAuthStore.getState();

  if (authStore.status !== Status.confirm) {
    return redirect("/register");
  }

  return null;
};

export const otpLoader = async () => {
  const authStore = useAuthStore.getState();
  if (authStore.status !== "otp") {
    return redirect("/register");
  }
};
