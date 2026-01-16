import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import api from ".";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

const fetchProducts = (q?: string) =>
  api.get(`users/products${q ?? ""}`).then((res) => res.data);

export const productQuery = (q?: string) => ({
  queryKey: ["products", q],
  queryFn: () => fetchProducts(q),
});

const fetchPreorderProducts = (q?: string) =>
  api.get(`users/preorder-products${q ?? ""}`).then((res) => res.data);

export const preorderProductQuery = (q?: string) => ({
  queryKey: ["preorder-products", q],
  queryFn: () => fetchPreorderProducts(q),
});

const fetchCategoryType = async () =>
  api.get("users/filter-type").then((res) => res.data);

export const categoryTypeQuery = () => ({
  queryKey: ["category", "type"],
  queryFn: fetchCategoryType,
});

const fetchInfiniteProducts = async ({
  pageParam = null,
  categories = null,
  types = null,
  pstatus = "ORDER",
}: {
  pageParam?: number | null;
  categories?: string | null;
  types?: string | null;
  pstatus?: string | null;
}) => {
  let query = pageParam ? `?limit=9&cursor=${pageParam}` : "?limit=9";
  if (categories) query += `&category=${categories}`;
  if (types) query += `&type=${types}`;
  if (pstatus) query += `&pstatus=${pstatus}`;

  const response = await api.get(`users/products${query}`);
  return response.data;
};

export const productInfiniteQuery = (
  categories: string | null = null,
  types: string | null = null,
  pstatus: string | null = "ORDER"
) => ({
  queryKey: [
    "products",
    "infinite",
    categories ?? undefined,
    types ?? undefined,
    pstatus ?? undefined,
  ],
  queryFn: ({ pageParam }: { pageParam?: number | null }) =>
    fetchInfiniteProducts({ pageParam, categories, types, pstatus }),
  placeholderData: keepPreviousData,
  initialPageParam: null,
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined,
});

const fetchInfinitePreorderProducts = async ({
  pageParam = null,
  categories = null,
  types = null,
  pstatus = "PREORDER",
}: {
  pageParam?: number | null;
  categories?: string | null;
  types?: string | null;
  pstatus?: string | null;
}) => {
  let query = pageParam ? `?limit=9&cursor=${pageParam}` : "?limit=9";
  if (categories) query += `&category=${categories}`;
  if (types) query += `&type=${types}`;
  if (pstatus) query += `&pstatus=${pstatus}`;

  const response = await api.get(`users/preorder-products${query}`);
  return response.data;
};

export const preorderProductInfiniteQuery = (
  categories: string | null = null,
  types: string | null = null,
  pstatus: string | null = "PREORDER"
) => ({
  queryKey: [
    "preorder-products",
    "infinite",
    categories ?? undefined,
    types ?? undefined,
    pstatus ?? undefined,
  ],
  queryFn: ({ pageParam }: { pageParam?: number | null }) =>
    fetchInfinitePreorderProducts({ pageParam, categories, types, pstatus }),
  placeholderData: keepPreviousData,
  initialPageParam: null,
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined,
});
const fetchOneProduct = async (id: number | string) => {
  const productId = typeof id === "string" ? parseInt(id, 10) : id;
  const product = await api.get(`users/products/${productId}`);
  if (!product) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return product.data;
};

export const oneProductQuery = (id: number | string) => ({
  queryKey: ["products", "detail", id],
  queryFn: () => fetchOneProduct(id),
});

export const productReviewsQuery = (productId: number) => ({
  queryKey: ["reviews", "product", productId],
  queryFn: async () => {
    const res = await api.get(`users/reviews/${productId}`);
    return res.data.reviews;
  },
});

export const allReviewsQuery = () => ({
  queryKey: ["reviews", "admin"],
  queryFn: async () => {
    const res = await api.get("admins/reviews");
    return res.data.reviews;
  },
});

/* ADMIN – all reviews */
export const adminReviewsQuery = () => ({
  queryKey: ["admin", "reviews"],
  queryFn: async () => {
    const res = await api.get("admins/reviews");
    return res.data.reviews;
  },
});

