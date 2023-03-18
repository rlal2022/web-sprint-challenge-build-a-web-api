// add middlewares here related to actions
const Actions = require("./actions-model");

async function validateActionId(req, res, next) {
  await Actions.get(req.params.id)
    .then((action) => {
      if (action) {
        req.action = action;
        next();
      } else {
        res.status(404).json({ message: "Error action not found" });
      }
    })
    .catch((err) => {
      //   res.status(500).json({ message: "Error fetching actions" });
      next(err);
    });
}
async function checkAction(req, res, next) {
  const { project_id, description, notes } = req.body;
  if (
    !description ||
    !notes ||
    !project_id
    // !description ||
    // (!description.trim() && !notes) ||
    // (!notes.trim() && !project_id)
  ) {
    res.status(400).json({ message: "missing required fields" });
  } else {
    next();
  }
}

async function checkProject(req, res, next) {
  const { project_id } = req.body;
  try {
    const project = await project.get(project_id);
    if (!project) {
      res.status(404).json({ message: "Error, project not found!" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { validateActionId, checkAction, checkProject };
