import { useRef } from "react";
import {
  Stack,
  Text,
  Group,
  ActionIcon,
  Image,
  Paper,
} from "@mantine/core";
import { Upload, X, Star, StarOff } from "lucide-react";

import { notifications } from "@mantine/notifications";

const MAX_PRODUCT_IMAGES = 5;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ImageFile {
  id?: string;
  file?: File;
  preview: string;
  isPrimary: boolean;
  displayOrder: number;
}

interface ImageUploadProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  images,
  onChange,
  maxImages = MAX_PRODUCT_IMAGES,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      notifications.show({
        message: `Máximo ${maxImages} imágenes`,
        color: "yellow",
      });
      return;
    }

    const validFiles = Array.from(files).slice(0, remaining);
    const validImages: ImageFile[] = [];

    for (const file of validFiles) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        notifications.show({
          message: "Tipo de imagen inválido",
          color: "red",
        });
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        notifications.show({
          message: "Imagen demasiado grande (máx 5MB)",
          color: "red",
        });
        continue;
      }

      validImages.push({
        file,
        preview: URL.createObjectURL(file),
        isPrimary: images.length === 0 && validImages.length === 0,
        displayOrder: images.length + validImages.length,
      });
    }

    if (validImages.length > 0) {
      onChange([...images, ...validImages]);
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && updated[0] && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    updated.forEach((img, i) => {
      img.displayOrder = i;
    });
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(updated);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Stack gap="md">
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {images.length < maxImages && (
        <Paper
          p="xl"
          withBorder
          style={{ cursor: "pointer", borderStyle: "dashed" }}
          onClick={handleClick}
        >
          <Stack align="center" gap="xs">
            <Upload size={32} color="var(--mantine-color-dimmed)" />
            <Text size="sm" c="dimmed">
              Subir imágenes ({images.length}/{maxImages})
            </Text>
          </Stack>
        </Paper>
      )}

      <Group gap="md">
        {images.map((image, index) => (
          <Paper key={index} p={4} withBorder style={{ position: "relative" }}>
            <Image
              src={image.preview}
              width={120}
              height={120}
              fit="cover"
              radius="sm"
            />
            <Group
              gap={4}
              style={{ position: "absolute", top: 4, right: 4 }}
            >
              <ActionIcon
                size="xs"
                color={image.isPrimary ? "yellow" : "gray"}
                variant="filled"
                onClick={() => handleSetPrimary(index)}
              >
                {image.isPrimary ? <Star size={12} /> : <StarOff size={12} />}
              </ActionIcon>
              <ActionIcon
                size="xs"
                color="red"
                variant="filled"
                onClick={() => handleRemove(index)}
              >
                <X size={12} />
              </ActionIcon>
            </Group>
            {image.isPrimary && (
              <Text size="xs" ta="center" fw={600} c="yellow" mt={4}>
                Primary
              </Text>
            )}
          </Paper>
        ))}
      </Group>
    </Stack>
  );
}
