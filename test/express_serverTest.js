const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Login and Access Control Test", () => {
  it('should return 403 status code for unauthorized access to "http://localhost:8080/urls/b6UTxQ"', () => {
    const agent = chai.request.agent("http://localhost:8080");

    // Step 1: Login with valid credentials
    return agent
      .post("/login")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then((loginRes) => {
        // Step 2: Make a GET request to a protected resource
        return agent.get("/urls/b6UTxQ").then((accessRes) => {
          // Step 3: Expect the status code to be 403
          expect(accessRes).to.have.status(403);
        });
      });
  });

  it('should redirect the user to "http://localhost:8080/login" if they are not logged in', () => {
    const agent = chai.request.agent("http://localhost:8080");

    return agent
      .get("/")
      .then((res) => {
        //Expect redirection to /login
        expect(res).to.redirectTo("http://localhost:8080/login");
      });
  });

  it('should redirect the user to "http://localhost:8080/login" if they are not logged in', () => {
    const agent = chai.request.agent("http://localhost:8080");

    return agent
      .get("/urls/new")
      .then((res) => {
        //Expect redirection to /login
        expect(res).to.redirectTo("http://localhost:8080/login");
      });
  });

  it('should show the user a 403 error message if they are not logged in while trying to access an id', () => {
    const agent = chai.request.agent("http://localhost:8080");

    return agent
      .get("/urls/b6UTxQ")
      .then((res) => {
        //Expect 403 status code
        expect(res).to.have.status(403);
      });
  });

  it('should show the user a 404 error message if the id is invalid (URL does not exist)', () => {
    const agent = chai.request.agent("http://localhost:8080");

    return agent
      .get("/urls/invalidID")
      .then((res) => {
        //Expect 404 status code
        expect(res).to.have.status(404);
      });
  });
});