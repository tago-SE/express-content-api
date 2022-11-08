import { default as express, Application } from "express";
import { default as swaggerUi } from "swagger-ui-express";
import { router } from "./routes/index.js";
import {
  loggerMiddleware,
  errorHandlerMiddleware,
  appendCorrelationIdMiddleware,
} from "./middlewares/index.js";

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(express.json());
app.use(appendCorrelationIdMiddleware);
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
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
