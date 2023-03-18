// add middlewares here related to projects

const Projects = require("./projects-model");

function logger(req, res, next) {
  console.log({
    time: new Date().toLocaleString(),
    method: req.method,
    url: req.originalUrl,
  });
  next();
}

async function validateProjectId(req, res, next) {
  await Projects.get(req.params.id)
    .then((project) => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(404).json({ message: "Error project not found" });
      }
    })
    .catch((err) => {
      next(err);
    });
}

async function checkProject(req, res, next) {
  const { name, description, completed } = req.body;
  if (
    name !== undefined &&
    typeof name === "string" &&
    name.length &&
    name.trim().length &&
    description !== undefined &&
    description.length &&
    description.trim().length &&
    completed !== undefined
  ) {
    next();
  } else {
    res.status(400).json({ message: "missing required fields" });
  }
}

module.exports = { logger, validateProjectId, checkProject };
