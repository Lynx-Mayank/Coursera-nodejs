```javascript
const express = require("express");
const axios = require("axios");

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Check whether a user already exists
const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({
      message: "Unable to register user."
    });
  }

  if (doesExist(username)) {
    return res.status(404).json({
      message: "User already exists!"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
});


// --------------------------------------------------
// BASIC ROUTES
// --------------------------------------------------

// Get all books
public_users.get("/", (req, res) => {
  res.json(books);
});

// Get book by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const book = Object.values(books).filter(
    (book) => book.isbn === isbn
  );

  if (book.length > 0) {
    return res.json(book);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

// Get books by author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;

  const book = Object.values(books).filter(
    (book) => book.author === author
  );

  if (book.length > 0) {
    return res.json(book);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

// Get books by title
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;

  const book = Object.values(books).filter(
    (book) => book.title === title
  );

  if (book.length > 0) {
    return res.json(book);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

// Get reviews for a book
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const book = Object.values(books).find(
    (book) => book.isbn === isbn
  );

  if (book) {
    return res.json(book.reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


// --------------------------------------------------
// ASYNC/AWAIT + AXIOS ROUTES
// --------------------------------------------------

// Get all books using Axios and async/await
public_users.get("/get_async", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/"
    );

    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve books",
      error: error.message
    });
  }
});

// Get book by ISBN using Axios and async/await
public_users.get("/isbn_async/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;

    const response = await axios.get(
      `http://localhost:5000/isbn/${isbn}`
    );

    return res.json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
});

// Get books by author using Axios and async/await
public_users.get("/author_async/:author", async (req, res) => {
  try {
    const author = req.params.author;

    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
    );

    return res.json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
});

// Get books by title using Axios and async/await
public_users.get("/title_async/:title", async (req, res) => {
  try {
    const title = req.params.title;

    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`
    );

    return res.json(response.data);
  } catch (error) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
});


module.exports.general = public_users;
```
