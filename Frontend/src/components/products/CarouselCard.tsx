import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { Product } from "../../types";
import { Link } from "react-router-dom";

interface ProductProps {
  products: Product[];
}

export default function CarouselPlugin({ products }: ProductProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="ml-1">
        {products.map((product) => (
          <CarouselItem key={product.id} className="pl-1 lg:basis-1/3">
            <div className="pl-1 lg:basis-1/3">
              <div className="flex p-4 lg:px-4 gap-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="size-28 rounded-md"
                />
                <div className="">
                  <h3 className="text-sm font-bold line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="my-2 line-clamp-2 text-sm text-gray-600">
                    {product.description}
                  </p>
                  <Link
                    to={`/products/${product.id}`}
                    className="text-own text-sm font-semibold hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
