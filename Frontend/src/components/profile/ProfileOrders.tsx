import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Icons } from "../icons";

export function ProfileOrders() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <h3 className="text-lg font-semibold">Your Orders</h3>
          <p className="text-muted-foreground text-sm">
            View all your purchased snacks
          </p>
        </div>

        <Button asChild>
          <Link to="/orders">
            <Icons.bookmark className="mr-2 size-4" />
            View Orders
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
