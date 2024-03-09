const { assert } = require("chai");
const { getUserByEmail } = require("../helpers");
const { users } = require("../data");

describe('getUserByEmail', function() {

  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", users);
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID);
  });

  it('should return undefined if a user with an invalid email is used', function() {
    const user = getUserByEmail("invalid@example.com", users);
    assert.isUndefined(user);
  });

});