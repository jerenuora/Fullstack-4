const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
    const body = req.body

    const saltRounds = 10
    if (body.password.length < 3) {
        return res.status(400).json({ error: 'invalid password' })
    }
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const savedUser = await user.save()

    res.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users.map(u => u.toJSON()))
})


module.exports = usersRouter
