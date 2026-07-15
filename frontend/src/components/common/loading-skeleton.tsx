import { Stack, Skeleton, SimpleGrid, Paper } from "@mantine/core";

export function LoadingSkeleton() {
  return (
    <Stack gap="2rem">
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
        {Array.from({ length: 8 }).map((_, i) => (
          <Paper key={i} radius="lg" withBorder style={{ overflow: "hidden" }}>
            <Skeleton height={220} />
            <Stack gap="xs" p="md">
              <Skeleton height={10} width="35%" />
              <Skeleton height={16} width="70%" />
              <Skeleton height={20} width="30%" />
              <Skeleton height={28} width="100%" />
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
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
