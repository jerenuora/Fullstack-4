const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
//   const user = {
//     username: 'a_username',
//     name: 'Jere',
//     password: 'password'
//   }
//   await api
//     .post('api/users')
//     .send(user)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)
//   const token = await api
//     .post('api/login')
//     .send(user)
//     .expect(200)
//     .expect('Content-Type', /application\/json/)

  await Blog.deleteMany({})
  //await Blog.insertMany(helper.initialBlogs)
})

describe('blog api:', () => {
  test('get returns correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blog identifier field is id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('a blog can be posted', async () => {
    const user = {
      username: 'a_username',
      name: 'Jere',
      password: 'password'
    }
    await api
      .post('/api/users')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const res = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const token = res.body.token
    const newBlog = {
      title: 'A new post',
      author: 'Jere',
      url: 'www.website.com'
    }
    await api
      .post('/api/blogs')
      .set('Authorization', "bearer" + token)

      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterPost = await api.get('/api/blogs')
    expect(blogsAfterPost.body).toHaveLength(helper.initialBlogs.length + 1)
    const blogTitles = blogsAfterPost.body.map(b => b.title)
    expect(blogTitles).toContain('A new post')
  })

  test('likes set to 0 if empty', async () => {
    await Blog.deleteMany({})
    const newBlog = {
      title: 'A new post',
      author: 'Jere',
      url: 'www.website.com'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogAfterPost = await api.get('/api/blogs')
    expect(blogAfterPost.body[0].likes).toEqual(0)

  })
  test('post returns 400 without title, url', async () => {
    const newBlog = {
      author: 'Jere'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

describe('users api: ', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('a-secret_pass', 10)
    const user = new User({ username: 'example_user', passwordHash })

    await user.save()
  })

  test('existing user is not created again', async () => {
    const oldUsers = await helper.usersInDb()

    const newOldUser = {
      username: 'example_user',
      name: 'James',
      password: 'whatever',
    }

    await api
      .post('/api/users')
      .send(newOldUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const newUsers = await helper.usersInDb()
    expect(oldUsers).toEqual(newUsers)
  })

  test('a new user is created', async () => {
    const oldUsers = await helper.usersInDb()

    const newUser = {
      username: 'aNewUser',
      name: 'James',
      password: 'something',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const newUsers = await helper.usersInDb()
    expect(newUsers).toHaveLength(oldUsers.length + 1)

    const usernames = newUsers.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('fails if password is inadequate', async () => {
    const oldUsers = await helper.usersInDb()

    const newUser = {
      username: 'aNewUser',
      name: 'James',
      password: '1',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const newUsers = await helper.usersInDb()
    expect(oldUsers).toEqual(newUsers)
  })
  test('fails if username is missing', async () => {
    const oldUsers = await helper.usersInDb()

    const newUser = {
      name: 'James',
      password: 'apassword1',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const newUsers = await helper.usersInDb()
    expect(oldUsers).toEqual(newUsers)
  })

})
afterAll(() => {
  mongoose.connection.close()
})