const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "Carlos", password: "Carlos" },
    { username: "Sammy", password: "Sammy" },
];

const isValid = (username) => {
    //returns boolean
    return (foundUsername = users.find((user) => user.username === username));
};

const authenticatedUser = (username, password) => {
    const foundUser = users.find((user) => user.username === username);
    return foundUser && foundUser.password == password;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    oneHour = 60 * 60;

    // Check username and password
    if (!username) return res.status(404).send("The username is missing");
    if (!password) return res.status(404).send("The password is missing");

    if (!isValid(username))
        return res.status(404).send("There is no user with this username.");

    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign(
            {
                data: password,
            },
            "access",
            { expiresIn: oneHour },
        );
        // Store access token and username in session
        req.session.authorization = {
            accessToken,
            username,
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res
            .status(208)
            .json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!username) return res.status(400).send("Invalid session.");
    if (!isbn) return res.status(400).send("The ISBN is missing.");
    if (!review) return res.status(400).send("The review is missing.");

    if (!books[isbn]) {
        return res.status(404).send("Book not found.");
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.send("You have successfully left a review.");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;

    if (!username) return res.status(400).send("Invalid session.");
    if (!isbn) return res.status(400).send("The ISBN is missing.");

    if (!books[isbn]) {
        return res.status(404).send("Book not found.");
    }
    delete books[isbn].reviews[username];
    res.send("You have successfully deleted your review.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
