import { useState, useRef, useMemo, useEffect } from "react";
import {
  Stack,
  Title,
  Select,
  Button,
  Group,
  Switch,
  ColorInput,
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

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16) || 0,
    g: parseInt(h.substring(2, 4), 16) || 0,
    b: parseInt(h.substring(4, 6), 16) || 0,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const clamp = (v: number) => Math.min(255, Math.max(0, v));
  return `#${[clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function generateGradient(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const mid = rgbToHex(Math.round(r * 0.7), Math.round(g * 0.7), Math.round(b * 0.7));
  const end = rgbToHex(Math.round(r * 0.45), Math.round(g * 0.45), Math.round(b * 0.45));
  return { start: hex, mid, end };
}

async function extractColorFromImage(url: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 50;
      canvas.height = 50;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve("#1a1a2e"); return; }
      ctx.drawImage(img, 0, 0, 50, 50);
      const imageData = ctx.getImageData(0, 0, 50, 50).data;
      const buckets = new Map<string, number>();
      for (let i = 0; i < imageData.length; i += 16) {
        const r = imageData[i] as number;
        const g = imageData[i + 1] as number;
        const b = imageData[i + 2] as number;
        const a = imageData[i + 3] as number;
        if (a < 128) continue;
        const key = `${Math.round(r / 32) * 32},${Math.round(g / 32) * 32},${Math.round(b / 32) * 32}`;
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }
      if (buckets.size === 0) { resolve("#1a1a2e"); return; }
      const top = [...buckets.entries()].sort((a, b) => b[1] - a[1])[0]![0]!;
      const [r, g, b] = top.split(",").map(Number);
      resolve(rgbToHex(r!, g!, b!));
    };
    img.onerror = () => resolve("#1a1a2e");
    img.src = url;
  });
}

export function SocialGeneratorPage() {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateType>("square");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showPrice, setShowPrice] = useState(true);
  const [baseColor, setBaseColor] = useState("#1a1a2e");
  const previewRef = useRef<HTMLDivElement>(null);

  const gradient = useMemo(() => generateGradient(baseColor), [baseColor]);

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

  useEffect(() => {
    const url = product?.primaryImageUrl;
    if (!url) return;
    let cancelled = false;
    extractColorFromImage(url).then((color) => {
      if (!cancelled) setBaseColor(color);
    });
    return () => { cancelled = true; };
  }, [product?.primaryImageUrl]);

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
    if (showPrice) {
      text += `${symbol} ${product.priceSale.toLocaleString()}\n\n`;
    }
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
    setDownloading(true);
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
    } finally {
      setDownloading(false);
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

            <ColorInput
              label="Color"
              value={baseColor}
              onChange={setBaseColor}
              size="xs"
            />

            <Switch
              label="Mostrar precio"
              checked={showPrice}
              onChange={(e) => setShowPrice(e.currentTarget.checked)}
              size="sm"
            />

            <Group>
              <Button
                leftSection={<Download size={16} />}
                onClick={handleDownload}
                disabled={!product || downloading}
                loading={downloading}
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
                background: `linear-gradient(135deg, ${gradient.start} 0%, ${gradient.mid} 50%, ${gradient.end} 100%)`,
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
              {showPrice && (
                <Text fw={600} size="lg" mt={4}>
                  {settingsData?.currencySymbol ?? "$"} {product.priceSale.toLocaleString()}
                </Text>
              )}
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
