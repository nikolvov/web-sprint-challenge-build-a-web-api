// add middlewares here related to actions
const Action = require('./actions-model');

async function validateActionId(req, res, next) {
    try {
      const actions = await Action.get(req.params.id)
      if(!actions) {
        res.status(404).json( {message: 'action not found'} )
      }else{
        req.actions = actions
        next()
      }
    } catch (err) {
      res.status(500).json({message: 'problem finding action',})
    }
  }

  function validateAction(req, res, next) {
    const { project_id, description, notes } = req.body
    if (!project_id || !description || !notes || !description.trim() || !notes.trim()) {
      res.status(400).json({ message: 'Please provide project_id, description and notes for the action' })
    }else{
      req.project_id = project_id
      req.description = description.trim()
      req.notes = notes.trim()
      next()
    }
  }

  module.exports = {
    validateActionId,
    validateAction,
  }