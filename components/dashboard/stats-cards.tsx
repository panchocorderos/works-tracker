import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardStats } from "@/types";
import { CheckCircle2, Clock, AlertTriangle, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total",
      value: stats.total_works,
      description: "Obras totales",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Completadas",
      value: stats.completed_works,
      description: "Entregadas exitosamente",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "En Progreso",
      value: stats.in_progress_works,
      description: "Trabajando actualmente",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Atrasadas",
      value: stats.overdue_works,
      description: "Requieren atención",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promedio</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.average_delivery_days}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              días
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Tiempo promedio de entrega</p>
        </CardContent>
      </Card>
    </div>
  );
}
