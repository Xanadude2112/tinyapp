// Import the express library/module
const express = require("express");
const cookieParser = require("cookie-parser");

// Create a new instance of an Express application
const app = express();

// Define the port number the server will listen on
const PORT = 8080; // Default port 8080

app.set("view engine", "ejs"); // tells the Express app to use EJS as its templating engine

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "Dgv5tk",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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

const generateRandomString = function() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function urlsForUser(id) {
  let filteredURLs = {};
  for(let key in urlDatabase) {
    if(urlDatabase[key].userID === id) {
      filteredURLs[key] = urlDatabase[key];
    }
  }
  return filteredURLs;
}

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
  const userID = req.cookies["user_id"];
  const user = users[userID];
  if(!user) {
    return res.status(401).send("<html><body><h1>Unauthorized</h1><p>You need to register or be logged in to view URLs.</p><a href='http://localhost:8080/login' style='text-decoration: none; font-weight: 600;'>LOG IN</a></body></html>");
  }
  //call urlsForUser with ID and obtain the filtered URLS
  const userURLs = urlsForUser(userID);

  //update templateVars with filtered URLs
  const templateVars = { urls: userURLs, user: user };
  //render the page with filtered URLs for the logged-in user
  res.render("urls_index", templateVars);
});

// Define a route handler for POST requests to "/urls"
app.post("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]];
  // Check if the user is not logged in before doing any other logic.
  if (!user) {
    // Immediately send a response and return to stop further execution.
    return res.status(401).send("<html><body><h1>Unauthorized</h1><p>You need to be logged in to shorten URLs.</p><a href='http://localhost:8080/login' style='text-decoration: none; font-weight: 600;'>LOG IN</a></body></html>");
  } else {
  // If the execution reaches here, it means the user is logged in.
    const longURL = req.body.longURL;
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = { longURL: longURL, userID: user.id }; // Move adding to the database here, inside the logged-in check.

    res.redirect(`/urls/${shortURL}`);
  }
});

// Define a route handler for GET requests to "/urls/new"
app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { user: user };
  if (!user) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

// Define a route handler for GET requests to "/urls/:id"
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  const userID = req.cookies["user_id"];
  const user = users[userID];
//if you are not logged in you will be denied access to My URLs
  if(!user) {
    return res.status(401).send("<html><body><h1>Unauthorized</h1><p>You need to be logged in to shorten URLs.</p><a href='http://localhost:8080/login' style='text-decoration: none; font-weight: 600;'>LOG IN</a></body></html>");
  }
//you cannot use the Short URL from someone elses account
  if(userID !== urlDatabase[id].userID){
    return res.status(401).send("<html><body><h1>Forbidden</h1><p>You cannot use the Short URL of another user. Please create / use your own.</p><a href='http://localhost:8080/urls/new' style='text-decoration: none; font-weight: 600;'>USE YOUR OWN</a></body></html>")
  }
  const templateVars = { id, longURL, user: user };
  res.render("urls_show", templateVars);
});

// Define a route handler for GET requests to "/u/:id"
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  if (!longURL) {
    return res.status(404).send("<html><body><h1>Unregistered</h1><p>This ID is not a registered Short ID.</p></body></html>");
  }
  res.redirect(longURL);
});

// Define a route handler for POST requests to "/urls/:id/delete"
app.post("/urls/:id/delete", (req, res) => {
  const userID = req.cookies["user_id"];
  const id = req.params.id;

  //Check if the ID exists in the database
  if(!urlDatabase[id]){
    return res.status(404).send("<html><body><h1>URL not found.</h1><a href='http://localhost:8080/urls' style='text-decoration: none; font-weight: 600;'>GO BACK</a></body></html>")
  }

  //Check if the user is logged in
  if (!userID) {
    return res.status(401).send("<html><body><h1>Unauthorized</h1><p>You need to be logged in to delete URLs.</p><a href='http://localhost:8080/login' style='text-decoration: none; font-weight: 600;'>LOGIN</a></body></html>")
  }

  if(urlDatabase[id].userID !== userID) {
    return res.status(403).send("<html><body><h1>Forbidden</h1><p>You don't have permission to delete this URL.</p><a href='http://localhost:8080/urls' style='text-decoration: none; font-weight: 600;'>GO BACK</a></body></html>")
  }
  //if all checks pass, delete the URL from the database
  delete urlDatabase[id];
  res.redirect("/urls");
});

// Define a route handler for POST requests to "/urls/:id"
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id].longURL = req.body.longURL; // Update only the longURL property
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { user: user, error: null }; // Initialize error as null
  if (user) {
    res.redirect("/urls");
  } else {
    res.render("login", templateVars);
  }
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
    res.status(403).send("Invalid email or password");
  }
});

// Define a route handler for POST requests to "/logout"
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

// Define a route handler for GET requests to "/register"
app.get("/register", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { user: user, error: null }; // Initialize error as null
  if (user) {
    res.redirect("/urls");
  } else {
    res.render("register", templateVars);
  }
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
  const existingUser = Object.values(users).find(
    (user) => user.email === email
  );
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
