const express = require("express");
const Projects = require("./projects-model");
const router = express.Router();
const { validateProjectId, checkProject } = require("./projects-middleware");

// [ ] `[GET] /api/projects`
// - Returns an array of projects as the body of the response.
// - If there are no projects it responds with an empty array.

router.get("/", async (req, res, next) => {
  // await Projects.get()
  //   .then((project) => {
  //     if (!project) {
  //       res.status(500);
  //       res.send([]);
  //     } else {
  //       res.status(200).json(project);
  //       next();
  //     }
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });

  await Projects.get()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((err) => {
      next(err);
    });
});

// - [ ] `[GET] /api/projects/:id`
// - Returns a project with the given `id` as the body of the response.
// - If there is no project with the given `id` it responds with a status code 404.

router.get("/:id", validateProjectId, async (req, res, next) => {
  try {
    res.status(200).json(req.project);
    next();
  } catch (err) {
    res.status(404).json({ message: "We ran into an error!" });
  }
});
// - [ ] `[POST] /api/projects`
// - Returns the newly created project as the body of the response.
// - If the request body is missing any of the required fields it responds with a status code 400.
router.post("/", checkProject, async (req, res, next) => {
  await Projects.insert(req.body)
    .then((projects) => {
      res.status(201).json(projects);
    })
    .catch((err) => {
      next(err);
    });
});

// - [ ] `[PUT] /api/projects/:id`
// - Returns the updated project as the body of the response.
// - If there is no project with the given `id` it responds with a status code 404.
// - If the request body is missing any of the required fields it responds with a status code 400.
router.put("/:id", validateProjectId, checkProject, async (req, res, next) => {
  try {
    const updateProject = await Projects.update(req.params.id, req.body);
    res.status(201).json(updateProject);
  } catch (err) {
    next(err);
  }
});
// - [ ] `[DELETE] /api/projects/:id`
// - Returns no response body.
// - If there is no project with the given `id` it responds with a status code 404.
router.delete("/:id", validateProjectId, async (req, res, next) => {
  await Projects.remove(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      next(err);
    });
});
// - [ ] `[GET] /api/projects/:id/actions`
// - Returns an array of actions (could be empty) belonging to a project with the given `id`.
// - If there is no project with the given `id` it responds with a status code 404.

router.get("/:id/actions", validateProjectId, async (req, res, next) => {
  await Projects.getProjectActions(req.params.id)
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch((err) => {
      next(err);
    });
});

router.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message, customMessage: "We ran into an error!" });
});

module.exports = router;
