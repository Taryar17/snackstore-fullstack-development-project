import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import ErrorPage from "./pages/Error";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import ProfilePage from "./pages/Profile";
import AdminRootLayout from "./pages/admin/AdminRootLayout";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminProductList from "./pages/admin/products/AdminProductList";
import AdminProductDetail from "./pages/admin/products/AdminProductDetail";
import AdminUserList from "./pages/admin/users/AdminUserList";
import AdminOrderList from "./pages/admin/orders/AdminOrderList";
import AdminUserDetail from "./pages/admin/users/AdminUserDetail";
import AdminOrderDetail from "./pages/admin/orders/AdminOrderDetail";

const ProductRootLayout = lazy(
  () => import("./pages/products/ProductRootLayout")
);
const ProductPage = lazy(() => import("./pages/products/Product"));
const ProductDetailPage = lazy(() => import("./pages/products/ProductDetail"));
// import ProductRootLayout from "./pages/products/ProductRootLayout";
// import ProductPage from "./pages/products/Product";
// import ProductDetailPage from "./pages/products/ProductDetail";

const SuspenseFallback = () => <div className="text-center">Loading...</div>;
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <ProductRootLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <ProductPage />
              </Suspense>
            ),
          },
          {
            path: ":productId",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <ProductDetailPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "login",
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "register",
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: "admin",
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <AdminRootLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: "products",
        children: [
          { index: true, element: <AdminProductList /> },
          { path: ":productId", element: <AdminProductDetail /> },
        ],
      },
      {
        path: "users",
        children: [
          { index: true, element: <AdminUserList /> },
          { path: ":userId", element: <AdminUserDetail /> },
        ],
      },
      {
        path: "orders",
        children: [
          { index: true, element: <AdminOrderList /> },
          { path: ":orderId", element: <AdminOrderDetail /> },
        ],
      },
    ],
  },
]);
