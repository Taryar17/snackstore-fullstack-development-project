// import { authApi } from "../../api";
import api, { authApi } from "../../api";
import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router-dom";
import useAuthStore, { Status } from "../../store/authStore";
import { queryClient } from "../../api/query";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);
  try {
    await fetch(import.meta.env.VITE_API_URL + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    const redirectTo = new URL(request.url).searchParams.get("redirect") || "/";
    return redirect(redirectTo);
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Login Failed!" };
    } else throw error;
  }
};
export const registerAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    const response = await authApi.post("register", credentials);
    authStore.setAuth(response.data.phone, response.data.token, Status.otp);

    return redirect("/register/otp");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response.data.message };
      }
    }
  }
};

export const otpAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();

  const credentials = {
    phone: authStore.phone,
    otp: formData.get("otp"),
    token: authStore.token,
  };

  try {
    const response = await authApi.post("verify-otp", credentials);
    authStore.setAuth(response.data.phone, response.data.token, Status.confirm);

    return redirect("/register/confirm-password");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response.data.message };
      }
    }
  }
};

export const confirmAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Check if passwords match
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const credentials = {
    phone: authStore.phone,
    password: password,
    token: authStore.token,
    firstName: formData.get("firstName") || "",
    lastName: formData.get("lastName") || "",
    email: formData.get("email") || "",
    address: formData.get("address") || "",
    city: formData.get("city") || "",
    region: formData.get("region") || "",
  };

  try {
    await authApi.post("confirm-password", credentials);
    authStore.clearAuth();

    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response.data.message };
      }
    }
    return { error: "Registration failed. Please try again." };
  }
};

export const logoutAction = async () => {
  try {
    await api.post("logout");
    return redirect("/login");
  } catch (error) {
    console.error("logout failed!", error);
  }
};

export const favouriteAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (!params.productId) {
    throw new Error("No Product ID provided");
  }

  const data = {
    productId: Number(params.productId),
    favourite: formData.get("favourite") === "true", // true
  };

  try {
    await api.patch("users/products/toggle-favourite", data);

    await queryClient.invalidateQueries({
      queryKey: ["products", "detail", params.productId],
    });

    return null;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response.data.message };
      }
    }
  }
};
export const resetAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();

  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    const response = await authApi.post("forget-password", credentials);

    authStore.setAuth(response.data.phone, response.data.token, Status.verify);

    return redirect("/reset/verify");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response.data.message };
      }
    }
  }
};
export const verifyAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();

  const credentials = {
    phone: authStore.phone,
    otp: formData.get("otp"),
    token: authStore.token,
  };

  try {
    const response = await authApi.post("verify", credentials);
    authStore.setAuth(response.data.phone, response.data.token, Status.reset);

    return redirect("/reset/new-password");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response.data.message };
      }
    }
  }
};

export const newPasswordAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();

  const credentials = {
    phone: authStore.phone,
    password: formData.get("password"),
    token: authStore.token,
  };

  try {
    await authApi.post("reset-password", credentials);

    authStore.clearAuth();

    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response.data.message };
      }
    }
  }
};

export const createReviewAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const payload = {
    productId: Number(formData.get("productId")),
    rating: Number(formData.get("rating")),
    comment: formData.get("comment"),
  };

  try {
    await api.post("reviews", payload);

    await queryClient.invalidateQueries({
      queryKey: ["reviews", payload.productId],
    });

    return null;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return { error: error.response.data.message };
    }
    throw error;
  }
};

export const deleteReviewAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const payload = {
    reviewId: Number(formData.get("reviewId")),
  };

  try {
    await api.delete("admins/reviews", { data: payload });

    await queryClient.invalidateQueries({
      queryKey: ["reviews", "admin"],
    });

    return null;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return { error: error.response.data.message };
    }
    throw error;
  }
};

export const productDetailAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "createReview") {
    const payload = {
      productId: Number(formData.get("productId")),
      rating: Number(formData.get("rating")),
      comment: formData.get("comment"),
    };

    try {
      await api.post("users/reviews", payload);

      await queryClient.invalidateQueries({
        queryKey: ["reviews", "product", payload.productId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["products", "detail", params.productId],
      });

      return null;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return { error: error.response.data.message };
      }
      throw error;
    }
  }

  if (actionType === "toggleFavorite") {
    if (!params.productId) {
      throw new Error("No Product ID provided");
    }

    const data = {
      productId: Number(params.productId),
      favourite: formData.get("favourite") === "true",
    };

    try {
      await api.patch("users/products/toggle-favourite", data);

      await queryClient.invalidateQueries({
        queryKey: ["products", "detail", params.productId],
      });

      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          return { error: error.response.data.message };
        }
      }
      throw error;
    }
  }

  if (formData.has("favourite")) {
    const productId = formData.get("productId") || params.productId;
    if (!productId) {
      throw new Error("No Product ID provided");
    }

    const data = {
      productId: Number(productId),
      favourite: formData.get("favourite") === "true",
    };

    try {
      await api.patch("users/products/toggle-favourite", data);

      await queryClient.invalidateQueries({
        queryKey: ["products", "detail", params.productId || data.productId],
      });

      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          return { error: error.response.data.message };
        }
      }
      throw error;
    }
  }

  const hasRating = formData.has("rating");
  if (hasRating) {
    const payload = {
      productId: Number(formData.get("productId")),
      rating: Number(formData.get("rating")),
      comment: formData.get("comment"),
    };

    try {
      await api.post("reviews", payload);

      await queryClient.invalidateQueries({
        queryKey: ["reviews", "product", payload.productId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["products", "detail", params.productId],
      });

      return null;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return { error: error.response.data.message };
      }
      throw error;
    }
  }

  return null;
};

