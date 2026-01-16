// ProductDetail.tsx - FIXED with missing imports
import { useLoaderData, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import ProductCard from "../../components/products/ProductCard";
import { Icons } from "../../components/icons";
import { formatPrice } from "../../lib/utils";
import { Separator } from "../../components/ui/separator";
import Rating from "../../components/products/Rating";
import AddtoCart from "../../components/carts/AddtoCartForm";
import ReviewList from "../../components/reviews/ReviewList";
import { useState } from "react";
import ReviewForm from "../../components/products/ReviewForm";
import { type Product } from "../../types";
import { useWebSocketStock } from "../../hook/useWebSocketStock";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import {
  oneProductQuery,
  productQuery,
  productReviewsQuery,
  productStockQuery,
} from "../../api/query";
import AddToFavourite from "../../components/products/AddToFavourite";
import { useCartStore } from "../../store/cartStore";

const imageUrl = import.meta.env.VITE_IMG_URL;

function ProductDetail() {
  const navigate = useNavigate();

  const { productId } = useLoaderData();
  const productIdNum = Number(productId);

  const { data: productsData } = useSuspenseQuery(productQuery("?limit=4"));
  const { data: productDetail } = useSuspenseQuery(oneProductQuery(productId));
  const { data: reviews } = useSuspenseQuery(productReviewsQuery(productIdNum));

  const { stock: wsStock, isConnected: wsConnected } =
    useWebSocketStock(productIdNum);

  const {
    data: httpStock,
    isLoading: stockLoading,
    error: stockError,
    refetch: refetchHttpStock,
  } = useQuery(productStockQuery(productIdNum));

  const { addItemToServer, carts } = useCartStore();

  const stockData = wsStock || httpStock;

  const userReserved =
    productDetail?.product?.userReserved || stockData?.userReserved || 0;

  const availableStock =
    stockData?.available ||
    Math.max(
      0,
      (productDetail?.product?.inventory || 0) -
        (productDetail?.product?.reserved || 0)
    );

  const availableForUser = Math.max(0, availableStock - userReserved);

  const totalInventory =
    stockData?.inventory || productDetail.product.inventory;

  // Calculate if product can be bought
  const canBuy =
    productDetail.product.status === "ACTIVE" && availableForUser > 0;

  const handleUpdateCart = async (quantity: number) => {
    try {
      await addItemToServer({
        id: productDetail.product.id,
        name: productDetail.product.name,
        price: Number(productDetail.product.price),
        image: productDetail.product.images[0].path,
        quantity,
      });

      // Force refetch HTTP stock as backup
      await refetchHttpStock();
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      throw error; // Re-throw to be caught by AddtoCart component
    }
  };

  const [showReviewForm, setShowReviewForm] = useState(false);

  // Show loading state only for HTTP fallback (WebSocket shows cached data immediately)
  if (!wsConnected && stockLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Icons.spinner className="mx-auto h-8 w-8 animate-spin" />
        <p className="mt-2">Loading stock information...</p>
        {!wsConnected && (
          <p className="text-sm text-muted-foreground mt-1">
            (WebSocket disconnected, using HTTP)
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-0">
      <Button variant="outline" className="mt-8" onClick={() => navigate(-1)}>
        <Icons.arrowleft /> Back
      </Button>

      {/* WebSocket connection status indicator */}
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center gap-2 text-sm">
          <div
            className={`h-2 w-2 rounded-full ${
              wsConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-muted-foreground">
            {wsConnected
              ? "Real-time updates connected"
              : "Using periodic updates"}
          </span>
        </div>
      </div>

      <section className="flex flex-col gap-16 md:flex-row md:gap-16 my-6">
        <div className="mx-auto w-full md:w-1/2 max-w-75 self-start">
          <img
            src={imageUrl + productDetail.product?.images[0].path}
            alt="product image"
            loading="lazy"
            decoding="async"
            className="size-full rounded-md object-cover"
          />
        </div>
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="">
            <h2 className="line-clamp-1 text-2xl font-bold">
              {productDetail.product.name}
            </h2>
            <p className="text-base text-muted-foreground">
              {formatPrice(Number(productDetail.product.price))}
            </p>
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                productDetail.product.pstatus === "ORDER"
                  ? "bg-green-50 text-green-700 ring-green-600/20"
                  : "bg-blue-50 text-blue-700 ring-blue-600/20"
              }`}
            >
              {productDetail.product.pstatus === "ORDER"
                ? "Available to Order"
                : "Pre-order"}
            </span>
          </div>
          <Separator className="my-1" />

          {/* Stock Display */}
          <div className="space-y-1">
            <p className="text-base text-muted-foreground">
              {stockError && !wsStock ? (
                <span className="text-yellow-600">
                  Unable to load stock information
                </span>
              ) : availableForUser > 0 ? (
                `${availableForUser} available for you (${totalInventory} in stock)`
              ) : userReserved > 0 ? (
                "All available stock is in your cart"
              ) : (
                "Out of stock"
              )}
            </p>

            {/* Last update time */}
            {userReserved > 0 && (
              <p className="text-sm text-muted-foreground">
                You have {userReserved} in your cart
              </p>
            )}

            {/* Last update time */}
            {stockData?.timestamp && (
              <p className="text-xs text-muted-foreground">
                Updated: {new Date(stockData.timestamp).toLocaleTimeString()}
                {wsConnected && (
                  <span className="ml-1 text-green-600">• Live</span>
                )}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Rating rating={productDetail.product.rating} />

            <span className="text-sm text-muted-foreground">
              ({reviews.length} reviews)
            </span>
            <AddToFavourite
              productId={String(productDetail.product.id)}
              rating={Number(productDetail.product.rating)}
              isFavourite={productDetail.product.users?.length === 1}
            />
          </div>

          <AddtoCart
            canBuy={canBuy}
            onHandleCart={handleUpdateCart}
            idInCart={productDetail.product.id}
            availableStock={availableForUser}
            productName={productDetail.product.name}
            productPrice={Number(productDetail.product.price)}
            productImage={productDetail.product.images[0].path}
            onStockRefetch={refetchHttpStock}
            wsConnected={wsConnected}
          />

          <Separator className="my-1" />
        </div>
      </section>
      <Accordion type="single" collapsible className="w-full" defaultValue="">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="">Description</AccordionTrigger>
          <AccordionContent>
            {productDetail.product.description ??
              "No description is available for this product."}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Separator className="my-4" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Customer Reviews</h3>

          <Button size="sm" onClick={() => setShowReviewForm((prev) => !prev)}>
            {showReviewForm ? "Cancel" : "Write a Review"}
          </Button>
        </div>

        {showReviewForm && (
          <ReviewForm
            productId={productIdNum}
            onSuccess={() => setShowReviewForm(false)}
          />
        )}

        <ReviewList reviews={reviews} />
      </div>
      <hr />
      <section className="space-y-6 overflow-auto">
        <h2 className="line-clamp-1 text-2xl  font-bold">Related Products</h2>
        <ScrollArea className="pb-4">
          <div className="flex gap-4">
            {productsData.products.slice(0, 6).map((item: Product) => (
              <ProductCard key={item.id} product={item} className="min-w-65" />
            ))}
          </div>
          <Scrollbar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  );
}

export default ProductDetail;
