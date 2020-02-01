const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');




const app = express()

//corsを許可する
app.use(cors())

//bodyParserを許可する
app.use(bodyParser());

const todos = [
    {
    id: 1,
    content: 'aaa'
    },
    {
    id: 2,
    content: 'bbb'
    },
    {
    id: 3,
    content: 'ccc'
    }
]

app.get('/todos', (req, res) => {
    res.json(todos)
})


app.post('/todos',(req, res) => {
    res.json(todos.concat(req.body))
})

app.delete('/todos/:id', function (req, res) {
    res.json(
        todos.filter(todo => todo.id !=
            req.params.id
            )
            )
})

app.listen(3001, () => {
    console.log('Server Started')
})
