const express = require('express')
const Joi = require('joi')
const app = express()
app.use(express.json())

const courses = [
    { id: 1, name: 'Mongo' },
    { id: 2, name: 'Express' },
    { id: 3, name: 'React' },
    { id: 4, name: 'Node' }
]

const validateCourse = course => (
    Joi.validate(course, {
        name: Joi.string().min(3).required()
    })
)

app.get('/api/courses', (_, res) => {
    res.send(courses)
})

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course)
    res.send(course)
})

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given ID was not found.')

    const { error } = validateCourse(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    course.name = req.body.name
    res.send(course)
})

app.delete('/api/courses/:id', (req, res) => {
    const idx = courses.findIndex(c => c.id === parseInt(req.params.id))
    if (idx < 0) return res.status(404).send('The course with the given ID was not found.')

    res.send(courses.splice(idx, 1)[0])
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given ID was not found.')
    
    res.send(course)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))