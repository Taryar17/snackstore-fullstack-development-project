import { Link, useParams } from "react-router-dom";
import { products } from "../../data/product";
import { Button } from "../../components/ui/button";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import ProductCard from "../../components/products/ProductCard";
import { Icons } from "../../components/icons";
import { formatPrice } from "../../lib/utils";
import { Separator } from "../../components/ui/separator";
import Rating from "../../components/products/Rating";
import AddtoCart from "../../components/AddtoCartForm";
import ReviewList from "../../components/reviews/ReviewList";
import { getAverageRating } from "../../lib/review";
import { reviews } from "../../data/review";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

function ProductDetail() {
  const { productId } = useParams();
  console.log(productId);
  const product = products.find((product) => product.id == productId);

  const averageRating = getAverageRating(reviews);

  return (
    <div className="container mx-auto px-4 md:px-0">
      <Button asChild variant="outline" className="mt-8">
        <Link to="/products">
          <Icons.arrowleft /> All Products
        </Link>
      </Button>
      <section className="flex flex-col gap-16 md:flex-row md:gap-16 my-6">
        <div className="mx-auto w-full md:w-1/2 max-w-75 self-start">
          <img
            src={product?.images[0]}
            alt="product image"
            loading="lazy"
            className="size-full rounded-md object-cover"
          />
        </div>
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="">
            <h2 className="line-clamp-1 text-2xl font-bold">{product?.name}</h2>
            <p className="text-base text-muted-foreground">
              {formatPrice(Number(product?.price))}
            </p>
          </div>
          <Separator className="my-1" />
          <p className="text-base text-muted-foreground">
            {product?.inventory} in stock
          </p>
          <div className="flex items-center justify-between">
            <Rating rating={averageRating} />
            <span className="text-sm text-muted-foreground">
              ({reviews.length} reviews)
            </span>
          </div>
          <AddtoCart canBuy={product?.status === "order" ? true : false} />
          <Separator className="my-1" />
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue=""
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="">Description</AccordionTrigger>
              <AccordionContent>
                {product?.description ??
                  "No description is available for this product."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            <ReviewList reviews={reviews} />
          </div>
        </div>
      </section>
      <hr />
      <section className="space-y-6 overflow-auto">
        <h2 className="line-clamp-1 text-2xl  font-bold"></h2>
        <ScrollArea className="pb-4">
          <div className="flex gap-4">
            {products.slice(0, 6).map((item) => (
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
