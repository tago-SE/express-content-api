import { default as express } from "express";
import { ContentController } from "../controllers/content.controller.js";
import { stringToBoolean } from "../utils/strings/stringToBool.js";

const router = express.Router();

router.get("/pages", async (req, res, next) => {
  return new ContentController()
    .allPages(stringToBoolean(req.query.editmode as string))
    .then((response) => res.status(response.status).send(response.body))
    .catch((error) => next(error));
});

router.get("/pages/start", async (req, res, next) => {
  return new ContentController()
    .allPagesAsTree(stringToBoolean(req.query.editmode as string))
    .then((response) => res.status(response.status).send(response.body))
    .catch((error) => next(error));
});

router.get("/pages/tree", async (req, res, next) => {
  return new ContentController()
    .allPagesAsTree(stringToBoolean(req.query.editmode as string))
    .then((response) => res.status(response.status).send(response.body))
    .catch((error) => next(error));
});

router.get("/sites", async (req, res, next) => {
  return new ContentController()
    .getWebsites()
    .then((response) => res.status(response.status).send(response.body))
    .catch((error) => next(error));
});

router.get("/:id", (req, res, next) => {
  return new ContentController()
    .getContent(
      Number(req.params.id),
      stringToBoolean(req.query.editmode as string)
    )
    .then((response) => res.status(response.status).send(response.body))
    .catch((error) => next(error));
});

router.get("/:id/children", async (req, res, next) => {
  return new ContentController()
    .getContentChildren(
      Number(req.params.id),
      stringToBoolean(req.query.editmode as string)
    )
    .then((response) => res.status(response.status).send(response.body))
    .catch((error) => next(error));
});

router.get("/pages/:id", async (req, res, next) => {
  return new ContentController()
    .getPage(
      Number(req.params.id),
      stringToBoolean(req.query.editmode as string)
    )
    .then((response) => res.status(response.status).send(response.body))
    .catch((error) => next(error));
});

router.get("/pages/:id/children", async (req, res, next) => {
  const controller = new ContentController();
  const response = await controller.getPageChildren(
    Number(req.params.id),
    stringToBoolean(req.query.editmode as string)
  );
  return res.send(response);
});

export { router as contentRouter };
