import { Title, Box, Group } from "@mantine/core";

interface CatalogHeaderProps {
  businessName: string;
  logoUrl?: string | null;
}

export function CatalogHeader({ businessName, logoUrl }: CatalogHeaderProps) {
  return (
    <Group justify="center" py="lg">
      {logoUrl && (
        <Box
          component="img"
          src={logoUrl}
          alt={businessName}
          h={40}
          style={{ objectFit: "contain" }}
        />
      )}
      <Title order={1}>{businessName}</Title>
    </Group>
  );
}
