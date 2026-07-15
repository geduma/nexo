import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { corsOptions } from "./config/cors.js";
import { requestLogger } from "./middleware/request-logger.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { requireDatabase } from "./middleware/require-database.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { healthRoutes } from "./routes/health.routes.js";
import { categoryRoutes } from "./routes/category.routes.js";
import { productRoutes } from "./routes/product.routes.js";
import { imageRoutes } from "./routes/image.routes.js";
import { saleRoutes } from "./routes/sale.routes.js";
import { reportRoutes } from "./routes/report.routes.js";
import { settingsRoutes } from "./routes/settings.routes.js";
import { authRoutes } from "./routes/auth.routes.js";

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "https://sagdjdbcktnxzcogtrcl.supabase.co"],
      connectSrc: ["'self'", "https://sagdjdbcktnxzcogtrcl.supabase.co"],
    },
  },
}));
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/categories", requireDatabase, categoryRoutes);
app.use("/api/v1/products", requireDatabase, productRoutes);
app.use("/api/v1/products", requireDatabase, imageRoutes);
app.use("/api/v1/sales", requireDatabase, saleRoutes);
app.use("/api/v1/reports", requireDatabase, reportRoutes);
app.use("/api/v1/settings", requireDatabase, settingsRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const frontendDist = path.resolve(__dirname, "../../frontend/dist");
app.use(express.static(frontendDist));

app.get(/^\/(?!api\/).*/, (_req, res) => {
  const indexHtml = path.join(frontendDist, "index.html");
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.status(503).json({ success: false, message: "Frontend not built. Run 'npm run build' in frontend/ first." });
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
