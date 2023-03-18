const express = require("express");
const Actions = require("./actions-model");
const router = express.Router();
const { validateActionId, checkAction } = require("./actions-middlware");
const { validateProjectId } = require("../projects/projects-middleware");

// [ ] `[GET] /api/actions`
// - Returns an array of actions (or an empty array) as the body of the response.

router.get("/", async (req, res, next) => {
  await Actions.get(req.params.id)
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch((err) => {
      next(err);
    });
});
// - [ ] `[GET] /api/actions/:id`
// - Returns an action with the given `id` as the body of the response.
// - If there is no action with the given `id` it responds with a status code 404.

router.get("/:id", validateActionId, async (req, res, next) => {
  try {
    const actions = await Actions.get(req.params.id);
    if (actions) {
      res.status(200).json(actions);
    } else {
      res.status(404);
    }
  } catch (err) {
    next(err);
  }
});
// - [ ] `[POST] /api/actions`
// - Returns the newly created action as the body of the response.
// - If the request body is missing any of the required fields it responds with a status code 400.
// - When adding an action make sure the `project_id` provided belongs to an existing `project`.

router.post("/", validateProjectId, checkAction, async (req, res, next) => {
  await Actions.insert(req.body)
    .then((action) => {
      res.status(201).json(action);
    })
    .catch((err) => {
      next(err);
    });
});

// - [ ] `[PUT] /api/actions/:id`
// - Returns the updated action as the body of the response.
// - If there is no action with the given `id` it responds with a status code 404.
// - If the request body is missing any of the required fields it responds with a status code 400.

router.put("/:id", validateActionId, checkAction, async (req, res, next) => {
  const updateAction = await Actions.update(req.params.id, req.body);
  try {
    res.status(201).json(updateAction);
  } catch (err) {
    next(err);
  }
});

// - [ ] `[DELETE] /api/actions/:id`
// - Returns no response body.
// - If there is no action with the given `id` it responds with a status code 404.

router.delete("/:id", validateActionId, async (req, res, next) => {
  await Actions.remove(req.params.id)
    .then((action) => {
      res.status(200).json(action);
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

// - `get()`: resolves to an array of all the resources contained in the database. If you pass an `id` to this method it will return the resource with that id if one is found.
// - `insert()`: calling insert passing it a resource object will add it to the database and return the newly created resource.
// - `update()`: accepts two arguments, the first is the `id` of the resource to update, and the second is an object with the `changes` to apply. It returns the updated resource. If a resource with the provided `id` is not found, the method returns `null`.
// - `remove()`: the remove method accepts an `id` as its first parameter and, upon successfully deleting the resource from the database, returns the number of records deleted.

// | Field       | Data Type | Metadata                                                                                         |
// | ----------- | --------- | ------------------------------------------------------------------------------------------------ |
// | id          | number    | do not provide it when creating actions, the database will generate it                           |
// | project_id  | number    | required, must be the id of an existing project                                                  |
// | description | string    | required, up to 128 characters long                                                              |
// | notes       | string    | required, no size limit. Used to record additional notes or requirements to complete the action  |
// | completed   | boolean   | not required, defaults to false when creating actions                                            |

module.exports = router;
