import { Card, CardContent } from "../../../components/ui/card";

interface Props {
  title: string;
  value: string;
  icon: React.ElementType;
}

export default function AdminStatCard({ title, value, icon: Icon }: Props) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className="size-6 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}