export const changeReviewStatusAction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();

  const payload = {
    reviewId: Number(formData.get("reviewId")),
    status: formData.get("status"),
  };

  try {
    await api.patch("admins/reviews/status", payload);

    await queryClient.invalidateQueries({
      queryKey: ["reviews", "admin"],
    });

    return null;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return { error: error.response.data.message };
    }
    throw error;
  }
};

export const createCategoryAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  try {
    await api.post("admins/categories", {
      name: formData.get("name"),
    });

    await queryClient.invalidateQueries({
      queryKey: ["admin", "categories"],
    });

    return redirect("/admins/categories");
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
  }
};

export const updateCategoryAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "cancel") {
    return redirect("/admins/categories");
  }

  if (!params.categoryId) {
    return { error: "Category ID is required" };
  }

  const name = formData.get("name");

  try {
    await api.patch(`admins/categories/${params.categoryId}`, { name });

    await queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    await queryClient.invalidateQueries({
      queryKey: ["admin", "category", params.categoryId],
    });

    return redirect("/admins/categories");
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update category",
    };
  }
};

export const createTypeAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  try {
    await api.post("admins/types", {
      name: formData.get("name"),
    });

    await queryClient.invalidateQueries({
      queryKey: ["admin", "types"],
    });

    return redirect("/admins/types");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create type",
    };
  }
};

export const updateTypeAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "cancel") {
    return redirect("/admins/types");
  }

  if (!params.typeId) {
    return { error: "Type ID is required" };
  }

  const name = formData.get("name");

  try {
    await api.patch(`admins/types/${params.typeId}`, { name });

    await queryClient.invalidateQueries({ queryKey: ["admin", "types"] });
    await queryClient.invalidateQueries({
      queryKey: ["admin", "type", params.typeId],
    });

    return redirect("/admins/types");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update type",
    };
  }
};

export const deleteCategoryAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const categoryId = formData.get("categoryId");

  if (action !== "delete" || !categoryId) {
    return null;
  }

  try {
    await api.delete(`admins/categories/${categoryId}`);

    await queryClient.invalidateQueries({
      queryKey: ["admin", "categories"],
    });

    return null;
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }
};

export const deleteTypeAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const typeId = formData.get("typeId");

  if (action !== "delete" || !typeId) {
    return null;
  }

  try {
    await api.delete(`admins/types/${typeId}`);

    await queryClient.invalidateQueries({
      queryKey: ["admin", "types"],
    });

    return null;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete type",
    };
  }
};

export const createProductAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  try {
    const imageFiles = formData.getAll("images") as File[];

    const uploadData = new FormData();
    uploadData.append("name", formData.get("name") as string);
    uploadData.append("description", formData.get("description") as string);
    uploadData.append("price", formData.get("price") as string);
    uploadData.append("discount", formData.get("discount") as string);
    uploadData.append("inventory", formData.get("inventory") as string);
    uploadData.append("category", formData.get("category") as string);
    uploadData.append("type", formData.get("type") as string);
    uploadData.append("status", (formData.get("status") as string) || "ACTIVE");
    uploadData.append(
      "pstatus",
      (formData.get("pstatus") as string) || "ORDER"
    );

    const tags = formData.get("tags") as string;
    if (tags) {
      uploadData.append("tags", tags);
    }

    imageFiles.forEach((file) => {
      if (file.size > 0) {
        uploadData.append("images", file);
      }
    });

    await api.post("admins/products", uploadData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await queryClient.invalidateQueries({
      queryKey: ["admin", "products"],
    });

    return redirect("/admins/products");
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
};

export const updateProductAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "cancel") {
    return redirect("/admins/products");
  }

  if (!params.productId) {
    return { error: "Product ID is required" };
  }

  try {
    const imageFiles = formData.getAll("images") as File[];

    const uploadData = new FormData();
    uploadData.append("productId", params.productId);
    uploadData.append("name", formData.get("name") as string);
    uploadData.append("description", formData.get("description") as string);
    uploadData.append("price", formData.get("price") as string);
    uploadData.append("discount", formData.get("discount") as string);
    uploadData.append("inventory", formData.get("inventory") as string);
    uploadData.append("category", formData.get("category") as string);
    uploadData.append("type", formData.get("type") as string);
    uploadData.append("status", (formData.get("status") as string) || "ACTIVE");
    uploadData.append(
      "pstatus",
      (formData.get("pstatus") as string) || "ORDER"
    );

    const tags = formData.get("tags") as string;
    if (tags) {
      uploadData.append("tags", tags);
    }

    imageFiles.forEach((file) => {
      if (file.size > 0) {
        uploadData.append("images", file);
      }
    });

    await api.patch("admins/products", uploadData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await queryClient.invalidateQueries({
      queryKey: ["admin", "products"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["admin", "products", params.productId],
    });

    return redirect("/admins/products");
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
};

export const deleteProductAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const productId = formData.get("productId");

  if (action !== "delete" || !productId) {
    return null;
  }

  try {
    await api.delete("admins/products", {
      data: { productId: Number(productId) },
    });

    await queryClient.invalidateQueries({
      queryKey: ["admin", "products"],
    });

    return null;
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
};

export const updateAdminUserAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();

  const payload = {
    id: Number(params.userId),
    role: formData.get("role"),
    status: formData.get("status"),
  };

  await api.patch("admins/users", payload);

  await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  await queryClient.invalidateQueries({
    queryKey: ["admin", "users", payload.id],
  });

  return redirect("/admins/users");
};
