// Import the express library/module
const express = require("express");
const cookieParser = require('cookie-parser');

// Create a new instance of an Express application
const app = express();

// Define the port number the server will listen on
const PORT = 8080; // Default port 8080

app.set("view engine", "ejs"); // tells the Express app to use EJS as its templating engine

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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

//Middleware to parse cookies
app.use(cookieParser());

// Define a database object that maps short URLs to their corresponding long URLs

app.use(express.urlencoded({ extended: true }));
// Define a route handler for GET requests to the root URL ("/")
// req holds details about the client's request, including parameters, headers, cookies, etc.

// res sends responses back to the client's browser, containing data such as HTML, JSON, files, or strings.
app.get("/", (req, res) => {
  // Send the response "Hello!" to the client
  res.send("Hello!");
});

// Handle GET requests to "/urls.json"
app.get("/urls.json", (req, res) => {
  // When a client/browser requests "/urls.json", the server responds by sending the `urlDatabase` object as JSON data.
  // The server uses the `res` object's `json()` method to send the JSON response back to the client.
  // This method automatically sets the appropriate Content-Type header to indicate that the response is in JSON format.
  res.json(urlDatabase); //converts the urlDatabase object into a JSON string
});

// Handle GET requests to "/hello"
app.get("/hello", (req, res) => {
  // When a client/browser requests "/hello", the server responds by sending an HTML page containing the text "Hello <b>World</b>"
  // The server uses the `res` object's `send()` method to send the HTML response back to the client.
  // This method sets the Content-Type header to indicate that the response is HTML.
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  // Create an object `templateVars` containing the `urlDatabase` data
  // This object will be used to pass data to the template (view) for rendering
  const templateVars = { urls: urlDatabase,
  username: req.cookies["username"] };
  // Render the "urls_index" template using the provided template variables
  // The `urls_index` template will use the data in `templateVars` to dynamically generate HTML
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL; // Extracting the long URL from the request body
  const shortURL = generateRandomString(); // Generating a unique short identifier
  urlDatabase[shortURL] = longURL; // Saving the mapping to your "database"
  res.redirect(`/urls/${shortURL}`); // Redirecting to view the new short URL
});

app.get("/urls/new", (req, res) => {
const templateVars = {
  username: req.cookies["username"]
}
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id; // Getting the short URL id from the URL parameter
  const longURL = urlDatabase[id]; // Looking up the corresponding long URL
  if (longURL) {
    const templateVars = { id, longURL , username: req.cookies["username"]}; // Preparing variables for the template
    res.render("urls_show", templateVars); // Rendering the template with our variables
  } else {
    res.status(404).send("Short URL does not exist");
  }
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls');
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  res.redirect('/urls');
});

// POST route handler for /login
app.post("/login", (req, res) => {
  const { username } = req.body;// Extract username from request body
  if(username){
    // Set cookie named username with the submitted value
    res.cookie('username', username);
    // Redirect back to the /urls page
    res.redirect('/urls');
  } else {
    // Handle invalid username (optional)
    res.status(400).send('Invalid username');
  }
})

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
})


// Start the Express server and make it listen for incoming connections on the specified port
app.listen(PORT, () => {
  // Log a message to the console indicating that the server is listening on the specified port
  console.log(`Example app listening on port ${PORT}!`);
});
