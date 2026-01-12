import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import api, { authApi } from "../../api";
import useAuthStore, { Status } from "../../store/authStore";
import {
  adminCategoriesQuery,
  adminCategoryQuery,
  adminProductQuery,
  adminProductsQuery,
  adminTypeQuery,
  adminTypesQuery,
  adminUserQuery,
  adminUsersQuery,
  allReviewsQuery,
  categoryTypeQuery,
  oneProductQuery,
  preorderProductInfiniteQuery,
  productInfiniteQuery,
  productQuery,
  productReviewsQuery,
  queryClient,
} from "../../api/query";

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
export const homeLoader = async () => {
  await queryClient.ensureQueryData(productQuery("?limit=8"));
  return null;
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

export const newPasswordLoader = async () => {
  const authStore = useAuthStore.getState();

  if (authStore.status !== Status.reset) {
    return redirect("/reset");
  }

  return null;
};

export const productInfiniteLoader = async () => {
  await queryClient.ensureQueryData(categoryTypeQuery());
  await queryClient.prefetchInfiniteQuery(productInfiniteQuery());
  return null;
};

export const preorderProductInfiniteLoader = async () => {
  await queryClient.ensureQueryData(categoryTypeQuery());
  await queryClient.prefetchInfiniteQuery(preorderProductInfiniteQuery());
  return null;
};

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.productId) {
    throw new Error("No Product ID provided");
  }
  await queryClient.ensureQueryData(productQuery("?limit=4"));
  await queryClient.ensureQueryData(oneProductQuery(Number(params.productId)));
  await queryClient.ensureQueryData(
    productReviewsQuery(Number(params.productId))
  );
  return { productId: params.productId };
};

export const verifyLoader = async () => {
  const authStore = useAuthStore.getState();

  if (authStore.status !== Status.verify) {
    return redirect("/reset");
  }

  return null;
};

export const adminReviewsLoader = async () => {
  await queryClient.ensureQueryData(allReviewsQuery());
  return null;
};

export const adminCategoryListLoader = async () => {
  await queryClient.ensureQueryData(adminCategoriesQuery());
  return null;
};

export const adminCategoryDetailLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  if (!params.categoryId) throw new Error("Category ID missing");

  await queryClient.ensureQueryData(
    adminCategoryQuery(Number(params.categoryId))
  );

  return { categoryId: params.categoryId };
};

export const adminTypeListLoader = async () => {
  await queryClient.ensureQueryData(adminTypesQuery());
  return null;
};

export const adminTypeDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.typeId) throw new Error("Type ID missing");

  await queryClient.ensureQueryData(adminTypeQuery(Number(params.typeId)));

  return { typeId: params.typeId };
};

export const adminProductListLoader = async () => {
  await queryClient.ensureQueryData(adminProductsQuery());
  return null;
};

export const adminProductDetailLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  if (!params.productId) throw new Error("Product ID missing");

  await queryClient.ensureQueryData(
    adminProductQuery(Number(params.productId))
  );
  await queryClient.ensureQueryData(adminCategoriesQuery());
  await queryClient.ensureQueryData(adminTypesQuery());

  return { productId: params.productId };
};

export const adminProductCreateLoader = async () => {
  await queryClient.ensureQueryData(adminCategoriesQuery());
  await queryClient.ensureQueryData(adminTypesQuery());
  return null;
};

export const adminUserListLoader = async () => {
  await queryClient.ensureQueryData(adminUsersQuery());
  return null;
};

export const adminUserDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData(adminUserQuery(Number(params.userId)));
  return null;
};

export const adminOrderDetailLoader = async ({ params }: { params: any }) => {
  try {
    const response = await api.get(`/admins/orders/${params.orderId}`);
    return response.data;
  } catch (error) {
    throw new Response("Failed to load order details", { status: 404 });
  }
};

export const profileOrderDetailLoader = async ({ params }: { params: any }) => {
  try {
    const response = await api.get(`/users/profile/orders/${params.orderId}`);
    return { order: response.data.order };
    throw new Response("Failed to load order details", { status: 404 });
  } catch (error) {
    throw new Response("Failed to load order details", { status: 404 });
  }
};
