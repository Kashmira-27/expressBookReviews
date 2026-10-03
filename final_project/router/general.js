const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: "User successfully registered"
  });
});


// Get all books using Axios and async/await
public_users.get('/', async function (req, res) {

  try {

    const response = await axios.get('http://localhost:5000/books');

    res.status(200).json(response.data);

  } catch (error) {

    res.status(500).json({
      message: "Error retrieving books"
    });

  }

});


// Internal route used by Axios
public_users.get('/books', function (req, res) {

  res.status(200).json(books);

});


// Get book details based on ISBN using Axios
public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  try {

    const response = await axios.get('http://localhost:5000/books');

    const booksData = response.data;

    if (booksData[isbn]) {

      res.status(200).json(booksData[isbn]);

    } else {

      res.status(404).json({
        message: "Book not found"
      });

    }

  } catch (error) {

    res.status(500).json({
      message: "Error retrieving book"
    });

  }

});


// Get books based on author using Axios
public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  try {

    const response = await axios.get('http://localhost:5000/books');

    const booksData = response.data;
    const result = {};

    Object.keys(booksData).forEach((isbn) => {

      if (booksData[isbn].author === author) {
        result[isbn] = booksData[isbn];
      }

    });

    if (Object.keys(result).length > 0) {

      res.status(200).json(result);

    } else {

      res.status(404).json({
        message: "No books found for this author"
      });

    }

  } catch (error) {

    res.status(500).json({
      message: "Error retrieving books"
    });

  }

});


// Get books based on title using Axios
public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  try {

    const response = await axios.get('http://localhost:5000/books');

    const booksData = response.data;
    const result = {};

    Object.keys(booksData).forEach((isbn) => {

      if (booksData[isbn].title === title) {
        result[isbn] = booksData[isbn];
      }

    });

    if (Object.keys(result).length > 0) {

      res.status(200).json(result);

    } else {

      res.status(404).json({
        message: "No books found for this title"
      });

    }

  } catch (error) {

    res.status(500).json({
      message: "Error retrieving books"
    });

  }

});


// Get book review
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {

    res.status(200).json(books[isbn].reviews);

  } else {

    res.status(404).json({
      message: "Book not found"
    });

  }

});


module.exports.general = public_users;