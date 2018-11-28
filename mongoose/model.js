const { test } = require('./model/book');

test.find({}, function (err, doc) {
    if (err) console.log(err);
    console.log(doc, 'dpc');
})

var obj = new test({ name: 'mary' });
obj.save(function (err, data) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(data);
})