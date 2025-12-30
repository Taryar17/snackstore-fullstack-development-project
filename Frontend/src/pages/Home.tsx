import { Link } from "react-router-dom";
import Snack from "../data/images/snacks.png";
import { Button } from "../components/ui/button";
import CarouselPlugin from "../components/products/CarouselCard";
import { products } from "../data/product";
import PreviewProduct from "../components/products/PreviewProduct";
import ProductCard from "../components/products/ProductCard";
import { FieldSeparator } from "../components/ui/field";

const sampleProducts = products.slice(0, 6);

function Home() {
  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          {/* Text Section */}
          <div className="my-8 text-center lg:mt-16 lg:mb-0 lg:w-2/5 lg:text-left">
            <h1 className="mb-4 text-4xl font-extrabold text-[#3b5d50] lg:mb-8 lg:text-6xl">
              Welcome to Your Snack Paradise
            </h1>
            <p className="mb-6 text-[#3b5d50] lg:mb-8">
              Discover a world of delightful snacks that bring joy to every
              moment. From savory treats to sweet indulgences, our curated
              selection is perfect for every craving and occasion.
            </p>
            <p className="mb-6 text-[#3b5d50] lg:mb-8">
              Whether you're relaxing at home, sharing with friends, or looking
              for a quick pick-me-up, snacks make life a little more enjoyable.
              Explore, savor, and celebrate the simple pleasures of snacking.
            </p>
            <div className="">
              <Button
                asChild
                className="mr-2 rounded-full bg-orange-300 px-8 py-6 text-base font-bold"
              >
                <Link to="#">Order Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-8 py-6 text-base font-bold text-[#3b5d50]"
              >
                <Link to="#">Explore</Link>
              </Button>
            </div>
          </div>
          <img
            src={Snack}
            alt="Snack"
            className="w-full lg:w-3/ max-w-125 mx-auto lg:mx-0"
          />
        </div>
        <hr />
        <h1 className="mt-4 mb-4 text-xl font-extrabold text-amber-800 lg:mb-8 lg:text-2xl">
          Best Sellers
        </h1>
        <CarouselPlugin products={products} />
        <FieldSeparator />
        <PreviewProduct
          title="Featured Products"
          href="/products"
          sideText="View All Products"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-6 px-4 mb-4 md:px-0">
          {sampleProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
