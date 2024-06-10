import express from "express";
import expressBasicAuth from "express-basic-auth";
const basicAuth = expressBasicAuth();
const app = express();

// basic usage
app.use(
  basicAuth({
    users: { admin: "supersecret" },
  })
);

// custom authorization
app.use(
  basicAuth({
    authorizer: (username, password) => {
      const userMatches = basicAuth.safeCompare(username, "admin");
      const passwordMatches = basicAuth.safeCompare(password, "supersecret");
      return userMatches & passwordMatches;
    },
  })
);

// Async Authorization
app.use(
  basicAuth({
    authorizer: (username, password, cb) => {
      const userMatches = basicAuth.safeCompare(username, "admin");
      const passwordMatches = basicAuth.safeCompare(password, "supersecret");
      if (userMatches & passwordMatches) {
        return cb(null, true);
      } else {
        return cb(null, false);
      }
    },
    authorizeAsync: true,
  })
);

// Unauthorized Response Body
// We can set the unauthorizedResponse property to a function that returns a response that we want to show when a credential check failed.
app.use(
  basicAuth({
    users: { admin: "supersecret" },
    unauthorizedResponse: (req) => {
      return `unauthorized. ip: ${req.ip}`;
    },
  })
);

// challenge
// We can make browsers show a popup so that users can enter credentials for authentication by add a challenge: true option to the object.
// In addition, we set the realm to identify the system to authenticate against and can be used to save credentials of the challenge by passing a static or a function that gets passed the request object and is expected to return the challenge:

app.use(
  basicAuth({
    users: { admin: "supersecret" },
    challenge: true,
    realm: "floo",
  })
);

// Endpoints
app.get("/", (req, res) => {
  res.send("Protected route with Basic HTTP Authentication");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
