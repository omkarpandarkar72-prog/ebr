const axios = require("axios");

async function getAllBooks() {
    try {
        const response = await axios.get("http://localhost:5000/books");
        console.log(response.data);
    } catch (error) {
        console.error(error.message);
    }
}

async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log(response.data);
    } catch (error) {
        console.error(error.message);
    }
}

async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );
        console.log(response.data);
    } catch (error) {
        console.error(error.message);
    }
}

async function getBooksByTitle(title) {
    try {
        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );
        console.log(response.data);
    } catch (error) {
        console.error(error.message);
    }
}

getAllBooks();
getBookByISBN("9780141439518");
getBooksByAuthor("Jane Austen");
getBooksByTitle("Pride and Prejudice");
