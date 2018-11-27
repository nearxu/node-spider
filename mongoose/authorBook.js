const init = require('./test');
const data = init();
const booklist = data['book'];
const { Book, Author } = require('./model/book');

function saveUser() {
    const user = data['author'];
    user.forEach((data, index) => {
        var obj = {
            first_name: data.first_name,
            family_name: data.family_name,
            date_of_birth: data.date_of_birth,
            date_of_death: data.date_of_death,
        }
        var authors = new Author(obj);
        authors.save(function (err) {
            if (err) {
                console.log(err)
                return;
            }
            console.log(index, '作者保存成功！')
            booklist.forEach((item, i) => {
                if (item.author === data.first_name) {
                    saveBook(item, authors._id);
                }
            })
        })
    })
}

function saveBook(data, id) {
    var bookobj = {
        title: data.title,
        author: data.author,
        summary: data.summary,
        isbn: data.isbn,
        genre: id,
    }
    var books = new Book(bookobj);
    books.save(function (err) {
        if (err) {
            console.log(err)
            return;
        }
        console.log(id, '书籍保存成功！')
    })
}

saveUser()

// saveBook()
