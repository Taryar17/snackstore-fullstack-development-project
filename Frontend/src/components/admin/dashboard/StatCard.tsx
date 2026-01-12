import { Card, CardContent } from "../../../components/ui/card";

interface Props {
  title: string;
  value: string;
  icon: React.ElementType;
}

export default function StatCard({ title, value, icon: Icon }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className="size-8 text-muted-foreground opacity-80" />
      </CardContent>
    </Card>
  );
}
