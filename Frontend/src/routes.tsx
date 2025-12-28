import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import ErrorPage from "./pages/Error";

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
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
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
]);
