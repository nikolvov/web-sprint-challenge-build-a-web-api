// Write your "actions" router here!
const express = require('express');

const Action = require('./actions-model');
const Project = require('../projects/projects-model');

const router = express.Router();

const {
    validateActionId,
    validateAction,
    // checkDescLength,
} = require('./actions-middlware');

// - [ ] `[GET] /api/actions`
//   - Returns an array of actions (or an empty array) as the body of the response.

router.get('/', (req, res, next) => {
    Action.get()
        .then(actions => {
        res.json(actions)
        })
        .catch(next)
});

// - [ ] `[GET] /api/actions/:id`
//   - Returns an action with the given `id` as the body of the response.
//   - If there is no action with the given `id` it responds with a status code 404.

router.get('/:id', validateActionId, (req, res) => {
    res.json(req.actions)
})

// - [ ] `[POST] /api/actions`
//   - Returns the newly created action as the body of the response.
//   - If the request body is missing any of the required fields it responds with a status code 400.
//   - When adding an action make sure the `project_id` provided belongs to an existing `project`.

router.post('/', validateAction, (req, res, next) => {
    Action.insert({ project_id: req.project_id, description: req.description, notes: req.notes})
      .then(newAction => {
        res.status(201).json(newAction)
      })
      .catch(next)
  });

// - [ ] `[PUT] /api/actions/:id`
//   - Returns the updated action as the body of the response.
//   - If there is no action with the given `id` it responds with a status code 404.
//   - If the request body is missing any of the required fields it responds with a status code 400.

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const changes = req.body;
    try{
        if(!changes.project_id || !changes.description || !changes.notes){
            res.status(400).json({ message: "Please provide project_id, description and notes for the action" });
        }else{
            const updatedAction = await Action.get(id)
            if(!updatedAction){
                res.status(404).json({ message: "The action with the specified ID does not exist" });
            }else{
                await Action.update(id, changes)
                const updatedAction = await Action.get(id)
                res.status(200).json(updatedAction)
            }
        }
    }catch(err){
        res.status(500).json({ message: "The action information could not be modified" });
    }
})

// - [ ] `[DELETE] /api/actions/:id`
//   - Returns no response body.
//   - If there is no action with the given `id` it responds with a status code 404.

router.delete('/:id', validateActionId, async (req, res) => {
    try {
      await Action.remove(req.params.id)
      res.json(req.user)
    } catch (err) {
      next(err)
    }
  });

module.exports = router;