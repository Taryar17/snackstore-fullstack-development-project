import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";

import ProductCard from "../../components/products/ProductCard";
import ProductFilter from "../../components/products/ProductFilter";

import {
  categoryTypeQuery,
  preorderProductInfiniteQuery,
  queryClient,
} from "../../api/query";
import { Button } from "../../components/ui/button";

function Product() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawCategory = searchParams.get("categories");
  const rawType = searchParams.get("types");
  const pstatus = searchParams.get("pstatus") || "PREORDER";

  // Decode & parse search params
  const selectedCategory = rawCategory
    ? decodeURIComponent(rawCategory)
        .split(",")
        .map((cat) => Number(cat.trim()))
        .filter((cat) => !isNaN(cat))
        .map((cat) => cat.toString())
    : [];

  const selectedType = rawType
    ? decodeURIComponent(rawType)
        .split(",")
        .map((type) => Number(type.trim()))
        .filter((type) => !isNaN(type))
        .map((type) => type.toString())
    : [];

  const cat = selectedCategory.length > 0 ? selectedCategory.join(",") : null;
  const typ = selectedType.length > 0 ? selectedType.join(",") : null;

  const { data: cateType } = useSuspenseQuery(categoryTypeQuery());
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(preorderProductInfiniteQuery(cat, typ, pstatus));

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];

  const handleFilterChange = (categories: string[], types: string[]) => {
    const newParams = new URLSearchParams();
    if (categories.length > 0)
      newParams.set("categories", encodeURIComponent(categories.join(",")));
    if (types.length > 0)
      newParams.set("types", encodeURIComponent(types.join(",")));

    // Preserve pstatus parameter
    if (pstatus) {
      newParams.set("pstatus", pstatus);
    }

    // Updates URL & triggers refetch via query key
    setSearchParams(newParams);
    // Cancel In-flight queries
    queryClient.cancelQueries({ queryKey: ["products", "infinite"] });
    // Clear cache
    queryClient.removeQueries({ queryKey: ["products", "infinite"] });
    refetch();
  };

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="container mx-auto">
      <section className="flex flex-col lg:flex-row">
        <section className="my-8 ml-4 w-full lg:ml-0 lg:w-1/5">
          <ProductFilter
            filterList={cateType}
            selectedCategory={selectedCategory}
            selectedType={selectedType}
            onFilterChange={handleFilterChange}
          />
        </section>
        <section className="w-full lg:ml-0 lg:w-4/5">
          <div className="flex items-center justify-between my-8 ml-4">
            <h1 className="text-2xl font-bold">
              {pstatus === "ORDER" ? "In-Stock Products" : "Pre-order Products"}
            </h1>
            {pstatus === "ORDER" ? (
              <Button asChild variant="outline" className="rounded-full">
                <a href="/preorders?pstatus=PREORDER">
                  View Pre-order Products
                </a>
              </Button>
            ) : (
              <Button asChild variant="outline" className="rounded-full">
                <a href="/products?pstatus=ORDER">View In-Stock Products</a>
              </Button>
            )}
          </div>
          <div className="mb-12 grid grid-cols-1 gap-6 gap-y-12 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-3">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="my-4 flex justify-center">
            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              variant={!hasNextPage ? "ghost" : "secondary"}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
            </Button>
          </div>
          <div>
            {isFetching && !isFetchingNextPage
              ? "Background Updating..."
              : null}
          </div>
        </section>
      </section>
    </div>
  );
}

export default Product;
