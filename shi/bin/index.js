
const mongo = require('../model/guwen');
const classInit = require('./class')
const contentInit = require('./content');

const start = async () => {
    // let classRes = await classInit();
    // if (!classRes) {
    //     console.log('class抓取出错，程序终止...');
    //     return;
    // }
    let res = await contentInit();
}

start();