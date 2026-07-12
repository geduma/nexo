import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
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

app.use(helmet());
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

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
