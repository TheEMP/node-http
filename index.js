console.log("WOOT NODE IS AWESOME")
let express = require('express')
let server = express()
let bodyParser = require('body-parser')

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
let db = {
  users: [{
    name: 'Gunnar',
    password: 'Test',
    id: '4fb280c0-ecab-11e6-8fb3-f74acba7de48'
  }],
  tasks: [{ name: 'Test Task',
    userId: '4fb280c0-ecab-11e6-8fb3-f74acba7de48',
    id: 1 },
  { name: 'Test1 Task',
    userId: '4fb280c0-ecab-11e6-8fb3-f74acba7de48',
    id: 2 } ]
}
let uuid = require('uuid')

server.post('/user', function (req, res) {
  //YOUR CODE HERE TO SAVE THE REQ.BODY TO THE FAKEDB USERS
  //YOU WILL WANT TO ENSURE THAT EACH USER GETS A UNIQUE ID
  //ITS EASY WITH A NODE PACAKGE NAMED UUID

  let user = req.body
  user.id = uuid.v1()
  //NOW ADD YOUR USER TO THE db.users
  db.users.push(user)
  res.send(user)
  console.log(db.users)
})
server.get('/users/:id', function (req, res) {
  //NOTICE THE :id ^^^ THis is considered a route parameter
  //You can get it through the req
  let userId = req.params.id
  //GET THE USER FROM THE FAKE DB AND SEND THE OBJECT TO THE CLIENT
  db.users.forEach(v => {
    if (v.id === userId) {
      res.send(v)
    }
  })
})
server.put('/users/:id', function (req, res) {
  //FIND THE USER BY ID
  let userId = req.params.id
  //ALLOW THE USER OBJECT TO BE EDITED WITH THE DATA FROM REQ.BODY
  //CAUTION DO NOT ALLOW THE USER.ID TO BE MODIFIED BY THE REQ.BODY
  req.body.id = userId
  db.users.forEach((v, k) => {
    if (v.id === userId) {

      for (prop in req.body) {
        if (prop === "id" || prop === "userId") {
          continue
        }
        db.users[k][prop] = req.body[prop]
      }
      res.send(db.users[k])
    }
  })
  console.log("Put", db.users)
})
//IMPORTANT NOTE DELETE METHODS CANNOT CONTAIN A REQUEST BODY
server.delete('/users/:id', function (req, res) {
  //FIND THE USER BY ID
  let userId = req.params.id
  //REMOVE THE USEROBJ FROM THE DB.USERS
  db.users.forEach((v, k) => {
    if (v.id === userId) {
      res.send(v)
      db.users.splice(k, 1)
    }
  })
  console.log(db.users)
})

server.post('/tasks', function (req, res) {
  //YOUR REQ.BODY SHOULD HAVE A USERID FIELD
  let body = req.body

  if (!body.userId) {
    res.send({ error: "NO USER ID SPECIFIED" })
    return
  }
  let user = false
  db.users.forEach(v => {
    if (v.id === body.userId) {
      user = v
    }
  })

  if (!user) {
    res.send({ error: "UNABLE TO FIND USER TO ASSIGN TASK TO" })
    return
  }
  body.id = db.tasks.length +1
  db.tasks.push(body)
  res.send(body)
  console.log(db.tasks)
})
server.get('/tasks/:userId', function (req, res) {
  //LETS ONLY SEND BACK TASKS FOR THE SPECIFIED USER
  let userId = req.params.userId
  let utasks = []
  db.tasks.forEach(v => {
    if (v.userId === userId) {
      utasks.push(v)
    }
  })

  if (utasks.length < 0) {
    res.send({error: "No tasks found!"})
    return
  }
  res.send(utasks)
})
server.put('/tasks/:id/:userId', function (req, res) {
  //Allows a task to be edited if the req.params.userId matches the task.userId
  //OF COURSE AS ABOVE DO NOT ALLOW THE ID OR USERID TO CHANGE

  let task = db.tasks[req.params.id -1]
  if (!task) {
    res.send({error: "No Task found!"})
    return
  }

  if (task.userId != req.params.userId) {
    res.send({ error: "This is not your task!" })
    return
  }
  for (prop in req.body) {
    if (prop === "id" || prop === "userId") {
      continue
    }
    task[prop] = req.body[prop]
  }
  res.send(task)
  console.log(db.tasks)
})
//REMEMBER DELETE METHODS DO NOT CONTAIN A REQUEST BODY
server.delete('/tasks/:id/:userId', function (req, res) {
  //Allows a task to be deleted if the req.params.userId matches the task.userId
  let id = req.params.id - 1
  let task = db.tasks[id]
  if (!task) {
    res.send({error: "No Task found!"})
    return
  }

  if (task.userId != req.params.userId) {
    res.send({ error: "This is not your task!" })
    return
  }
  res.send(task)
  db.tasks.splice(id, 1)
})

server.listen(8080, function () {
  console.log('THE SERVER IS RUNNING ON PORT 8080')
})












