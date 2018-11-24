
const mongo = require('../model/guwen');
const booklistInit = require('./booklist')
const chapterlistInit = require('./chapter');

const start = async () => {
    let booklistRes = await booklistInit();
    if (!booklistRes) {
        console.log('书籍列表抓取出错，程序终止...');
        return;
    }
    console.log('书籍列表抓取成功，现在进行书籍章节抓取...');
    let chapterlistRes = await chapterlistInit();
    if (!chapterlistRes) {
        console.log('书籍章节列表抓取出错，程序终止...');
        return;
    }
    console.log('书籍章节列表抓取成功，现在进行书籍内容抓取...');
}

start();