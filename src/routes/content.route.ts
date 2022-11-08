import { default as express } from "express";
import { ContentController } from "../controllers/content.controller.js";
import { stringToBoolean } from "../utils/strings/stringToBool.js";

const router = express.Router();

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

router.get("/pages/:id/tree", async (req, res, next) => {
  return new ContentController()
    .getPageTree(
      Number(req.params.id),
      stringToBoolean(req.query.editmode as string),
      req.query.correlationId as string
    )
    .then((response) => res.status(response.status).send(response.body))
    .catch((error) => next(error));
});

router.get("/pages/:id/array", async (req, res, next) => {
  return new ContentController()
    .getPageTreeAsArray(
      Number(req.params.id),
      stringToBoolean(req.query.editmode as string),
      req.query.correlationId as string
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

router.get("/pages/:id", async (req, res, next) => {
  return new ContentController()
    .getPage(
      Number(req.params.id),
      stringToBoolean(req.query.editmode as string)
    )
    .then((response) => res.status(response.status).send(response.body))
    .catch((error) => next(error));
});

export { router as contentRouter };
