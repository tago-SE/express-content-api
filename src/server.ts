import { default as express, Application } from "express";
import { default as swaggerUi } from "swagger-ui-express";
import { router } from "./routes/index.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";

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
app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
