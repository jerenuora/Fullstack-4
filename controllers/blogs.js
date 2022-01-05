const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)

  if (blog.title === undefined) {
    res.status(400).json('Title required')
  } else if (blog.url === undefined) {
    res.status(400).json('Url needed')
  }  else {
    const result  = await blog.save()
    res.status(201).json(result)}
})

module.exports = blogsRouter