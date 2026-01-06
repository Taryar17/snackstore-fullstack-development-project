import type { Product } from "../../types";
import { Link } from "react-router-dom";
import { Icons } from "../icons";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { formatPrice } from "../../lib/utils";
import { cn } from "../../lib/utils";

interface ProductProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  product: Product;
}

function ProductCard({ product, className }: ProductProps) {
  const imageURL = import.meta.env.VITE_IMG_URL;
  return (
    <Card className={cn("size-full overflow-hidden rounded-lg", className)}>
      <Link to={`/products/${product.id}`} aria-label={product.name}>
        <div>
          <CardHeader className="border-b p-0">
            <AspectRatio ratio={1 / 1} className="">
              <img
                src={imageURL + product.images[0].path}
                alt="product image"
                decoding="async"
                loading="lazy"
                className="size-full object-contain"
              />
            </AspectRatio>
          </CardHeader>
          <CardContent className="space-y-1.5 pt-4">
            <CardTitle className="line-clamp-1">{product.name}</CardTitle>
            <CardDescription className="line-clamp-1">
              {formatPrice(product.price)}
              {product.discount > 0 && (
                <span className="ml-2 font-extralight line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </CardDescription>
          </CardContent>
        </div>
      </Link>
      <CardFooter className="p-4 pt-1">
        {product.status === "INACTIVE" ? (
          <Button
            size="sm"
            disabled={true}
            aria-label="Out of Stock"
            className="h-8 w-full rounded-sm font-bold"
          >
            Out of Stock
          </Button>
        ) : (
          <Button
            size="sm"
            className="h-8 w-full rounded-sm bg-orange-500 font-bold"
          >
            <Icons.plus />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
