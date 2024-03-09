// store data from express_server.js for easier access to helper.js file
const urlDatabase = {
  b6UTxQ: { // id
    longURL: "https://www.tsn.ca",
    userID: "user2RandomID",
  },
  i3BoGr: { // id
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

module.exports = { urlDatabase, users };