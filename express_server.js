// Import the express library/module
const express = require("express");
const cookieParser = require("cookie-parser");

// Create a new instance of an Express application
const app = express();

// Define the port number the server will listen on
const PORT = 8080; // Default port 8080

app.set("view engine", "ejs"); // tells the Express app to use EJS as its templating engine

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const generateRandomString = function () {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Define a route handler for GET requests to the root URL ("/")
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Define a route handler for GET requests to "/urls.json"
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); // Send the `urlDatabase` object as JSON
});

// Define a route handler for GET requests to "/hello"
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Define a route handler for GET requests to "/urls"
app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { urls: urlDatabase, user: user };
  res.render("urls_index", templateVars);
});

// Define a route handler for POST requests to "/urls"
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

// Define a route handler for GET requests to "/urls/new"
app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { user: user };
  res.render("urls_new", templateVars);
});

// Define a route handler for GET requests to "/urls/:id"
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const user = users[req.cookies["user_id"]];
  const templateVars = { id, longURL, user: user };
  res.render("urls_show", templateVars);
});

// Define a route handler for GET requests to "/u/:id"
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

// Define a route handler for POST requests to "/urls/:id/delete"
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

// Define a route handler for POST requests to "/urls/:id"
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  res.redirect("/urls");
});

// Define a route handler for POST requests to "/login"
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = Object.values(users).find((user) => user.email === email);

  if (user && user.password === password) {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  } else {
    res.status(400).send("Invalid email or password");
  }
});

// Define a route handler for POST requests to "/logout"
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Define a route handler for GET requests to "/register"
app.get("/register", (req, res) => {
  res.render("register");
});

// Define a route handler for POST requests to "/register"
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Check if email or password is empty
  if (!email || !password) {
    return res.status(400).send("Email and password cannot be empty");
  }

  // Check if the email already exists in users object
  const existingUser = Object.values(users).find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).send("Email already exists");
  }

  // If both conditions pass, proceed with user registration
  const userID = generateRandomString();
  users[userID] = {
    id: userID,
    email: email,
    password: password,
  };
  res.cookie("user_id", userID);
  res.redirect("/urls");
});

// Start the Express server and make it listen for incoming connections on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
