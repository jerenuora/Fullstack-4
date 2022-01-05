const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})


test('get returns correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog identifier field is id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('a blog can be posted', async () => {
    const newBlog = {
        title: 'A new post',
        author: 'Jere'
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAfterPost = await api.get('/api/blogs')
    expect(blogsAfterPost.body).toHaveLength(helper.initialBlogs.length + 1)
    const blogTitles = blogsAfterPost.body.map(b => b.title)
    expect(blogTitles).toContain('A new post')
})


afterAll(() => {
    mongoose.connection.close()
})