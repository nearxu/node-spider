
const mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/test')

mongoose.connection.on('error', function (err) {
    console.log('数据连接失败')
})

mongoose.connection.on('open', function () {
    console.log('数据连接成功')
})

//Schema—— 一种以文件形式存储的数据库模型骨架
// 字符串、日期型、数值型、布尔型(Boolean)、null、数组
const testSchema = new mongoose.Schema({
    name: { type: String },
    age: { type: Number, default: 0 },
    time: { type: Date, default: Date.now },
    email: { type: String, default: '' },
    id: { type: String }
})

const testModel = mongoose.model('test1', testSchema);

const tests = new testModel({
    name: "helloworld",
    age: 28,
    email: "helloworld@qq.com",
    id: '0001'

})

tests.save(function (err, doc) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(doc)
    console.log('数据插入成功！！')
})



