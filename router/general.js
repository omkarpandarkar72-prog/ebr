const express = require("express");
let books = require("./booksdb.js");
let { isValid, users } = require("./auth_users.js");
const axios = require("axios");

const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// ============================================================
// REGISTER USER
// ============================================================

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({
      message: "Username and password are required."
    });
  }

  if (isValid(username)) {
    users.push({
      username: username,
      password: password
    });

    return res.status(200).json({
      message: "User successfully registered. Now you can login."
    });
  }

  return res.status(404).json({
    message: "User already exists!"
  });
});

// ============================================================
// GET ALL BOOKS
// ============================================================

public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

// ============================================================
// GET BOOK BY ISBN
// ============================================================

public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  }

  return res.status(404).json({
    message: `Book with ISBN ${isbn} not found.`
  });
});

// ============================================================
// GET BOOKS BY AUTHOR
// ============================================================

public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;

  const matchingBooks = Object.keys(books)
    .filter((isbn) => {
      return (
        books[isbn].author &&
        books[isbn].author.toLowerCase() === author.toLowerCase()
      );
    })
    .reduce((result, isbn) => {
      result[isbn] = books[isbn];
      return result;
    }, {});

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  }

  return res.status(404).json({
    message: `No books found for author '${author}'.`
  });
});

// ============================================================
// GET BOOKS BY TITLE
// ============================================================

public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;

  const matchingBooks = Object.keys(books)
    .filter((isbn) => {
      return (
        books[isbn].title &&
        books[isbn].title.toLowerCase() === title.toLowerCase()
      );
    })
    .reduce((result, isbn) => {
      result[isbn] = books[isbn];
      return result;
    }, {});

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  }

  return res.status(404).json({
    message: `No books found with title '${title}'.`
  });
});

// ============================================================
// GET BOOK REVIEW
// ============================================================

public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews || {});
  }

  return res.status(404).json({
    message: `Book with ISBN ${isbn} not found.`
  });
});

// ============================================================
// AXIOS - GET ALL BOOKS
// Promise Callback
// ============================================================

function getAllBooksPromise() {
  return axios
    .get(`${BASE_URL}/`)
    .then((response) => {
      console.log("All books (Promise):", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error fetching all books:",
        error.message
      );
      throw error;
    });
}

// ============================================================
// AXIOS - GET BOOK BY ISBN
// Async/Await
// ============================================================

async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(
      `${BASE_URL}/isbn/${encodeURIComponent(isbn)}`
    );

    console.log(
      `Book with ISBN ${isbn} (async/await):`,
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      `Error fetching book with ISBN ${isbn}:`,
      error.message
    );

    throw error;
  }
}

// ============================================================
// AXIOS - GET BOOKS BY AUTHOR
// Promise Callback
// ============================================================

function getBooksByAuthor(author) {
  return axios
    .get(
      `${BASE_URL}/author/${encodeURIComponent(author)}`
    )
    .then((response) => {
      console.log(
        `Books by author '${author}' (Promise):`,
        response.data
      );

      return response.data;
    })
    .catch((error) => {
      console.error(
        `Error fetching books by author '${author}':`,
        error.message
      );

      throw error;
    });
}

// ============================================================
// AXIOS - GET BOOKS BY TITLE
// Async/Await
// ============================================================

async function getBooksByTitle(title) {
  try {
    const response = await axios.get(
      `${BASE_URL}/title/${encodeURIComponent(title)}`
    );

    console.log(
      `Books with title '${title}' (async/await):`,
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      `Error fetching books with title '${title}':`,
      error.message
    );

    throw error;
  }
});

// ============================================================
// EXPORTS
// ============================================================

module.exports.general = public_users;

module.exports.getAllBooksPromise =
  getAllBooksPromise;

module.exports.getBookByISBN =
  getBookByISBN;

module.exports.getBooksByAuthor =
  getBooksByAuthor;

module.exports.getBooksByTitle =
  getBooksByTitle;
