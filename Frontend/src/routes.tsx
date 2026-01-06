import { createBrowserRouter, redirect } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import ErrorPage from "./pages/Error";
import LoginPage from "./pages/auth/Login";
import AuthRootLayout from "./pages/auth/AuthRootLayout";
import ProfilePage from "./pages/Profile";
import AdminRootLayout from "./pages/admin/AdminRootLayout";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminProductList from "./pages/admin/products/AdminProductList";
import AdminProductDetail from "./pages/admin/products/AdminProductDetail";
import AdminUserList from "./pages/admin/users/AdminUserList";
import AdminOrderList from "./pages/admin/orders/AdminOrderList";
import AdminUserDetail from "./pages/admin/users/AdminUserDetail";
import AdminOrderDetail from "./pages/admin/orders/AdminOrderDetail";
import { confirmLoader, loginLoader, otpLoader } from "./router/loader";
import {
  confirmAction,
  loginAction,
  logoutAction,
  otpAction,
  registerAction,
} from "./router/action";
import SignUpPage from "./pages/auth/SignUp";
import OtpPage from "./pages/auth/Otp";
import ConfirmPasswordPage from "./pages/auth/ConfirmPassword";

const ProductRootLayout = lazy(
  () => import("./pages/products/ProductRootLayout")
);
const ProductPage = lazy(() => import("./pages/products/Product"));
const ProductDetailPage = lazy(() => import("./pages/products/ProductDetail"));

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
    path: "/login",
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <LoginPage />
      </Suspense>
    ),
    loader: loginLoader,
    action: loginAction,
  },
  {
    path: "/logout",
    action: logoutAction,
    loader: () => redirect("/"),
  },
  {
    path: "register",
    element: <AuthRootLayout />,
    children: [
      {
        index: true,
        element: <SignUpPage />,
        loader: loginLoader,
        action: registerAction,
      },
      {
        path: "otp",
        element: <OtpPage />,
        loader: otpLoader,
        action: otpAction,
      },
      {
        path: "confirm-password",
        element: <ConfirmPasswordPage />,
        loader: confirmLoader,
        action: confirmAction,
      },
    ],
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
          {
            index: true,
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminProductList />
              </Suspense>
            ),
          },
          {
            path: ":productId",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminProductDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "users",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminUserList />
              </Suspense>
            ),
          },
          {
            path: ":userId",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminUserDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "orders",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminOrderList />
              </Suspense>
            ),
          },
          {
            path: ":orderId",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminOrderDetail />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);
