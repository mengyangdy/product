require('dotenv').config()

console.log(process.env);



const config=require('config')

const siteConfig=config.get('site')
console.log("🚀 ~ file: index.js:10 ~ siteConfig:", siteConfig)
