const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
const getAllBooks = async () => {
	try {
		const allBooksPromise = await Promise.resolve(books)
		if (allBooksPromise) {
			return allBooksPromise
		} else {
			return Promise.reject(new Error('No books were found.'))
		}
	} catch (err) {
		console.log(err)
	}
}

public_users.get('/', async function (req, res) {
  const dataBooks = await getAllBooks()

  return res.status(200).json(dataBooks);
});

// Get book details based on ISBN
const bookIsbn = async isbn => {
  try {
    let book;
    Object.keys(books).forEach(function(key) {
      
      if(parseInt(key)===parseInt(isbn)) {
        // console.log(key);
        book = books[key];
      }
      
    });
 
    return book;
  }
  catch (err) {
    console.log(err);
  }
}
public_users.get('/isbn/:isbn', async function (req, res) {
  const dataBook = await bookIsbn(req.params.isbn)

  if (typeof dataBook === 'undefined') {
    res.status(200).send("Unable to find the book!");    
  }
  else{
    res.status(200).json(dataBook);
  }
});
  
// Get book details based on author
const bookAuth = async author => {
  try {
    let books_filter = [];
    Object.keys(books).forEach(function(key) {
      if(books[key]["author"]===author) {
        books_filter.push(books[key]);
      }
    });
    return books_filter;
  }
  catch (err) {
    console.log(err);
  }
  
}

public_users.get('/author/:author', async function (req, res) {
  const books_filter = await bookAuth(req.params.author);

  if (typeof books_filter === 'undefined') {
      res.status(200).send("Unable to find books of this author!");    
  }
  else{
    res.status(200).send(books_filter);
  }
});

// Get all books based on title
const bookTitle = async title => {
  let books_filter = [];
  Object.keys(books).forEach(function(key) {
    
    if(books[key]["title"]===title) {
      books_filter.push(books[key]);
    }
    
  });

  return books_filter;
}

public_users.get('/title/:title', async function (req, res) {
  const books_filter = await bookTitle(req.params.title);

  if (typeof books_filter === 'undefined') {
      res.status(200).send("Unable to find book with this title!");    
  }
  else{
    res.status(200).send(books_filter);
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book_reviews;
  Object.keys(books).forEach(function(key) {
    
    if(parseInt(key)===parseInt(isbn)) {
      // console.log(key);
      book_reviews = books[key]["reviews"];
    }
    
  });

  if (typeof book_reviews === 'undefined') {
      res.status(200).send("Unable to find the book to show reviews!");    
  }
  else{
    res.status(200).send(book_reviews);
  }
});

module.exports.general = public_users;
