const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: 'user1', password: 'pass1' }];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const user = req.body.username;
  const pass = req.body.password;
  // console.log(user, pass);
  // console.log(users);
  let user_login = users.filter((user_check) => user_check.username===user && user_check.password===pass)
  console.log(user_login);
  if (!user || !pass) {
      return res.status(404).json({message: "Body Empty"});
  }
  if(user_login) {
    let accessToken = jwt.sign({
      data: user
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken
    }
  }
  
  return res.status(200).send("User successfully logged in");
});

//Add a user
regd_users.put("/", (req, res) => {
  const exist_user = users.filter((user) => user.username === req.query.username);

  if(exist_user.length>0) {
    return res.status(200).json({message: "The user already exist"});  
  }

  const new_user = {
    "username": req.query.username,
    "password": req.query.password
  }

  users.push(new_user);

  return res.status(200).json({message: "The new user was registered"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let user_request = req.user.data;
  let new_review = req.body.review;
  //Add o edit review
  let updated = false;
  let message_ok = "";

  if(user_request!==null) {
    Object.keys(books).forEach(function(key) {
      if(key===req.params.isbn) {
        let foundRev = false;
        Object.keys(books[key]["reviews"]).forEach(function(keyRev) {
          if(books[key]["reviews"][keyRev]["username"]===user_request) {
            foundRev = true;
            books[key]["reviews"][keyRev]["review"] = new_review;
            message_ok = "The review was updated";
          }
        });
  
        if(foundRev===false) {
          let keyLength = Object.keys(books[key]["reviews"]).length;
          books[key]["reviews"][keyLength] = {"username":user_request, "review": new_review};
          message_ok = "The review was registered";
        }
  
        updated = true;
      }    
    });
  }
  

  // console.log(books[1]);

  if(updated===true) {
    return res.status(200).json({message: message_ok});
  }
  else {
    return res.status(300).json({message: "Problem to update o add review"});
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  let user_request = req.user.data;
  //Add o edit review
  let message_ok = "";

  let foundRev = false;

  if(user_request!==null) {
    Object.keys(books).forEach(function(key) {
      if(key===req.params.isbn) {
        Object.keys(books[key]["reviews"]).forEach(function(keyRev) {
          if(books[key]["reviews"][keyRev]["username"]===user_request) {
            foundRev = true;
            books[key]["reviews"][keyRev] = {};
            message_ok = "The review was deleted";
          }
        });
      }    
    });
  }
  
  // console.log(books[1]);

  if(foundRev===true) {
    return res.status(200).json({message: message_ok});
  }
  else {
    return res.status(300).json({message: "Problem to delete the review"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
