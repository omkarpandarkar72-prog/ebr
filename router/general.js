const express = require('express');
const axios = require('axios');
const public_users = express.Router();

// Task 10: Get the list of all books available in the shop
// Retrieves the full book catalog from the local booklist endpoint using async/await + Axios
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
// ISBN is used as the key in the books object, so we can look it up directly
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    // Direct key lookup since books are stored keyed by ISBN
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
// Filters all books whose 'author' field matches the requested author (case-insensitive)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    // Build a new object containing only books written by the matching author
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
// Filters all books whose 'title' field matches the requested title (case-insensitive)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;

    // Build a new object containing only books that match the given title
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
