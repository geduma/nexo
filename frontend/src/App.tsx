import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingSkeleton } from "./components/common/loading-skeleton";
import { PrivateRoute } from "./routes/private-route";

const AdminLayout = lazy(() => import("./layouts/admin-layout").then(m => ({ default: m.AdminLayout })));
const PublicLayout = lazy(() => import("./layouts/public-layout").then(m => ({ default: m.PublicLayout })));
const LoginPage = lazy(() => import("./features/auth/pages/login").then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("./features/dashboard/pages/dashboard").then(m => ({ default: m.DashboardPage })));
const ProductListPage = lazy(() => import("./features/products/pages/product-list").then(m => ({ default: m.ProductListPage })));
const ProductCreatePage = lazy(() => import("./features/products/pages/product-create").then(m => ({ default: m.ProductCreatePage })));
const ProductEditPage = lazy(() => import("./features/products/pages/product-edit").then(m => ({ default: m.ProductEditPage })));
const CategoryListPage = lazy(() => import("./features/categories/pages/category-list").then(m => ({ default: m.CategoryListPage })));
const CategoryCreatePage = lazy(() => import("./features/categories/pages/category-create").then(m => ({ default: m.CategoryCreatePage })));
const CategoryEditPage = lazy(() => import("./features/categories/pages/category-edit").then(m => ({ default: m.CategoryEditPage })));
const SaleListPage = lazy(() => import("./features/sales/pages/sale-list").then(m => ({ default: m.SaleListPage })));
const SaleCreatePage = lazy(() => import("./features/sales/pages/sale-create").then(m => ({ default: m.SaleCreatePage })));
const SaleEditPage = lazy(() => import("./features/sales/pages/sale-edit").then(m => ({ default: m.SaleEditPage })));
const ReportsPage = lazy(() => import("./features/reports/pages/reports").then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import("./features/settings/pages/settings").then(m => ({ default: m.SettingsPage })));
const SocialGeneratorPage = lazy(() => import("./features/social/pages/social-generator").then(m => ({ default: m.SocialGeneratorPage })));
const CatalogHomePage = lazy(() => import("./features/catalog/pages/catalog-home").then(m => ({ default: m.CatalogHomePage })));
const CatalogProductPage = lazy(() => import("./features/catalog/pages/catalog-product").then(m => ({ default: m.CatalogProductPage })));
const NotFoundPage = lazy(() => import("./pages/not-found").then(m => ({ default: m.NotFoundPage })));
const UnauthorizedPage = lazy(() => import("./pages/unauthorized").then(m => ({ default: m.UnauthorizedPage })));

export default function App() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<CatalogHomePage />} />
          <Route path="/product/:id" element={<CatalogProductPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/create" element={<ProductCreatePage />} />
            <Route path="/products/:id/edit" element={<ProductEditPage />} />
            <Route path="/categories" element={<CategoryListPage />} />
            <Route path="/categories/create" element={<CategoryCreatePage />} />
            <Route path="/categories/:id/edit" element={<CategoryEditPage />} />
            <Route path="/sales" element={<SaleListPage />} />
            <Route path="/sales/create" element={<SaleCreatePage />} />
            <Route path="/sales/:id/edit" element={<SaleEditPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/social" element={<SocialGeneratorPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
