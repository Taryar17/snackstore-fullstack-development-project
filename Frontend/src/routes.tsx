import { createBrowserRouter, redirect } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import ErrorPage from "./pages/Error";
import LoginPage from "./pages/auth/Login";
import AuthRootLayout from "./pages/auth/AuthRootLayout";
import ProfilePage from "./pages/profile/Profile";
import AdminRootLayout from "./pages/admin/AdminRootLayout";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminProductList from "./pages/admin/products/AdminProductList";
import AdminProductDetail from "./pages/admin/products/AdminProductDetail";
import AdminUserList from "./pages/admin/users/AdminUserList";
import AdminOrderList from "./pages/admin/orders/AdminOrderList";
import AdminUserDetail from "./pages/admin/users/AdminUserDetail";
import AdminOrderDetail from "./pages/admin/orders/AdminOrderDetail";
import ResetPasswordPage from "./pages/auth/ResetPassword";
import NewPasswordPage from "./pages/auth/NewPassword";
import {
  adminCategoryDetailLoader,
  adminCategoryListLoader,
  adminOrderDetailLoader,
  adminProductCreateLoader,
  adminProductDetailLoader,
  adminProductListLoader,
  adminReviewsLoader,
  adminTypeDetailLoader,
  adminTypeListLoader,
  adminUserDetailLoader,
  adminUserListLoader,
  confirmLoader,
  homeLoader,
  loginLoader,
  newPasswordLoader,
  otpLoader,
  preorderProductInfiniteLoader,
  productInfiniteLoader,
  productLoader,
  profileOrderDetailLoader,
  verifyLoader,
} from "./router/loader";
import {
  changeReviewStatusAction,
  confirmAction,
  createCategoryAction,
  createProductAction,
  createTypeAction,
  deleteCategoryAction,
  deleteProductAction,
  deleteReviewAction,
  deleteTypeAction,
  loginAction,
  logoutAction,
  newPasswordAction,
  otpAction,
  productDetailAction,
  registerAction,
  resetAction,
  updateAdminUserAction,
  updateCategoryAction,
  updateProductAction,
  updateTypeAction,
  verifyAction,
} from "./router/action";
import SignUpPage from "./pages/auth/SignUp";
import OtpPage from "./pages/auth/Otp";
import ConfirmPasswordPage from "./pages/auth/ConfirmPassword";
import AdminCategoryList from "./pages/admin/categories/AdminCategoryList";
import AdminCategoryDetail from "./pages/admin/categories/AdminCategoryDetail";
import AdminTypeList from "./pages/admin/types/AdminTypeList";
import AdminTypeDetail from "./pages/admin/types/AdminTypeDetail";
import VerifyOtpPage from "./pages/auth/VerifyOtp";
import AdminReviewList from "./pages/admin/reviews/AdminReviewList";
import AdminCategoryCreate from "./pages/admin/categories/AdminCategoryCreate";
import AdminTypeCreate from "./pages/admin/types/AdminTypeCreate";
import AdminProductCreate from "./pages/admin/products/AdminProductCreate";
import PreorderProductPage from "./pages/products/PreorderProductPage";
import CheckoutPage from "./pages/orders/Checkout";
import ProfileOrdersPage from "./pages/profile/ProfileOrdersPage";
import ProfileOrderDetail from "./pages/profile/ProfileOrderDetail";

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
        loader: homeLoader,
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
        children: [
          {
            index: true,
            element: <ProfilePage />,
          },
          {
            path: "orders",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <ProfileOrdersPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "orders/:orderId",
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <ProfileOrderDetail />
          </Suspense>
        ),
        loader: profileOrderDetailLoader,
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
            loader: productInfiniteLoader,
          },
        ],
      },
      {
        path: "preorders",
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
                <PreorderProductPage />
              </Suspense>
            ),
            loader: preorderProductInfiniteLoader,
          },
        ],
      },
      {
        path: "products/:productId",
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <ProductDetailPage />
          </Suspense>
        ),
        loader: productLoader,
        action: productDetailAction,
      },
      {
        path: "checkout",
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <CheckoutPage />
          </Suspense>
        ),
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
    path: "/reset",
    element: <AuthRootLayout />,
    children: [
      {
        index: true,
        element: <ResetPasswordPage />,
        action: resetAction,
      },
      {
        path: "verify",
        element: <VerifyOtpPage />,
        loader: verifyLoader,
        action: verifyAction,
      },
      {
        path: "new-password",
        element: <NewPasswordPage />,
        loader: newPasswordLoader,
        action: newPasswordAction,
      },
    ],
  },
  {
    path: "admins",
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
        path: "categories",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminCategoryList />
              </Suspense>
            ),
            loader: adminCategoryListLoader,
            action: deleteCategoryAction,
          },
          {
            path: ":categoryId",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminCategoryDetail />
              </Suspense>
            ),
            loader: adminCategoryDetailLoader,
            action: updateCategoryAction,
          },
          {
            path: "new",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                {/* Create your AdminCategoryCreate component */}
                <AdminCategoryCreate />
              </Suspense>
            ),
            action: createCategoryAction,
          },
        ],
      },
      {
        path: "types",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminTypeList />
              </Suspense>
            ),
            loader: adminTypeListLoader,
            action: deleteTypeAction,
          },
          {
            path: ":typeId",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminTypeDetail />
              </Suspense>
            ),
            loader: adminTypeDetailLoader,
            action: updateTypeAction,
          },
          {
            path: "new",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                {/* Create your AdminTypeCreate component */}
                <AdminTypeCreate />
              </Suspense>
            ),
            action: createTypeAction,
          },
        ],
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
            loader: adminProductListLoader, // Add this loader
            action: deleteProductAction, // Add this action
          },
          {
            path: "new",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminProductCreate />
              </Suspense>
            ),
            loader: adminProductCreateLoader, // Add this loader
            action: createProductAction, // Add this action
          },
          {
            path: ":productId",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminProductDetail />
              </Suspense>
            ),
            loader: adminProductDetailLoader,
            action: updateProductAction,
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
            loader: adminUserListLoader,
          },
          {
            path: ":userId",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminUserDetail />
              </Suspense>
            ),
            loader: adminUserDetailLoader,
            action: updateAdminUserAction,
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
            loader: adminOrderDetailLoader,
          },
        ],
      },
      {
        path: "reviews",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <AdminReviewList />
              </Suspense>
            ),
            loader: adminReviewsLoader,
            action: changeReviewStatusAction,
          },
          {
            path: "delete",
            action: deleteReviewAction,
          },
        ],
      },
    ],
  },
]);
