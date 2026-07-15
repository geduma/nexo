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
} from "@mantine/core";
import { Download, Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toPng } from "html-to-image";
import { apiClient } from "../../../services/api/client";

interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

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
type LayoutType = "single" | "mosaic";
type ImageSize = "small" | "medium" | "large";

const TEMPLATES: Record<TemplateType, { i18nKey: string; width: number; height: number }> = {
  square: { i18nKey: "social.templateSquare", width: 1080, height: 1080 },
  story: { i18nKey: "social.templateStory", width: 1080, height: 1920 },
  landscape: { i18nKey: "social.templateLandscape", width: 1200, height: 628 },
};

const IMAGE_SIZES: Record<ImageSize, { label: string; maw: string; mah: string }> = {
  small: { label: "Pequeña", maw: "50%", mah: "30%" },
  medium: { label: "Mediana", maw: "70%", mah: "45%" },
  large: { label: "Grande", maw: "90%", mah: "60%" },
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
  const [layout, setLayout] = useState<LayoutType>("single");
  const [imageSize, setImageSize] = useState<ImageSize>("medium");
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

  const { data: productImages } = useQuery<ProductImage[]>({
    queryKey: ["product-images", selectedProduct],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${selectedProduct}/images`);
      return response.data.data;
    },
    enabled: !!selectedProduct && layout === "mosaic",
  });

  const allImages = useMemo(() => {
    if (!Array.isArray(productImages) || productImages.length === 0) return [];
    return [...productImages].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [productImages]);

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
    label: t(val.i18nKey),
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
              label={t("social.template")}
              data={templateOptions}
              value={template}
              onChange={(v) => v && setTemplate(v as TemplateType)}
            />

            <Select
              label={t("social.layout")}
              data={[
                { value: "single", label: t("social.layoutSingle") },
                { value: "mosaic", label: t("social.layoutMosaic") },
              ]}
              value={layout}
              onChange={(v) => v && setLayout(v as LayoutType)}
            />

            {layout === "single" && (
              <Select
                label={t("social.imageSize")}
                data={[
                  { value: "small", label: t("social.sizeSmall") },
                  { value: "medium", label: t("social.sizeMedium") },
                  { value: "large", label: t("social.sizeLarge") },
                ]}
                value={imageSize}
                onChange={(v) => v && setImageSize(v as ImageSize)}
              />
            )}

            <ColorInput
              label={t("social.color")}
              value={baseColor}
              onChange={setBaseColor}
            />

            <Switch
              label={t("social.showPrice")}
              checked={showPrice}
              onChange={(e) => setShowPrice(e.currentTarget.checked)}
            />

            <Group>
              <Button
                leftSection={<Download size={16} />}
                onClick={handleDownload}
                disabled={!product || downloading}
                loading={downloading}
              >
                {t("social.downloadPng")}
              </Button>
              <Button
                variant="light"
                leftSection={copied ? <Check size={16} /> : <Copy size={16} />}
                onClick={handleCopyText}
                disabled={!product}
              >
                {copied ? t("social.copied") : t("social.copyText")}
              </Button>
            </Group>
          </Stack>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Title order={5} mb="md">{t("social.preview")}</Title>
          {product ? (
            <div
              ref={previewRef}
              style={{
                width: "100%",
                aspectRatio: `${TEMPLATES[template].width} / ${TEMPLATES[template].height}`,
                background: `linear-gradient(135deg, ${gradient.start} 0%, ${gradient.mid} 50%, ${gradient.end} 100%)`,
                borderRadius: "var(--mantine-radius-md)",
                overflow: "hidden",
                display: "grid",
                gridTemplateRows: "1fr auto",
                padding: template === "landscape" ? "1rem" : "1.5rem",
                boxSizing: "border-box",
                color: "white",
                textAlign: "center",
                gap: "0.5rem",
              }}
            >
              {layout === "single" ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {product.primaryImageUrl && (
                    <img
                      src={product.primaryImageUrl}
                      alt={product.name}
                      style={{ objectFit: "contain", borderRadius: "8px", maxWidth: IMAGE_SIZES[imageSize].maw, maxHeight: IMAGE_SIZES[imageSize].mah }}
                    />
                  )}
                </div>
              ) : (
                (() => {
                  const count = allImages.length;
                  const g = "8px";
                  const rad = "8px";
                  const imgStyle: React.CSSProperties = { objectFit: "cover", borderRadius: rad, width: "100%", height: "100%" };
                  const cellStyle: React.CSSProperties = { overflow: "hidden", borderRadius: rad };
                  const isWide = template === "landscape";
                  const isTall = template === "story";

                  if (count === 0) return null;

                  if (count === 1) {
                    return (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: `0 ${g}` }}>
                        <img src={allImages[0]!.imageUrl} alt="" style={{ ...imgStyle, maxWidth: "100%", maxHeight: "100%" }} />
                      </div>
                    );
                  }

                  if (count === 2) {
                    if (isWide) {
                      return (
                        <div style={{ display: "flex", gap: g, overflow: "hidden" }}>
                          <div style={{ ...cellStyle, flex: 1 }}><img src={allImages[0]!.imageUrl} alt="" style={imgStyle} /></div>
                          <div style={{ ...cellStyle, flex: 1 }}><img src={allImages[1]!.imageUrl} alt="" style={imgStyle} /></div>
                        </div>
                      );
                    }
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: g, overflow: "hidden" }}>
                        <div style={{ ...cellStyle, flex: 1 }}><img src={allImages[0]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={{ ...cellStyle, flex: 1 }}><img src={allImages[1]!.imageUrl} alt="" style={imgStyle} /></div>
                      </div>
                    );
                  }

                  if (count === 3) {
                    if (isWide) {
                      return (
                        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gridTemplateRows: "1fr 1fr", gap: g, overflow: "hidden" }}>
                          <div style={{ ...cellStyle, gridRow: "1 / 3" }}><img src={allImages[0]!.imageUrl} alt="" style={imgStyle} /></div>
                          <div style={cellStyle}><img src={allImages[1]!.imageUrl} alt="" style={imgStyle} /></div>
                          <div style={cellStyle}><img src={allImages[2]!.imageUrl} alt="" style={imgStyle} /></div>
                        </div>
                      );
                    }
                    return (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1.5fr 1fr", gap: g, overflow: "hidden" }}>
                        <div style={{ ...cellStyle, gridColumn: "1 / 3" }}><img src={allImages[0]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={cellStyle}><img src={allImages[1]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={cellStyle}><img src={allImages[2]!.imageUrl} alt="" style={imgStyle} /></div>
                      </div>
                    );
                  }

                  if (count === 4) {
                    if (isWide) {
                      return (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "1fr 1fr", gap: g, overflow: "hidden" }}>
                          <div style={{ ...cellStyle, gridColumn: "1 / 3", gridRow: "1 / 3" }}><img src={allImages[0]!.imageUrl} alt="" style={imgStyle} /></div>
                          <div style={cellStyle}><img src={allImages[1]!.imageUrl} alt="" style={imgStyle} /></div>
                          <div style={cellStyle}><img src={allImages[2]!.imageUrl} alt="" style={imgStyle} /></div>
                          <div style={{ ...cellStyle, gridColumn: "2 / 5" }}><img src={allImages[3]!.imageUrl} alt="" style={imgStyle} /></div>
                        </div>
                      );
                    }
                    if (isTall) {
                      return (
                        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gridTemplateRows: "1fr 1fr 1fr", gap: g, overflow: "hidden" }}>
                          <div style={{ ...cellStyle, gridRow: "1 / 3" }}><img src={allImages[0]!.imageUrl} alt="" style={imgStyle} /></div>
                          <div style={cellStyle}><img src={allImages[1]!.imageUrl} alt="" style={imgStyle} /></div>
                          <div style={cellStyle}><img src={allImages[2]!.imageUrl} alt="" style={imgStyle} /></div>
                          <div style={{ ...cellStyle, gridColumn: "1 / 3" }}><img src={allImages[3]!.imageUrl} alt="" style={imgStyle} /></div>
                        </div>
                      );
                    }
                    return (
                      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gridTemplateRows: "1fr 1fr", gap: g, overflow: "hidden" }}>
                        <div style={{ ...cellStyle, gridRow: "1 / 3" }}><img src={allImages[0]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={cellStyle}><img src={allImages[1]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={cellStyle}><img src={allImages[2]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={{ ...cellStyle, gridColumn: "1 / 3" }}><img src={allImages[3]!.imageUrl} alt="" style={imgStyle} /></div>
                      </div>
                    );
                  }

                  if (isWide) {
                    return (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "1fr 1fr", gap: g, overflow: "hidden" }}>
                        <div style={{ ...cellStyle, gridColumn: "1 / 3", gridRow: "1 / 3" }}><img src={allImages[0]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={cellStyle}><img src={allImages[1]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={cellStyle}><img src={allImages[2]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={cellStyle}><img src={allImages[3]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={cellStyle}><img src={allImages[4]!.imageUrl} alt="" style={imgStyle} /></div>
                      </div>
                    );
                  }
                  if (isTall) {
                    return (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1.2fr 1fr 1fr", gap: g, overflow: "hidden" }}>
                        <div style={{ ...cellStyle, gridColumn: "1 / 3" }}><img src={allImages[0]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={cellStyle}><img src={allImages[1]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={cellStyle}><img src={allImages[2]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={cellStyle}><img src={allImages[3]!.imageUrl} alt="" style={imgStyle} /></div>
                        <div style={cellStyle}><img src={allImages[4]!.imageUrl} alt="" style={imgStyle} /></div>
                      </div>
                    );
                  }
                  return (
                    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gridTemplateRows: "1fr 1fr 1fr", gap: g, overflow: "hidden" }}>
                      <div style={{ ...cellStyle, gridRow: "1 / 3" }}><img src={allImages[0]!.imageUrl} alt="" style={imgStyle} /></div>
                      <div style={cellStyle}><img src={allImages[1]!.imageUrl} alt="" style={imgStyle} /></div>
                      <div style={cellStyle}><img src={allImages[2]!.imageUrl} alt="" style={imgStyle} /></div>
                      <div style={cellStyle}><img src={allImages[3]!.imageUrl} alt="" style={imgStyle} /></div>
                      <div style={cellStyle}><img src={allImages[4]!.imageUrl} alt="" style={imgStyle} /></div>
                    </div>
                  );
                })()
              )}

              <div>
                <Text fw={700} size="xl">{product.name}</Text>
                {showPrice && (
                  <Text fw={600} size="lg" mt={4}>
                    {settingsData?.currencySymbol ?? "$"} {product.priceSale.toLocaleString()}
                  </Text>
                )}
                {product.description && (
                  <Text size="sm" style={{ opacity: 0.8 }} mt={4} maw="80%" mx="auto">
                    {product.description.slice(0, 100)}
                  </Text>
                )}
              </div>
            </div>
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              {t("social.selectProduct")}
            </Text>
          )}
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
