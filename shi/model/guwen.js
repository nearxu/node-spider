
const mongoose = require('mongoose');
const q = require('q');


mongoose.Promise = q.Promise;
let conno = mongoose.connect('mongodb://localhost:27017/shi');
mongoose.connection.on('connected', function () {
    console.log("数据库 连接成功");
})

// 类型
const bookClass = mongoose.Schema({
    key: String,
    bookName: String,
    bookUrl: String,
});

//content
const bookContent = mongoose.Schema({
    key: String,
    name: String,
    title: String,
    year: String,
    content: String,
    label: String,
    good: Number
})

const classModel = conno.model('class', bookClass);
const content
module.exports = {
    classModel
}