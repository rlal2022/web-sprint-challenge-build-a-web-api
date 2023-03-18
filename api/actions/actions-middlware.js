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
  const { description, notes } = req.body;
  if (!description || (!description.trim() && !notes) || !notes.trim()) {
    res.status(400).json({ message: "missing required fields" });
  } else {
    next();
  }
}

module.exports = { validateActionId, checkAction };
