import express, { Application } from "express";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import swaggerUi from "swagger-ui-express";
import Router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(express.json());
app.use(loggerMiddleware);

app.use(express.static("public"));
app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);
app.use(Router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
