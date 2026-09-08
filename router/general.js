const express = require('express');
const axios = require('axios');
const public_users = express.Router();

// Task 10: Get the list of all books available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving books',
      error: error.message
    });
  }
});

// Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    // Look up the book directly by its ISBN key
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    }
    return res.status(404).json({
      message: `No book found with ISBN '${isbn}'.`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving book by ISBN',
      error: error.message
    });
  }
});

// Task 12: Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    // Filter books whose author matches (case-insensitive)
    const matchingBooks = Object.keys(books)
      .filter((isbn) => books[isbn].author.toLowerCase() === author.toLowerCase())
      .reduce((acc, isbn) => {
        acc[isbn] = books[isbn];
        return acc;
      }, {});

    if (Object.keys(matchingBooks).length > 0) {
      return res.status(200).json(matchingBooks);
    }
    return res.status(404).json({
      message: `No books found for author '${author}'.`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving books by author',
      error: error.message
    });
  }
});

// Task 13: Get book details based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    // Filter books whose title matches (case-insensitive)
    const matchingBooks = Object.keys(books)
      .filter((isbn) => books[isbn].title.toLowerCase() === title.toLowerCase())
      .reduce((acc, isbn) => {
        acc[isbn] = books[isbn];
        return acc;
      }, {});

    if (Object.keys(matchingBooks).length > 0) {
      return res.status(200).json(matchingBooks);
    }
    return res.status(404).json({
      message: `No books found with title '${title}'.`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving books by title',
      error: error.message
    });
  }
});

module.exports.general = public_users;
