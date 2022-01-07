const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})


blogsRouter.post('/', async (req, res) => {
  const body = req.body
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    url:body.url,
    title:body.title,
    author:body.author,
    user:user._id
  })

  if (blog.title === undefined) {
    res.status(400).json('Bad request')
  } else if (blog.url === undefined) {
    res.status(400).json('Bad request ')
  }  else {
    const result  = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    res.status(201).json(result)
  }
})

blogsRouter.delete('/:id', async (req,res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  const blog = await Blog.findById(req.params.id)
  if (!blog){
    return res.status(404).json({ error: 'no blog found' })
  }
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing' })
  }
  if ( blog.user.toString() === decodedToken.id.toString() ){
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } else {
    return res.status(401).json({ error: 'user not allowed' })
  }
})

blogsRouter.put('/:id', async (req,res) => {
  const body = req.body

  const blog = {
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id,blog)
  res.json(updatedBlog.toJSON())
})

module.exports = blogsRouter