const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = '3000'

const server = http.createServer((req,res) => {
  let parsedURL = url.parse(req.url, true);
  let path = parsedURL.pathname;              // entire path..you need to standardize this 
  path = path.replace(/^\/+|\/+$/g, '');      // removes any '/' at begining or end. '/folder/to/file/' becomes 'folder/to/file'
  let qs = parsedURL.query;
  let headers = req.headers;
  let method = req.method;

  req.on("data", () => {
    console.log("got some data");
    //if no data is passed we don't see this messagee
    //but we still need the handler so the "end" function works.
  })

  req.on("end", () => {
    //request part is finished... we can send a response now
    console.log("send a response");
    //we will use the standardized version of the path
    let route = typeof routes[path] !== "undefined" ? routes[path] : routes["notFound"];
    let data = {
      path: path,
      queryString: qs,
      headers: headers,
      method: method
    };
    //pass data incase we need info about the request
    //pass the response object because router is outside our scope
    route(data, res);
  });


});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


const routes = {
  'first': (data, res) => {
    //this function is called is the path is 'first'
    let payload = {
      name: "Zach"
    };
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.write(payloadStr);
    res.end(); 
  },
  'second': (data, res) => {
    let payload = {
      name: "Rachel"
    };
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.write(payloadStr);
    res.end();
  },
  "path/to/information": (data, res) => {
    let payload = {
      name: "Christopher",
      enemy: "The Coon",
      today: +new Date()
    };
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.write(payloadStr);
    res.end();
  },
  'notFound': (data, res) => {
    //this one gets called if no route matches
    let payload = {
      message: "File Not Found",
      code: 404
    };
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(404);
    res.write(payloadStr);
    res.end();
  }
};


//curl http://localhost:3000/dwdww                ->> res is: {"message":"File Not Found","code":404}
//curl http://localhost:3000/first                ->> res is: {"name":"Zach"}
//curl http://localhost:3000/second///            ->> res is: {"name":"Rachel"}
//curl http://localhost:3000/path/to/information  ->> res is: {"name":"Christopher","enemy":"The Coon","today":1616153079869}