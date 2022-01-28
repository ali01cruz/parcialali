const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

function idUnico() {
  // function closure
  let id = 0;
  return function () {
    id = id + 1;
    return id;
  };
}

const newId = idUnico(); // instancio la closure

// TODO: your code to handle requests

server.post('/posts',function(req, res){
  const {author,title,contents} = req.body;
  if(author && title && contents){
      
      const newPost = {
        id:newId(),
        author,
        title,
        contents
      }
      posts.push(newPost)
      return res.json(newPost)
  }else{

    return res.status(STATUS_USER_ERROR).json({error:"No se recibieron los parámetros necesarios para crear el Post"})
  }
})

server.post('/posts/author/:author',function(req, res){
  const {title,contents} = req.body;
  const author = req.params.author
  
  if(title && contents && author){
      
      const newPost = {
        id:newId(),
        author,
        title,
        contents
      }
      posts.push(newPost)
      return res.json(newPost)
  }else{

    return res.status(STATUS_USER_ERROR).json({error:"No se recibieron los parámetros necesarios para crear el Post"})
  }
})

server.get('/posts',function(req, res){
  const {author,title,contents} = req.body;
  const term = req.query.term
  
  if(term){
      const array = posts.filter((e)=>
        
          e.title.includes(term) || e.contents.includes(term)
        
      )
      return res.json(array)
  }else{
    return res.json(posts)
  }
})


server.get('/posts/:author',function(req, res){

  const author = req.params.author
  const array = posts.filter((e)=>
          e.author === author
      )
  if(array){
      return res.json(array)
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post del autor indicado"})
  } 
 
})

server.get('/posts/:author/:title',function(req, res){

  const author = req.params.author
  const title = req.params.title
  const array = posts.filter((e)=>
          e.author === author && e.title === title
      )
  if(array){
      return res.json(array)
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado"})
  } 
 
});

 server.delete('/posts',function(req, res){

  const {id,author,title,contents} = req.body
  
  if(id){
    const array = posts.filter((e)=>
          e.id === id
      )
    if(array.length > 0){
      const postset = posts.filter((e)=>
        e.id !== id
      )
      posts = postset
      return res.json({ success: true });
    }else{
      return res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"})
    }
    
  }else{
    return res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"})
  }

  
 
}) 

server.put('/posts',function(req, res){

  const {id ,title ,contents} = req.body
  if(id && title && contents){
    const array = posts.filter((e)=>
          e.id === id
      )
    if(array){
      var doubles = posts.map(function(x) {
        if(x.id == id){
          x.title =title
          x.contents =contents
        }
        return x;
      });
      posts = doubles
      return res.json({ success: true });
    }
    return res.status(STATUS_USER_ERROR).json({error: "el `id` Nocorresponde con un Post existente"})
    
  }
  return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"})


  
 
}) 


server.delete('/author',function(req, res){

  const {author,title,contents} = req.body;


  const array = posts.filter((e)=>
          e.author === author
      )
 

  if(array.length>0){
      //author exist 

      const postsdelete = posts.filter((e)=>
      e.author !== author
      )
     
      posts = postsdelete

      return res.json(array);
  }
  
  return res.status(STATUS_USER_ERROR).json({error: "No existe el autor indicado"})

 
}) 

module.exports = { posts, server };
