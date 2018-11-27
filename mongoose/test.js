

function init() {
    var obj = {
        first_name: 'tom', family_name: 'near', date_of_birth: Date.now(), date_of_death: Date.now()
    }
    var lists = [];
    for (var i = 0; i < 10; i++) {
        var newObj = Object.assign({}, obj);
        for (var key in newObj) {
            newObj[key] = newObj[key] + i
            lists.push(newObj);
        }
    }
    const book = {
        title: 'harry potery!!!',
        summary: 'this is magic book!!!',
        isbn: '001',
        author: '',
        genre: ''
    }

    const books = lists.map((m, i) => {
        var newBook = Object.assign({}, book);
        newBook.author = m.first_name;
        return newBook;
    })
    console.log({ 'author': lists, 'book': books })
    return { 'author': lists, 'book': books };
}
init()

module.exports = init;