const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yamoto:kiguruma@cluster0-eshrb.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});




const app = express()

//corsを許可する
app.use(cors())

//bodyParserを許可する
app.use(bodyParser());

let todos = [
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

const generateId = () => {
    // const ids = todos.map(todo => todo.id)
    // let maxGetId = Math.max(...ids) + 1 
    // return maxGetId
    if (todos.length === 0 ) {
        return 1
    } else {
        return Math.max(...todos.map(todo => todo.id)) + 1
    }
}

app.post('/todos',(req, res) => {
    todo = {
    content: req.body.content,
    id: generateId()
    }
    todos = todos.concat(todo)
    res.json(todo)
})



app.delete('/todos/:id', function (req, res) {
        todos =  todos.filter(todo => todo.id !=
                req.params.id
            )
            console.log(todos.length,'delete後')

            res.status(204).end()

})

app.listen(3001, () => {
    console.log('Server Started')
})
