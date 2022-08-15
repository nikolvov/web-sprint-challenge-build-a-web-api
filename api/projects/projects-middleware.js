// add middlewares here related to projects
const Project = require('../projects/projects-model');

async function validateProjectId(req, res, next) {
    try {
      const projects = await Project.get(req.params.id)
      if(!projects) {
        res.status(404).json( {message: 'project not found'} )
      }else{
        req.projects = projects
        next()
      }
    } catch (err) {
      res.status(500).json({message: 'problem finding project',})
    }
  }

function validateProject(req, res, next) {
    const { name, description } = req.body
    if (!name || !description || !name.trim() || !description.trim()) {
      res.status(400).json({ message: 'Please provide name and description for the project' })
    }else{
      req.name = name.trim()
      req.description = description.trim()
      next()
    }
  }

  module.exports = {
    validateProjectId,
    validateProject,
  }