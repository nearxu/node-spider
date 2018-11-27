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
        genre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }]
    }
);
var Book = mongoose.model('book', BookSchema);

var BookInstanceSchema = new mongoose.Schema(
    {
        book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
        imprint: { type: String, required: true },
        status: { type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance' },
        due_back: { type: Date, default: Date.now }
    }
);

var BookInstance = mongoose.model('bookInstance', BookInstanceSchema);

var tom = new Author({ first_name: 'tom', family_name: 'near', date_of_birth: 2018 / 12 / 29, date_of_death: 2018 / 12 / 30 })

tom.save(function (err) {
    if (err) {
        console.log(err)
        return;
    }
    var harry = new Book({
        title: 'harry potery!!!',
        author: tom.first_name,
        summary: 'this is magic book!!!',
        isbn: '001',
        genre: tom._id
    })
    console.log('book !!!')
    harry.save(function (err) {
        if (err) {
            console.log(err)
            return;
        }
        var instance = new BookInstance({
            book: harry._id,
            imprint: 'bbc print component',
            status: 'onsall',
            due_back: Date.now
        })
        console.log('bookinstance !!!')
    })
    console.log('tom save')
})



