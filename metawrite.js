const $ = require('cheerio') //for parsing html
const rp = require('request-promise')
const chalk = require('chalk')
const url = require('url');
const fs = require('fs');

const error_msg = chalk.red.inverse
const succ_msg = chalk.green.inverse
const wait_msg = chalk.yellow.inverse

const getMeta = (packagename) => {
    // 1 - find a link to github project int the html of npm site
    console.log(packagename)
    const npm_url = "https://www.npmjs.com/package/" + packagename; //the npm url
    const reg = new RegExp("^https:\/\/github.com\/.*\/" + packagename + "$") //reg to find the needed href
    console.log(wait_msg("making a request..."))
    rp(npm_url)
        .then(function(html){
            console.log(succ_msg("package found, parsing"))
            const urls = $("a[class='b2812e30 f2874b88 fw6 mb3 mt2 truncate black-80 f4 link']", html) // this may change over time (?)
            let github_url = '\0'
            for(i = 0; i < urls.length; i++)
                if(reg.test(urls[i].attribs.href)){
                    console.log(succ_msg("url found: ") + urls[i].attribs.href)
                    github_url = urls[i].attribs.href
                    break;
                }

            if(github_url === '\0'){
                console.log(error_msg("Error: package found, parsing went wrong"))
                return
            }
            
            //2 - make request to a raw package.json file from rep and download it contents, write to metadata.json
            // https://raw.githubusercontent.com/ + **request/request-promise** + /master/package.json

            let rep_path = url.parse(github_url).pathname;
            const rawjson_url = "https://raw.githubusercontent.com" + rep_path + "/master/package.json"
            console.log(wait_msg("making request to github..."))

            rp(rawjson_url)
                .then(function(html)
                {   console.log(succ_msg("json found, parsing"))
                    const meta = JSON.parse(($("pre").text().trim(), html))
                    if (!fs.existsSync('./meta')) fs.mkdirSync('./meta')
                    fs.writeFile(`./meta/${packagename}_metadata.json`, JSON.stringify(meta),() =>
                     console.log(succ_msg("COMPLETE: search for file in ./meta folder")))
                })
                .catch(function(err){
                    console.log(error_msg("Error: package.json not found\n") + err)
                })

        })
        .catch(function(err){
            console.log(error_msg("ERROR: no such package\n" + err))
        })
}

module.exports = {
    getMeta,
}