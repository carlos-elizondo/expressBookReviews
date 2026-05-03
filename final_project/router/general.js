const express = require("express");
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

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    //Write your code here
    const booksToGet = books;
    if (booksToGet) {
        res.send(JSON.stringify(booksToGet, null, 4));
    } else {
        res.status(404).send("There are not books in the database.");
    }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    if (isbn) {
        const bookToRetrieveByIsbn = books[isbn];
        if (bookToRetrieveByIsbn) {
            res.send(JSON.stringify(bookToRetrieveByIsbn, null, 4));
        } else {
            res.status(403).send("A book with this ISBN could not be found.");
        }
    } else {
        res.status(403).send("The isbn is missing");
    }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author;
    if (author) {
        const isbnKey = Object.keys(books).find(
            (key) =>
                books[key].author.toLocaleLowerCase() ===
                author.toLocaleLowerCase(),
        );

        const bookToRetrieveByAuthor = books[isbnKey];
        if (bookToRetrieveByAuthor) {
            res.send(JSON.stringify(bookToRetrieveByAuthor));
        } else {
            res.status(403).send("This author could not be found");
        }
    } else {
        res.status(403).send("The author is missing");
    }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title;
    if (title) {
        const isbnKey = Object.keys(books).find(
            (key) =>
                books[key].title.toLocaleLowerCase() ===
                title.toLocaleLowerCase(),
        );

        const bookToRetrieveByTitle = books[isbnKey];
        if (bookToRetrieveByTitle) {
            res.send(JSON.stringify(bookToRetrieveByTitle));
        } else {
            res.status(403).send("This title could not be found");
        }
    } else {
        res.status(403).send("The title is missing");
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
