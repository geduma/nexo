import { Stack, Skeleton, Paper } from "@mantine/core";

export function LoadingSkeleton() {
  return (
    <Paper p="md" radius="md" withBorder>
      <Stack gap="md">
        <Skeleton height={20} width="40%" />
        <Skeleton height={16} width="60%" />
        <Skeleton height={16} width="80%" />
        <Skeleton height={16} width="50%" />
      </Stack>
    </Paper>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Stack gap="sm">
      <Skeleton height={40} />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={50} />
      ))}
    </Stack>
  );
}
