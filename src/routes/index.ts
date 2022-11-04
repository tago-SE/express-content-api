import express, { Router } from "express";
import PingController from "../controllers/ping";
import ContentRoute from "./content.route";

export interface ResourceRoute {
  readonly router: Router;
  readonly resource: string;
}

const router = express.Router();

// TODO: Replace with healthcheck showing latest update etc...
router.get("/ping", async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

router.use("/content", ContentRoute);

export default router;
