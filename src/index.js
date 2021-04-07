const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

/**
 * @typedef {object} Todo
 * @property {string} id
 * @property {string} title
 * @property {boolean} done
 * @property {Date} deadline
 * @property {Date} created_at
 */

/**
 * @typedef {object} User
 * @property {uuid} id
 * @property {string} name
 * @property {string} username
 * @property {Todo[]} todos
 */


/**
 * @type {Array<User>}
 */
const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;

  const user = users.find(user => user.username === username);
  
  if(user){
    request.user = user;
    return next();
  }
  return response.status(404).json({error:'Usuário não encontrado'});
  
}

function checksExistsTodo(request, response, next) {

   const user = request.user;

   const {id} = request.params;
  
  if(user){
    const todo = user.todos.find(todo => todo.id === id);

    if(todo){
      request.todo = todo;
      return next();
    }

  }
  return response.status(404).json({error:'Usuário não encontrado tot'});
  
}

function filterAllUsers(username){
  const userIndex = users.findIndex(userItem => userItem.username === username);

  console.log(userIndex);

  if(userIndex >= 0){
    users.splice(userIndex,1);
  }

}

function filterAllTodos(user,todoId){
  return user.todos.filter(todo => todo.id !== todoId);
}

app.post('/users', (request, response) => {
  const {name,username} = request.body;

  if(users.some(user => user.username === username)){
    return response.status(400).json({error: 'Usuário já existe na Base de Dados'});
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos:[],
  };

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  /**
   * @type {User}
   */
  const user = request.user; //desestruturando perco a oportunidade de usar Type
  

  const {todos} = user;

  return response.json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title,deadline} = request.body;

  const user = request.user;

  filterAllUsers(user.username);
  

  const newTodo = {
    id: uuidv4(),
    title,
    done:false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(newTodo);

  users.push(user);
 
  return response.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount,checksExistsTodo, (request, response) => {
  const {user,todo} = request;
  const {title,deadline} = request.body;
  

  const newTodo = {
    ...todo,
    title,
    deadline: new Date(deadline),
  };
  filterAllUsers(user.username);
    
  const userUpdatedTodos = {
    ...user,
    todos:[...filterAllTodos(user,todo.id),newTodo]
  }


  users.push(userUpdatedTodos);


  return response.json(newTodo);
});

app.patch('/todos/:id/done', checksExistsUserAccount,checksExistsTodo, (request, response) => {
  const {user,todo} = request;
  

  const newTodo = {
    ...todo,
    done:true,
  };

  filterAllUsers(user.username);
    
  const userUpdatedTodos = {
    ...user,
    todos:[...filterAllTodos(user,todo.id),newTodo]
  }


  users.push(userUpdatedTodos);


  return response.json(newTodo);
});

app.delete('/todos/:id', checksExistsUserAccount,checksExistsTodo, (request, response) => {
  const {user,todo} = request;
  

  filterAllUsers(user.username);
    
  const userUpdatedTodos = {
    ...user,
    todos:[...filterAllTodos(user,todo.id)]
  }


  users.push(userUpdatedTodos);


  return response.status(204).json();
});

module.exports = app;