import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Paper as MPaper, Title as MTitle } from "@mantine/core";

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <MPaper p="md" radius="md" withBorder>
      <MTitle order={4} mb="md">Ingresos por Día</MTitle>
      {data.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--mantine-color-dimmed)" }}>
          No hay datos
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#228be6" fill="#228be620" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </MPaper>
  );
}
