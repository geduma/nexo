import { Group, Text, Anchor } from "@mantine/core";

export function Footer() {
  return (
    <Group h="100%" px="md" justify="center">
      <Text size="xs" c="dimmed">
        NEXO v0.1.0 - Commercial Management Platform · by{" "}
        <Anchor href="https://geduma.com/" target="_blank" c="dimmed" inherit>
          geduma
        </Anchor>
      </Text>
    </Group>
  );
}
