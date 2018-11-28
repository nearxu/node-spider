const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const async = require("async");

const bookHelper = require('../helper/bookhelper')
const { bookListModel, chapterListModel } = require('../model/guwen');

var baseUrl = 'http://so.gushiwen.org/guwen/Default.aspx?p=';
var totalListPage = 1;
var origin = 'http://so.gushiwen.org';

//通过闭包 生成keyName  @prefix 输入前缀
let count = 10000;
const prefix = 'gwbook';
const _getKeyName = (prefix) => {
    return prefix + count++;
}

const booklistInit = async () => {
    const pageUrlList = getPageUrlList(totalListPage, baseUrl);
    let res = await getBookList(pageUrlList);
    console.log(res)
    return res;
}

function getPageUrlList(total, url) {
    let list = [];
    for (let i = 0; i <= total; i++) {
        list.push(baseUrl + i)
    }
    return list;
}


function getBookList(pageUrlList) {
    return new Promise((resolve, reject) => {
        async.mapLimit(pageUrlList, 3, function (series, callback) {
            getCurPage(series, callback)
        }, function (err, result) {
            if (err) {
                console.log('------------异步执行出错!----------')
                reject(false)
                return
            }
            console.log(result, 'result')
            let booklist = getNewBookListArray(result);
            saveDB(booklist, resolve);
        })
    })
}

function getCurPage(bookUrl, callback) {
    request(bookUrl, function (err, response, body) {
        if (err) {
            console.log('当前链接发生错误，url地址为:' + bookUrl);
            callback(null, null)
            return
        } else {
            $ = cheerio.load(body, { decodeEntities: false });
            let curBookName = $('.sonspic h1').text();
            let curBookList = getCurPageBookList($, body);
            callback(null, curBookList)
        }
    })
}

function getCurPageBookList($, body) {
    let BookListDom = $('.sonspic .cont');
    let BookList = [];
    BookListDom.each(function (index, el) {
        let obj = {
            key: _getKeyName(prefix),
            bookName: $(el).find('p b').text(), // 书名
            bookUrl: origin + $(el).find('p a').attr('href'), //书目链接
            bookDetail: $(el).find('p').eq(1).text().trim(),// 书籍介绍
            imageUrl: $(el).find('a img').attr('src'),//书籍图片地址
        }
        BookList.push(obj)
    })
    return BookList
}


function getNewBookListArray(arr) {
    // return new Promise((resolve,reject)=>{

    // })
    let res = [];
    arr.map((child, index) => {
        res = res.concat(...child);
    });
    return res;
}

const saveDB = async (result, callback) => {
    let falg = await bookHelper.insertCollection(bookListModel, result);
    if (!falg) {
        console.log('书籍目录数据保存失败');
        return;
    }
    console.log('数据保存成功! 总条数为：' + result.length + '条书籍目录信息');
    if (typeof callback === 'function') {
        callback(true);
    }
}

module.exports = booklistInit


