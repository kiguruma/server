const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



mongoose.connect('mongodb+srv://yamoto:kiguruma@cluster0-eshrb.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

const todoSchema = mongoose.Schema({
    //ここでcontent定義？それからどうやってApp.jsに持ってきた？
    //_idはmongoooseの仕様上必ず着く　_vも
    content: String
})

todoSchema.set('toJSON',{
    transform: (doc, todo) => {
        todo.id = todo._id.toString()
        //todoschemaの中のtodoの_idを文字列化してidに変換するtoJSONメソッドを作る
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
    //この/todosは3001/todos
    //3001/todosにget送信来たらmongoDBのTodoモデルをfindする
    //findはmongooseのメソッド
    //成功したらmongodbのtodosをjson化してreactに飛ばす　これはあくまでexpressの処理
    Todo.find({})
    //このtodosは仮引数　中身はTodo.find({})した結果が入ってる
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
    //３００１にpost送信が来たらnew演算子でtodo作成
    //req.body.contentはnewTodoに入ってる
    //どうゆう順番？post送信来る＝＞todo作る＝＞tosoをmongoDB上に保存
    todo.save()
    //下のtodoには上の中身が入っている
    //todoをtoJSONして送っている
    .then( todo => {
        res.json(todo.toJSON())
    })
})

app.put('/todos/:id', function (req, res) {
    //PUT送信来たらTODO作るIDがreq.params.idの

    const todo = new Todo({ _id: req.params.id})

    // console.log('content',req.body.content)

    // console.log('id',req.params.id)

    todo.updateOne({ content: req.body.content})
    .then( todo => {
        res.json(todo)
    })
})


app.delete('/todos/:id', function (req, res) {

    // ブラウザから３００１にdelete送信。delete送信来たらmongo上のtodo消す

    //mongo上だと_idなので形を直す

    const todo = new Todo({ _id: req.params.id})

    todo.deleteOne()
    .then(todo => {
    //todoは仮引数
        res.status(204).end()
    })
    //今mongo上のみ消えてる
})

app.listen(3001, () => {
    //expressは3001番で受け付けている
    console.log('Server Started')
})
