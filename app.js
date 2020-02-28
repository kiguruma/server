const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yamoto:kiguruma@cluster0-eshrb.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

const todoSchema = mongoose.Schema({
    content: String
})

todoSchema.set('toJSON',{
    transform: (doc, todo) => {
        todo.id = todo._id.toString()
        delete todo._id
        delete todo.__v
    }
})

const Todo = mongoose.model('Todo', todoSchema)



const app = express()

//corsを許可する
app.use(cors())

//bodyParserを許可する
app.use(bodyParser());


app.get('/todos', (req, res) => {
    Todo.find({})
        .then(todos => {
            res.json(todos.map(todo => todo.toJSON()))
        })
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

    const todo = new Todo({ content: req.body.content})
    todo.save()
    .then( todo => {
        res.json(todo.toJSON())
    })
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
