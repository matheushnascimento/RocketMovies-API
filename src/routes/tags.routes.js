const { Router } = require("express");

const TagsController = require("../controllers/TagsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const tagsController = new TagsController();
const tagsRoutes = Router();

tagsRoutes.use(ensureAuthenticated);

tagsRoutes.get("/", tagsController.index);

module.exports = tagsRoutes;
