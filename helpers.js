const { urlDatabase, users } = require("./data");

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

const urlsForUser = function(id) {
  let filteredURLs = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      filteredURLs[key] = urlDatabase[key];
    }
  }
  return filteredURLs;
}

const getUserByEmail = function(email, database) {
  // Loop through each user in the database
  for (let userID in users) {
    // Check if the email matches the current user's email
    if (users[userID].email === email) {
      // If a match is found, return the user
      return users[userID];
    }
  }
  // If no match is found, return undefined
  return undefined;
};

module.exports = { generateRandomString, urlsForUser, getUserByEmail };
