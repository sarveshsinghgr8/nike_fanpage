const fs = require('fs');
const url = require('url');
const http = require('http');
const replace = require('./modules/replace');
const { log, error } = require('console');
const mongoose = require('mongoose');
const shoe_data = require('./models/shoeSchema');
const dotenv = require('dotenv').config('.env');

const shoe = fs.readFileSync('./templates/shoe.html', 'utf-8');
const main = fs.readFileSync('./templates/main.html', 'utf-8');
const data = fs.readFileSync('./templates/shoeData.json', 'utf-8');
const p=fs.readFileSync('./templates/product.html','utf-8')

//const mongoose = require('mongoose');

const DB = process.env.DB;
mongoose.connect(DB).then(()=>{
  console.log("Connection was Successfull");
}).catch((err)=>{
  if(err){
    console.log(err);
  }
});

const dataObj = JSON.parse(data);
const deleteAllShoeData = async () => {
      for (let i = 0; i < dataObj.length; i++) {
        try {
          const product = dataObj[i];
          const existingProduct = await shoe_data.findOne({ identification: product.id });
          if (existingProduct) {
            console.log('Data already exists for ID:', product.id);
          } else {
            const doc = new shoe_data(product);
            await doc.save();
          }
        } catch (error) {
        }
      }
        
};
deleteAllShoeData().then({});



  const server = http.createServer(function(req, res) {
    const { query, pathname } = url.parse(req.url, true);
    shoe_data.findOne({identification:query.id}).then((product)=>{
      if (pathname === '/') {
        res.writeHead(200, {
          'Content-type': 'text/html'
        });
        const card_html = dataObj.map(el => replace(shoe, el));
        const response_html = main.replace('{%MAIN%}', card_html.join('')); 
        res.end(response_html);
      }
      else if(pathname==='/product'){
        const send = replace(p,product);
        res.end(send);
        
      }
      else{
        res.end("404 pnf");
      }
    })
    
    
  });
  server.listen(3000, '127.0.0.1', function() {
    console.log('listening to the port 3000');
  });

