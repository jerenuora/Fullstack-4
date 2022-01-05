const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)

  if (blog.title === undefined) {
    res.status(400).json('Bad request')
  } else if (blog.url === undefined) {
    res.status(400).json('Bad request ')
  }  else {
    const result  = await blog.save()
    res.status(201).json(result)}
})

blogsRouter.delete('/:id', async (req,res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})



module.exports = blogsRouter