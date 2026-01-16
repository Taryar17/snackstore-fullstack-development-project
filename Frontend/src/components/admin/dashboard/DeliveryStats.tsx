import { Card, CardContent } from "../../../components/ui/card";
import { Icons } from "../../../components/icons";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";

interface DeliveryStatsProps {
  ordersNeedingDeliveryDate: number;
  upcomingDeliveries: number;
  todaysDeliveries: number;
}

function DeliveryStats({
  ordersNeedingDeliveryDate,
  upcomingDeliveries,
  todaysDeliveries,
}: DeliveryStatsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Delivery Management</h2>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admins/orders">Manage Orders</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Orders needing delivery date */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Awaiting Date
                </p>
                <p className="text-2xl font-bold text-yellow-900">
                  {ordersNeedingDeliveryDate}
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Orders need delivery date
                </p>
              </div>
              <Icons.clock className="h-8 w-8 text-yellow-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming deliveries */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  Upcoming Deliveries
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {upcomingDeliveries}
                </p>
                <p className="text-xs text-blue-700 mt-1">Next 7 days</p>
              </div>
              <Icons.calendar className="h-8 w-8 text-blue-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Today's deliveries */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-green-800 font-medium">
                  Today's Deliveries
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {todaysDeliveries}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Scheduled for today
                </p>
              </div>
              <Icons.truck className="h-8 w-8 text-green-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DeliveryStats;
