const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const async = require("async");

const { classModel } = require('../model/guwen');
const baseUrl = 'https://www.gushiwen.org/shiwen/';
const originUrl = 'https://www.gushiwen.org';

const classInit = async () => {
    const classList = await getClassList();
    return classList;
}

function saveClass(list) {
    let res = classModel.collection.insert(list)
    if (!res) {
        console.log('插入失败');
        return;
    }
    return res;
}

//通过闭包 生成keyName  @prefix 输入前缀
let count = 10000;
const prefix = 'poem';
const _getKeyName = (prefix) => {
    return prefix + count++;
}

function getClassList() {
    return request(baseUrl, function (err, response, body) {
        if (err) {
            console.log(err);
            return;
        } else {
            $ = cheerio.load(body, { decodeEntities: false });
            let classLists = [];
            let calssDom = $('.sright a');
            calssDom.each(function (index, el) {
                let obj = {
                    key: _getKeyName(prefix),
                    bookName: $(el).text(),
                    bookUrl: originUrl + $(el).attr('href')
                }
                classLists.push(obj);
            })
            const res = saveClass(classLists)
            return res;
        }
    })
}

// classInit();
module.exports = classInit;