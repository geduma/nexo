import { NavLink } from "react-router-dom";
import { Stack, Text, UnstyledButton, Group } from "@mantine/core";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  ChartBar,
  Settings,
  Share2,
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores/auth.store";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" },
  { to: "/categories", icon: Tag, labelKey: "nav.categories" },
  { to: "/products", icon: Package, labelKey: "nav.products" },
  { to: "/sales", icon: ShoppingCart, labelKey: "nav.sales" },
  { to: "/reports", icon: ChartBar, labelKey: "nav.reports" },
  { to: "/social", icon: Share2, labelKey: "nav.social" },
  { to: "/settings", icon: Settings, labelKey: "nav.settings" },
];

export function Sidebar() {
  const { t } = useTranslation();
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav aria-label="Main navigation">
      <Stack p="md" gap="xs">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={t(item.labelKey)}
            style={({ isActive }) => ({
              display: "block",
              borderRadius: "var(--mantine-radius-lg)",
              backgroundColor: isActive ? "var(--mantine-color-blue-light)" : "transparent",
              color: isActive ? "var(--mantine-color-blue-6)" : "var(--mantine-color-dimmed)",
              textDecoration: "none",
              padding: "var(--mantine-spacing-sm)",
              transition: "background-color 150ms, color 150ms",
            })}
          >
            <Group gap="sm">
              <item.icon size={20} aria-hidden="true" />
              <Text size="sm" fw={500}>{t(item.labelKey)}</Text>
            </Group>
          </NavLink>
        ))}

        <UnstyledButton
          p="sm"
          onClick={logout}
          aria-label={t("auth.logout")}
          style={{ borderRadius: "var(--mantine-radius-lg)", color: "var(--mantine-color-red-6)" }}
        >
          <Group gap="sm">
            <LogOut size={20} aria-hidden="true" />
            <Text size="sm" fw={500}>{t("auth.logout")}</Text>
          </Group>
        </UnstyledButton>
      </Stack>
    </nav>
  );
}
