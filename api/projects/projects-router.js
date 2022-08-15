// Write your "projects" router here!
const express = require('express');

const Project = require('./projects-model');
const Action = require('../actions/actions-model');
             
const router = express.Router();

const {
    validateProjectId,
    validateProject,
} = require('./projects-middleware');

// - [ ] `[GET] /api/projects`
//   - Returns an array of projects as the body of the response.
//   - If there are no projects it responds with an empty array.

router.get('/', (req, res, next) => {
    Project.get()
        .then(projects => {
        res.json(projects)
        })
        .catch(next)
});

// - [ ] `[GET] /api/projects/:id`
//   - Returns a project with the given `id` as the body of the response.
//   - If there is no project with the given `id` it responds with a status code 404.

router.get('/:id', validateProjectId, (req, res) => {
    res.json(req.projects)
})

// - [ ] `[POST] /api/projects`
//   - Returns the newly created project as the body of the response.
//   - If the request body is missing any of the required fields it responds with a status code 400.

router.post('/', validateProject, (req, res, next) => {
    let projectAdded = req.body;
    Project.insert(projectAdded)
      .then(newProject => {
        res.status(201).json(newProject)
      })
      .catch(next)
  });

// - [ ] `[PUT] /api/projects/:id`
//   - Returns the updated project as the body of the response.
//   - If there is no project with the given `id` it responds with a status code 404.
//   - If the request body is missing any of the required fields it responds with a status code 400.

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const changes = req.body;
    console.log(changes.completed)
    try{
        if(!changes.name || !changes.description || typeof changes.completed != 'boolean'){
            res.status(400).json({ message: "Please provide name and description for the project" });
        }else{
            const updatedProject = await Project.get(id)
            if(!updatedProject){
                res.status(404).json({ message: "The project with the specified ID does not exist" });
            }else{
                await Project.update(id, changes)
                const updatedProject = await Project.get(id)
                res.status(200).json(updatedProject)
            }
        }
    }catch(err){
        res.status(500).json({ message: "The project information could not be modified" });
    }
})

// - [ ] `[DELETE] /api/projects/:id`
//   - Returns no response body.
//   - If there is no project with the given `id` it responds with a status code 404.

router.delete('/:id', validateProjectId, async (req, res) => {
    try {
      await Project.remove(req.params.id)
      res.json(req.user)
    } catch (err) {
      next(err)
    }
  });

// - [ ] `[GET] /api/projects/:id/actions`
//   - Returns an array of actions (could be empty) belonging to a project with the given `id`.
//   - If there is no project with the given `id` it responds with a status code 404.

router.get('/:id/actions', validateProjectId, async (req, res, next) => {
    try {
      const result = await Project.getProjectActions(req.params.id)
      res.json(result)
    } catch (err) {
      next(err)
    }
  });

module.exports = router;