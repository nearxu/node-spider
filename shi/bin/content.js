const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const async = require("async");

const { classModel, contentModel } = require('../model/guwen');
const baseUrl = 'https://www.gushiwen.org/shiwen/';
const originUrl = 'https://www.gushiwen.org';

const contentInit = async () => {
    const list = await getClassList(classModel)
    let res = await asyncGetContent(list)
}

const getClassList = async (model) => {
    const list = await model.find({}).catch(err => {
        console.log(err);
    })
    return list
}
function asyncGetContent(list) {
    return new Promise((resolve, reject) => {
        async.mapLimit(list, 3, (series, callback) => {
            let doc = series._doc;
            console.log(doc, 'doc')
            let bookInfo = {
                key: doc.key,
                bookName: doc.bookName,
            }
            getHtmlInfo(doc.bookUrl, bookInfo, callback)
        }, (err, result) => {
            if (err) {
                reject(false);
                return;
            }
            resolve(true);
        })
    })
}

function getHtmlInfo(url, info, callback) {
    let list = []
    request(url, function (err, response, body) {
        if (response && response.statusCode == 200) {
            $ = cheerio.load(body, {
                decodeEntities: false
            });
            $('.sons').map(function (i, el) {
                let item = {
                    content: $(el).find('.contson').text(),
                    good: $(el).find('.good span').text(),
                    name: $(el).find('.cont p a b').text(),
                    key: info.key,
                    bookName: info.bookName,
                }
                list.push(item);
            })
            insertCollection(contentModel, list)
        }
    })

}

const insertCollection = async (model, list) => {
    let res = await model.collection.insert(list);

}

module.exports = contentInit;