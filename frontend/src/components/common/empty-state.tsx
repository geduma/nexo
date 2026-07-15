import { Box, Stack, Text, Paper } from "@mantine/core";
import { Package } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Paper p="xl" ta="center" withBorder>
      <Stack align="center" gap="md">
        <Box c="dimmed">{icon ?? <Package size={48} />}</Box>
        <div>
          <Text fw={500} size="lg">
            {title}
          </Text>
          <Text c="dimmed" size="sm">
            {description}
          </Text>
        </div>
        {action}
      </Stack>
    </Paper>
  );
}
