import { useState, useRef } from "react";
import {
  Stack,
  Title,
  Select,
  Button,
  Group,
  SimpleGrid,
  Paper,
  Text,
  Box,
} from "@mantine/core";
import { Download, Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { apiClient } from "../../../services/api/client";

interface Product {
  id: string;
  name: string;
  priceSale: number;
  description: string | null;
  categoryName: string;
  primaryImageUrl: string | null;
}

interface Settings {
  businessName: string;
  whatsappNumber: string;
  currencySymbol: string;
}

type TemplateType = "square" | "story" | "landscape";

const TEMPLATES: Record<TemplateType, { label: string; width: number; height: number }> = {
  square: { label: "Cuadrado (1080x1080)", width: 1080, height: 1080 },
  story: { label: "Story (1080x1920)", width: 1080, height: 1920 },
  landscape: { label: "Paisaje (1200x628)", width: 1200, height: 628 },
};

export function SocialGeneratorPage() {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateType>("square");
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const { data: products } = useQuery<Product[]>({
    queryKey: ["products-select"],
    queryFn: async () => {
      const response = await apiClient.get("/products?limit=100&visible=true");
      return response.data.data;
    },
  });

  const { data: settings } = useQuery<{ data: Settings }>({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await apiClient.get("/settings");
      return response.data;
    },
  });

  const product = products?.find((p) => p.id === selectedProduct);
  const settingsData = settings?.data;

  const productOptions = (products ?? []).map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const templateOptions = Object.entries(TEMPLATES).map(([key, val]) => ({
    value: key,
    label: val.label,
  }));

  const getMarketingText = () => {
    if (!product || !settingsData) return "";
    const symbol = settingsData.currencySymbol ?? "$";
    let text = `${product.name}\n\n`;
    text += `${symbol} ${product.priceSale.toLocaleString()}\n\n`;
    if (product.description) {
      text += `${product.description}\n\n`;
    }
    if (settingsData.businessName) {
      text += `${settingsData.businessName}\n`;
    }
    text += `Consulta: wa.me/${settingsData.whatsappNumber}`;
    return text;
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toPng(previewRef.current, {
        width: TEMPLATES[template].width,
        height: TEMPLATES[template].height,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `${product?.name ?? "post"}-${template}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // error
    }
  };

  const handleCopyText = async () => {
    const text = getMarketingText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // error
    }
  };

  return (
    <Stack gap="lg">
      <Title order={2}>{t("nav.social")}</Title>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Paper p="md" radius="md" withBorder>
          <Stack gap="md">
            <Select
              label={t("sales.product")}
              data={productOptions}
              value={selectedProduct}
              onChange={setSelectedProduct}
              searchable
            />

            <Select
              label="Template"
              data={templateOptions}
              value={template}
              onChange={(v) => v && setTemplate(v as TemplateType)}
            />

            <Group>
              <Button
                leftSection={<Download size={16} />}
                onClick={handleDownload}
                disabled={!product}
              >
                Descargar PNG
              </Button>
              <Button
                variant="light"
                leftSection={copied ? <Check size={16} /> : <Copy size={16} />}
                onClick={handleCopyText}
                disabled={!product}
              >
                {copied ? "Copiado!" : "Copiar Texto"}
              </Button>
            </Group>
          </Stack>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Title order={5} mb="md">Preview</Title>
          {product ? (
            <div
              ref={previewRef}
              style={{
                width: "100%",
                aspectRatio: `${TEMPLATES[template].width} / ${TEMPLATES[template].height}`,
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                borderRadius: "var(--mantine-radius-md)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                color: "white",
                textAlign: "center",
              }}
            >
              {product.primaryImageUrl && (
                <Box
                  component="img"
                  src={product.primaryImageUrl}
                  alt={product.name}
                  maw="80%"
                  mah="50%"
                  style={{ objectFit: "contain", borderRadius: "8px", marginBottom: "1rem" }}
                />
              )}
              <Text fw={700} size="xl">{product.name}</Text>
              <Text fw={600} size="lg" mt={4}>
                {settingsData?.currencySymbol ?? "$"} {product.priceSale.toLocaleString()}
              </Text>
              {product.description && (
                <Text size="sm" c="dimmed" mt={4} maw="80%">
                  {product.description.slice(0, 100)}
                </Text>
              )}
              {settingsData?.businessName && (
                <Text size="xs" mt={8} style={{ opacity: 0.7 }}>
                  {settingsData.businessName}
                </Text>
              )}
            </div>
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              Selecciona un producto para ver el preview
            </Text>
          )}
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
