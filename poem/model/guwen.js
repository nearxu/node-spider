
const mongoose = require('mongoose');
const q = require('q');


mongoose.Promise = q.Promise;
let conno = mongoose.connect('mongodb://localhost:27017/test3');
mongoose.connection.on('connected', function () {
    console.log("数据库 连接成功");
})

// 目录表
const bookMap = mongoose.Schema({
    key: String,
    bookName: String,
    bookUrl: String,
    bookDetail: String,
    imageUrl: String
});
// 章节表
const chapterMap = mongoose.Schema({
    chapter: String,
    section: String,
    url: String,
    key: String,
    bookName: String,
    author: String,
})

const bookListModel = conno.model('booklistsBK', bookMap);
const chapterListModel = conno.model('chapterlistBK', chapterMap);
module.exports = {
    bookListModel,
    chapterListModel
}