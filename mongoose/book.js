const mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/mdn')

mongoose.connection.on('error', function (err) {
    console.log('数据连接失败')
})

mongoose.connection.on('open', function () {
    console.log('数据连接成功')
})

const authorSchema = mongoose.Schema({
    name: String,
    store: [{ type: mongoose.Schema.Types.ObjectId }]
})

const storeSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId },
    title: String
})

const Store = mongoose.model('store', storeSchema)
const Author = mongoose.model('author', authorSchema);

const bob = new Author({ name: 'BoBo' })

bob.save(function (err) {
    if (err) return;
    var stores = new Store({
        title: 'bobo is me',
        author: bob._id
    })
    stores.save(function (err) {
        if (err) return;
        console.log('store save success!')
    })
})

// 获取作者信息，我们使用populate()

Store.findOne({ title: 'bobo is me' })
    .populate('author')
    .exec(function (err, series) {
        if (err) return;
        console.log('this authoe is ', series);
    })
