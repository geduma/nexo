import {
  Modal,
  Stack,
  Text,
  Group,
  Button,
} from "@mantine/core";
import { useTranslation } from "react-i18next";

interface ConfirmDialogProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  opened,
  onClose,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  loading = false,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal opened={opened} onClose={onClose} title={title} padding="lg" radius="md" withCloseButton={false}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {message}
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={onCancel} disabled={loading}>
            {cancelLabel ?? t("common.cancel")}
          </Button>
          <Button color="red" onClick={onConfirm} loading={loading}>
            {confirmLabel ?? t("common.confirm")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
