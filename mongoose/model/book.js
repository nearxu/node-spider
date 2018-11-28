const mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/book')
mongoose.connection.on('error', function (err) {
    console.log('数据连接失败')
})

mongoose.connection.on('open', function () {
    console.log('数据连接成功')
})

var AuthorSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true, max: 100 },
        family_name: { type: String, required: true, max: 100 },
        date_of_birth: { type: Date },
        date_of_death: { type: Date },
    }
);

var Author = mongoose.model('author', AuthorSchema);

var BookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        summary: { type: String, required: true },
        isbn: { type: String, required: true },
        genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }
    }
);
var Book = mongoose.model('book', BookSchema)

var testSchema = new mongoose.Schema({
    name: String
})

var test = mongoose.model('test', testSchema)

module.exports = {
    Author,
    Book,
    test
}


