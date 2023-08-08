const fs = require('fs');
const url = require('url');
const http = require('http');
const replace = require('./modules/replace');
const { log } = require('console');

const shoe = fs.readFileSync('./templates/shoe.html', 'utf-8');
const main = fs.readFileSync('./templates/main.html', 'utf-8');
const data = fs.readFileSync('./templates/shoeData.json', 'utf-8');
const p=fs.readFileSync('./templates/product.html','utf-8')

const dataObj = JSON.parse(data);

const server = http.createServer(function(req, res) {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    const card_html = dataObj.map(el => replace(shoe, el));
    const response_html = main.replace('{%MAIN%}', card_html.join('')); 
    res.end(response_html);
  }
  else if(pathname==='/product'){
    const product = dataObj[query.id];
    const send = replace(p,product)
    res.end(send);
  }
  else{
    res.end("404 pnf");
  }
});

server.listen(3000, '127.0.0.1', function() {
  console.log('listening to the port 3000');
});
