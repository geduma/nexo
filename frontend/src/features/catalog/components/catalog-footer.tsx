import { Text, Box } from "@mantine/core";

interface CatalogFooterProps {
  businessName: string;
}

export function CatalogFooter({ businessName }: CatalogFooterProps) {
  return (
    <Box py="lg" ta="center">
      <Text size="xs" c="dimmed">
        &copy; {new Date().getFullYear()} {businessName}. Powered by NEXO
      </Text>
    </Box>
  );
}
