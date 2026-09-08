
const express = require('express');
const axios = require('axios');

const public_users = express.Router();

// Get all books
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving books'
        });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get('http://localhost:5000/');
        const books = response.data;

        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        }

        return res.status(404).json({
            message: `No book found with ISBN '${isbn}'.`
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving book'
        });
    }
});


// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const response = await axios.get('http://localhost:5000/');
        const books = response.data;

        const matchingBooks = Object.keys(books)
            .filter((isbn) =>
                books[isbn].author.toLowerCase() === author.toLowerCase()
            )
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
            message: 'Error retrieving books'
        });
    }
});


// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const response = await axios.get('http://localhost:5000/');
        const books = response.data;

        const matchingBooks = Object.keys(books)
            .filter((isbn) =>
                books[isbn].title.toLowerCase() === title.toLowerCase()
            )
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
            message: 'Error retrieving books'
        });
    }
});


module.exports.general = public_users;
