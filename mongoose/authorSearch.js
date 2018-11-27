
const { Book, Author } = require('./model/book');

Author.find({ first_name: 'tom0' }, function (err, doc) {
    if (err) {
        console.log(err);
        return;
    }
    // console.log(doc);
    // Book.find({genre:doc[]})
    var lists = [];
    doc.forEach((item, index) => {
        Book.find({ genre: item.id }, function (err, date) {
            if (err) {
                console.log(err);
                return;
            }
            lists.concat(date);
        })
    })
    return lists;
})


