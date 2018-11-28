const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const async = require("async");

const bookHelper = require('../helper/bookhelper');

const { bookListModel, chapterListModel } = require('../model/guwen');
const {
    errContentModel,
    errorCollectionModel,
    getModel
} = require('../model/content');

const {
    sleep,
    replaceStr,
    noResourceNotice,
    reg,
    replaceFront,
    replaceEnd,
    getTranslate
} = require('../helper/utils');

const contentListInit = async () => {
    const list = await bookHelper.getBookList(bookListModel);
    if (!list) {
        console.log('初始化查询书籍目录失败');
        return;
    }
    const res = await mapBookList(list);
    if (!res) {
        console.log('抓取章节信息，调用 getCurBookSectionList() 进行串行遍历操作，执行完成回调出错，错误信息已打印，请查看日志!')
        return;
    }
    return res;
}

const mapBookList = (list) => {
    return new Promise((resolve, reject) => {
        async.mapLimit(list, 1, (series, callback) => {
            let doc = series._doc;
            getCurBookSectionList(doc, callback);
        }, (err, result) => {
            if (err) {
                console.log('书籍目录抓取异步执行出错!')
                reject(false);
                return;
            }
            resolve(true);
        })
    })
}

/**
 * 获取单本书籍下章节列表 调用章节列表遍历进行抓取内容
 * @param {*} series 
 * @param {*} callback 
 */

const getCurBookSectionList = async (series, callback) => {
    let num = Math.random() * 1000 + 1000;
    await sleep(num);
    let key = series.key;
    const res = await bookHelper.querySectionList(chapterListModel, {
        key: key
    });
    // if (!res) {
    //     logger.error('获取当前书籍: ' + series.bookName + ' 章节内容失败，进入下一部书籍内容抓取!');
    //     callback(null, null);
    //     return;
    // }
    // //判断当前数据是否已经存在
    // const bookItemModel = getModel(key);
    // const contentLength = await bookHelper.getCollectionLength(bookItemModel, {});
    // if (contentLength === res.length) {
    //     logger.info('当前书籍：' + series.bookName + '数据库已经抓取完成，进入下一条数据任务');
    //     callback(null, null);
    //     return;
    // }
    await mapSectionList(res);
}

/**
 * 遍历单条书籍下所有章节 调用内容抓取方法
 * @param {*} list 
 */

const mapSectionList = (list) => {
    return new Promise((resolve, reject) => {
        async.mapLimit(list, 1, (series, callback) => {
            let doc = series._doc;
            getContent(doc, callback)
        }, (err, result) => {
            if (err) {
                console.log('书籍目录抓取异步执行出错');
                reject(false);
                return;
            }
            const bookName = list[0].bookName;
            const key = list[0].key;

            saveAllContentToDB(result, bookName, key, resolve);
        })
    })
}

/**
* 对单个章节Url进行内容抓取 ，返回抓取数据
* @param {*} series 
* @param {*} callback 
*/
const getContent = (series, callback) => {
    request(series.url, (err, response, body) => {
        if (err) {
            console.log('当前章节链接打开失败，链接为：' + series.url + ',即将将该条数据信息保存到error集合中...');
            callback(null, null)
            return
        };
        let $ = cheerio.load(body, {
            decodeEntities: false
        });
        //获取当前二级标题和三级标题
        let curChapter = $('.cont').find('h1').html() ? $('.cont').find('h1').html().replace(/<[^>].*>/g, '').trim() : '';
        let obj = {
            name: series.bookName,
            author: $('.source a').text(),
            chapter: series.chapter,
            section: series.section,
            translator: $('.right .source span').eq(1).text(),
            content: $('.contson').html() ? reg($('.contson').html(), replaceFront.reg, replaceFront.replace, curChapter[1]).replace(replaceEnd.reg, replaceEnd.replace) : noResourceNotice(series.url, curChapter, '没有内容'),
            // translate: $('.shisoncont').html() ? reg($('.shisoncont').html(), replaceFront.reg, replaceFront.replace).replace(replaceEnd.reg, replaceEnd.replace).replace(/<[^>|^br].*?>/g, '') : noResourceNotice(series.url, curChapter, ' 没有翻译'),
            translate: $('.shisoncont').html() ? getTranslate($) : noResourceNotice(series.url, curChapter, ' 没有翻译'),
            originUrl: series.bookUrl
        }


        /** 抓取完一篇内容 就直接插入到数据库， 这样有主要有三点好处，1 数据不易丢失， 2 如果以整个书籍最循环抓取完毕再保存数据，
         * 有的数据会很大（如几百章 也就意味着一次性要缓存几百个页面数据，最后插入到数据库），3 容错机制较好，如果这个页面出错可以将完整
         * 的章节集合内行数据保存到一个收集错误的表中。，缺点是太慢！
         * 可以做一个缓存器一次性保存一定条数 当条数达到再做保存。
         **/
        //logger.info('书籍名： ' + series.bookName + ' 章节或篇名：' + series.section + ' 抓取完毕，开始保存到数据库...');
        // saveContentToDB(obj, series, callback);
        console.log('书籍名： ' + series.bookName + ' 章节或篇名：' + series.section + ' 抓取完毕，开始抓取下一篇...');
        callback(null, obj);
    });
}

const saveAllContentToDB = async (result, bookName, key, resolve) => {
    const BookItemModel = getModel(key);
    console.log('当前书籍：' + bookName + '抓取完成，开始保存...');
    let flag = await bookHelper.addCreateCollection(BookItemModel, result);
    if (!flag) {
        console.log('书籍名： ' + bookName + '抓取保存失败,本条数据将被保存到errorCollectionModel集合中');
        await bookHelper.insertCollection(errorCollectionModel, {
            key: key,
            bookName: bookName
        });
        resolve(true);
        return;
    }
    console.log('书籍名： ' + bookName + ' 整体保存成功！');
    resolve(true);
}

module.exports = contentListInit;