const fetchCategories = async () => {
  const res = await api.get("admins/categories");
  return res.data.categories;
};

export const adminCategoriesQuery = () => ({
  queryKey: ["admin", "categories"],
  queryFn: fetchCategories,
});

const fetchCategoryById = async (id: number) => {
  const res = await api.get(`admins/categories/${id}`);
  return res.data;
};

export const adminCategoryQuery = (id: number) => ({
  queryKey: ["admin", "categories", id],
  queryFn: () => fetchCategoryById(id),
});

const fetchTypes = async () => {
  const res = await api.get("admins/types");
  return res.data;
};

export const adminTypesQuery = () => ({
  queryKey: ["admin", "types"],
  queryFn: fetchTypes,
});

const fetchTypeById = async (id: number) => {
  const res = await api.get(`admins/types/${id}`);
  return res.data;
};

export const adminTypeQuery = (id: number) => ({
  queryKey: ["admin", "types", id],
  queryFn: () => fetchTypeById(id),
});

const fetchAdminProducts = async () => {
  const res = await api.get("admins/products");
  return res.data.products;
};

export const adminProductsQuery = () => ({
  queryKey: ["admin", "products"],
  queryFn: fetchAdminProducts,
});

const fetchAdminProductById = async (id: number) => {
  const res = await api.get(`admins/products/${id}`);
  return res.data.product;
};

export const adminProductQuery = (id: number) => ({
  queryKey: ["admin", "products", id],
  queryFn: () => fetchAdminProductById(id),
});

export const adminUsersQuery = () => ({
  queryKey: ["admin", "users"],
  queryFn: async () => {
    const res = await api.get("admins/users");
    return res.data.users;
  },
});

export const adminUserQuery = (id: number) => ({
  queryKey: ["admin", "users", id],
  queryFn: async () => {
    const res = await api.get(`admins/users/${id}`);
    return res.data.user;
  },
});

const fetchDashboardStats = async () => {
  const response = await api.get("/admins/dashboard/stats");
  return response.data;
};

export const DashboardQuery = () => ({
  queryKey: ["admin", "dashboard", "stats"],
  queryFn: fetchDashboardStats,
});

export const userQuery = () => ({
  queryKey: ["user"],
  queryFn: async () => {
    const response = await api.get("/users/authdata");
    return response.data;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  retry: 1,
});

export const userProfileQuery = () => ({
  queryKey: ["user-profile"],
  queryFn: () => api.get("/users/profile").then((res) => res.data),
});

export const userOrdersQuery = (page = 1) => ({
  queryKey: ["user-orders", page],
  queryFn: () =>
    api.get(`/users/profile/orders?page=${page}`).then((res) => res.data),
});

export const updateProfileMutation = () => ({
  mutationFn: (data: any) =>
    api.put("/users/profile", data).then((res) => res.data),
});

const fetchCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const cartQuery = () => ({
  queryKey: ["cart"],
  queryFn: fetchCart,
  staleTime: 1000 * 60 * 5, // 5 minutes
  retry: 1,
});

const fetchProductWithStock = async (id: string | number) => {
  const productId = typeof id === "string" ? parseInt(id, 10) : id;

  const response = await api.get(`users/products/${productId}`);
  const product = response.data.product;

  // Calculate available stock
  return {
    ...product,
    available: (product.inventory || 0) - (product.reserved || 0),
  };
};
export const productWithStockQuery = (id: string | number) => ({
  queryKey: ["product-stock", id],
  queryFn: () => fetchProductWithStock(id),
});

export const fetchProductStock = async (productId: number) => {
  try {
    const response = await api.get(`users/products/${productId}/stock`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch stock for product ${productId}:`, error);
    throw error;
  }
};

export const productStockQuery = (productId: number) => ({
  queryKey: ["products", "stock", productId],
  queryFn: () => fetchProductStock(productId),
  staleTime: 30000,
  cacheTime: 60000,
  refetchOnMount: "always",
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

export const productStockFallbackQuery = (productId: number) => ({
  queryKey: ["products", "stock-fallback", productId],
  queryFn: () => fetchProductStock(productId),
  staleTime: 60000,
  cacheTime: 120000,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  enabled: false,
});
