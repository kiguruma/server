const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



mongoose.connect('mongodb+srv://yamoto:kiguruma@cluster0-eshrb.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

const todoSchema = mongoose.Schema({
    //ここでcontent定義？それからどうやってApp.jsに持ってきた？
    content: String
})

todoSchema.set('toJSON',{
    transform: (doc, todo) => {
        todo.id = todo._id.toString()
        //todoschemaの中のtodoの_idを文字列化して
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


app.use(express.static('build'))


app.get('/todos', (req, res) => {
    //この/todosは3001/todos?
    //3001/todosにgetしたらTodoをfindして
    //成功したらmongodbのtodosをjson化して3001に飛ばす？
    Todo.find({})
    //このtodosは何？mongoDBのtodos?
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
    //３００１に追加されたnewTodoのcontentを取り出してる？
    //req.body.contentどこから来た？
    //サーバー＝3001/todos?から送られてきた
    //どうゆう順番？post ブラウザ(React)=>サーバー（３００１）＝＞mongo?
    todo.save()
    //todo.saveでmongodbに追加された
    //それでまた3001にレスポンス返してる？二回通ってる？
    .then( todo => {
        res.json(todo.toJSON())
    })
})

app.put('/todos/:id', function (req, res) {

    const todo = new Todo({ _id: req.params.id})

    console.log('content',req.body.content)

    console.log('id',req.params.id)

    todo.updateOne({ content: req.body.content})
    // .then( todo => {
    //     console.log(todo.data)
    // })
})


app.delete('/todos/:id', function (req, res) {

    // ブラウザから３００１にdelete送信。

    //mongo上だと_idなので形を直す

    const todo = new Todo({ _id: req.params.id})

    todo.deleteOne()
    .then(todo => {
        res.status(204).end()
    })
    //今mongo上のみ消えてる
    

    // Todo.find({})
    //     .then(todos => {
    //         res.json(todos.map(todo => todo.toJSON()))
    //     })

    // then(todos => {
    //     res.json(todos.map(todo => todo.toJSON()))
    // })


        // todos =  todos.filter(todo => todo.id !=
        //         req.params.id
        //     )
        //     console.log(todos.length,'delete後')

        //     res.status(204).end()

})

app.listen(3001, () => {
    console.log('Server Started')
})
