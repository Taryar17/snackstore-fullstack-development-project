import { useLoaderData, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import ProductCard from "../../components/products/ProductCard";
import { Icons } from "../../components/icons";
import { formatPrice } from "../../lib/utils";
import { Separator } from "../../components/ui/separator";
import Rating from "../../components/products/Rating";
import AddtoCart from "../../components/AddtoCartForm";
import ReviewList from "../../components/reviews/ReviewList";
import { useState } from "react";
import ReviewForm from "../../components/products/ReviewForm";
import { type Product } from "../../types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  oneProductQuery,
  productQuery,
  productReviewsQuery,
} from "../../api/query";
import AddToFavourite from "../../components/products/AddToFavourite";
import { useCartStore } from "../../store/cartStore";

const imageUrl = import.meta.env.VITE_IMG_URL;

function ProductDetail() {
  const navigate = useNavigate();

  const { productId } = useLoaderData();
  const { data: productsData } = useSuspenseQuery(productQuery("?limit=4"));
  const { data: productDetail } = useSuspenseQuery(oneProductQuery(productId));
  const { data: reviews } = useSuspenseQuery(
    productReviewsQuery(Number(productId))
  );

  const { addItem } = useCartStore();

  const handleUpdateCart = (quantity: number) => {
    addItem({
      id: productDetail.product.id,
      name: productDetail.product.name,
      price: productDetail.product.price,
      image: productDetail.product.images[0].path,
      quantity,
    });
  };
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <div className="container mx-auto px-4 md:px-0">
      <Button variant="outline" className="mt-8" onClick={() => navigate(-1)}>
        <Icons.arrowleft /> Back
      </Button>
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
          <p className="text-base text-muted-foreground">
            {productDetail.product.inventory} in stock
          </p>
          <div className="flex items-center justify-between">
            <Rating rating={productDetail.product.rating} />

            <span className="text-sm text-muted-foreground">
              ({reviews.length} reviews)
            </span>
            <AddToFavourite
              productId={String(productDetail.product.id)}
              rating={Number(productDetail.product.rating)}
              isFavourite={productDetail.product.users.length === 1}
            />
          </div>
          <AddtoCart
            canBuy={productDetail.product.status === "ACTIVE"}
            onHandleCart={handleUpdateCart}
            idInCart={productDetail.product.id}
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
            productId={Number(productDetail.product.id)}
            onSuccess={() => setShowReviewForm(false)}
          />
        )}

        <ReviewList reviews={reviews} />
      </div>
      <hr />
      <section className="space-y-6 overflow-auto">
        <h2 className="line-clamp-1 text-2xl  font-bold"></h2>
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
