const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replace-template');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const dataObj = JSON.parse(data);
const slugs = dataObj.map(elem => slugify(elem.productName, { lower: true }))

const server = http.createServer((req, res) => {
  const { query, pathname: pathName } = url.parse(req.url, true);

  // Overview page
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((elem) => replaceTemplate(templateCard, elem))
      .join('');
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathName === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);

    // API
  } else if (pathName === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Hello from the server!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
