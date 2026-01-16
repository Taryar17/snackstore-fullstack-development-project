// Alternative AddToFavourite.tsx using direct API
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { Icons } from "../../components/icons";
import api from "../../api";
import { toast } from "sonner";

interface FavouriteProp extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  productId: string;
  rating: number;
  isFavourite: boolean;
}

function AddToFavourite({
  productId,
  isFavourite: initialIsFavourite,
  className,
  ...props
}: FavouriteProp) {
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavourite = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const newFavouriteState = !isFavourite;

      await api.patch("users/products/toggle-favourite", {
        productId: Number(productId),
        favourite: newFavouriteState,
      });

      setIsFavourite(newFavouriteState);
      toast.success(
        newFavouriteState ? "Added to favourites" : "Removed from favourites"
      );
    } catch (error: any) {
      console.error("Failed to toggle favourite:", error);
      toast.error(
        error.response?.data?.message || "Failed to update favourite"
      );
      // Revert on error
      setIsFavourite(isFavourite);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      className={cn("size-8 shrink-0", className)}
      onClick={handleToggleFavourite}
      disabled={isLoading}
      title={isFavourite ? "Remove from favourites" : "Add to favourites"}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="size-4 animate-spin" />
      ) : isFavourite ? (
        <Icons.heartFill className="size-4 text-red-500" />
      ) : (
        <Icons.heart className="size-4 text-red-500" />
      )}
    </Button>
  );
}

export default AddToFavourite;
