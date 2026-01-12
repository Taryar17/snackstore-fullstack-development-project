import { Icons } from "../icons";
import { cn } from "../../lib/utils";

interface RatingProps {
  rating: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

function Rating({ rating, interactive = false, onChange }: RatingProps) {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1;

        return (
          <Icons.star
            key={i}
            onClick={() => interactive && onChange?.(value)}
            className={cn(
              "size-4",
              rating >= value ? "text-yellow-500" : "text-muted-foreground",
              interactive && "cursor-pointer hover:text-yellow-400"
            )}
          />
        );
      })}
    </div>
  );
}

export default Rating;
