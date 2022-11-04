import express from "express";
import ContentController from "../controllers/content.controller";
const router = express.Router();

router.get("/:id", (req, res, next) => {
  return new ContentController()
    .getContent(Number(req.params.id))
    .then((response) => res.status(response.status).send(response.body))
    .catch((error) => next(error));
});

router.get("/:id/children", async (req, res, next) => {
  return new ContentController()
    .getContentChildren(Number(req.params.id))
    .then((response) => res.status(response.status).send(response.body))
    .catch((error) => next(error));
});

router.get("/pages", async (req, res, next) => {
  return new ContentController()
    .allPages()
    .then((response) => res.status(response.status).send(response.body))
    .catch((error) => next(error));
});

router.get("/pages/tree", async (req, res, next) => {
  return new ContentController()
    .allPagesAsTree()
    .then((response) => res.status(response.status).send(response.body))
    .catch((error) => next(error));
});

router.get("/pages/:id", async (req, res, next) => {
  const controller = new ContentController();
  const response = await controller.getPage(Number(req.params.id));
  return res.send(response);
});

router.get("/pages/:id/children", async (req, res, next) => {
  const controller = new ContentController();
  const response = await controller.getPageChildren(Number(req.params.id));
  return res.send(response);
});

export default router;
