const http = require('http');
const errorheader = require('./errorheader');
const { v4: uuidv4 } = require('uuid');
// uuidv4(); 重點單字：startsWith
const todos = [];

const reqList = (req, res) =>{
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
   'Content-Type': 'application/json'
  }
  let body = "";
  req.on('data', chunk =>{
    body+=chunk;
  })

  if(req.url == "/todos" && req.method == "GET"){

    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos,
    }))
    res.end();

  }else if(req.url == "/todos" && req.method == "POST"){
    req.on('end',()=>{
      try
      {
        const title = JSON.parse(body).title;
        if(title != null){
          const todo = {
            "title": title,
            "id": uuidv4(),
          };
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos,
          }))
          res.end();
        }else{
          errorheader(res, 400, "資料不可為空");
        }
      }
      catch(error){
        errorheader(res, 400, "資料格式有錯");
      }

    });
  }else if(req.url.startsWith('/todos/') && req.method == "POST"){
    req.on('end',()=>{
      try
      {
        const id = req.url.split('/').pop();
        const index = todos.findIndex( itme => itme.id == id);
        const title = JSON.parse(body).title;
        if(title != null && index != -1){
          todos[index].title = title;
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos,
          }))
          res.end();
        }else{
          errorheader(res, 400, "資料格式或ID有錯");
        }
      }
      catch(error){
        errorheader(res, 400, "資料格式或ID有錯");
      }

    });
   
  }else if(req.url.startsWith('/todos/') && req.method == "DELETE"){
    try
    {
      const id = req.url.split('/').pop();
      const index = todos.findIndex( itme => itme.id == id);

      if(index != -1){
        todos.splice(index, 1);
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          "status": "success",
          "data": todos,
        }))
        res.end();
      }else{
        errorheader(res, 400, "資料格式或ID有錯");
      }
    }
    catch(error){
      errorheader(res, 400, "資料格式或ID有錯");
    }
   
  }else if(req.url == "/todos" && req.method == "DELETE"){
    todos.length = 0;
    
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos,
    }))
    res.end();

  }else if(req.url == "/todos" && req.method == "OPTIONS"){
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos,
    }))
    res.end();

  }else{
    errorheader(res, 404, "not found");
  }

}

const server = http.createServer(reqList);
server.listen( process.env.PORT || 3005 );