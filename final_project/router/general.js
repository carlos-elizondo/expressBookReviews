const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check username and password
    if (!username) return res.status(404).send("The username is missing");
    if (!password) return res.status(404).send("The password is missing");

    if (isValid(username)) {
        users.push({ username: username, password: password });
        res.send("You have registered successfully!");
    } else {
        res.status(404).send("This username is already registered.");
    }
});

async function getBooks() {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(JSON.stringify(books, null, 4));
        } else {
            reject(new Error("There are no books in the database."));
        }
    });
}

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    try {
        const booksToGet = await getBooks();
        res.send(booksToGet);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

async function retrieveBookWith(isbn) {
    return new Promise((resolve, reject) => {
        if (isbn) {
            const bookToRetrieveByIsbn = books[isbn];
            if (bookToRetrieveByIsbn) {
                resolve(JSON.stringify(bookToRetrieveByIsbn, null, 4));
            } else {
                reject(new Error("A book with this ISBN could not be found."));
            }
        } else {
            reject(new Error("The isbn is missing"));
        }
    });
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const bookToRetrieveByIsbn = await retrieveBookWith(isbn);
        res.send(bookToRetrieveByIsbn);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

async function getBookByAuthor(author) {
    new Promise((resolve, reject) => {
        if (author) {
            const isbnKey = Object.keys(books).find(
                (key) =>
                    books[key].author.toLocaleLowerCase() ===
                    author.toLocaleLowerCase(),
            );

            const bookToRetrieveByAuthor = books[isbnKey];
            if (bookToRetrieveByAuthor) {
                resolve(JSON.stringify(bookToRetrieveByAuthor));
            } else {
                reject(new Error("This author could not be found"));
            }
        } else {
            reject(new Error("The author is missing"));
        }
    });
}

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
    const author = req.params.author;
    try {
        const book = getBookByAuthor(author);
        res.send(book);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

async function getBookByTitle(title) {
    return new Promise((resolve, reject) => {
        if (title) {
            const isbnKey = Object.keys(books).find(
                (key) =>
                    books[key].title.toLocaleLowerCase() ===
                    title.toLocaleLowerCase(),
            );

            const bookToRetrieveByTitle = books[isbnKey];
            if (bookToRetrieveByTitle) {
                resolve(JSON.stringify(bookToRetrieveByTitle));
            } else {
                reject(new Error("This title could not be found"));
            }
        } else {
            reject(new Error("The title is missing"));
        }
    });
}

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    const title = req.params.title;
    try {
        const book = await getBookByTitle(title);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    if (isbn) {
        const bookToRetrieveByIsbn = books[isbn];
        if (bookToRetrieveByIsbn) {
            const reviewsOfTheBook = bookToRetrieveByIsbn.reviews;
            res.send(JSON.stringify(reviewsOfTheBook, null, 4));
        } else {
            res.status(403).send("A book with this ISBN could not be found.");
        }
    } else {
        res.status(403).send("The isbn is missing");
    }
});

module.exports.general = public_users;
