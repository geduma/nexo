import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NEXO API",
      version: "1.0.0",
      description: "NEXO Commercial Management Platform API",
    },
    servers: [
      {
        url: "http://localhost:3001/api/v1",
        description: "Development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.resolve(__dirname, "../routes/*.ts"), path.resolve(__dirname, "../routes/*.js")],
};

export const swaggerSpec = swaggerJsdoc(options);
