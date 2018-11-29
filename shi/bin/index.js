
const mongo = require('../model/guwen');
const classInit = require('./class')

const start = async () => {
    let classRes = await classInit();
    if (!classRes) {
        console.log('class抓取出错，程序终止...');
        return;
    }
    console.log('诗句类型抓取成功...')
}

start();