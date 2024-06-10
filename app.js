import express from "express";
const app = express();

app.use(express.json());

const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    let err = new Error("You are not authenticated!");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    return next(err);
  }

  const auth = new Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const user = auth[0];
  const pass = auth[1];

  if (user == "admin" && pass == "password") {
    // If Authorized user
    next();
  } else {
    let err = new Error("You are not authenticated!");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    return next(err);
  }
};

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/cities", (req, res) => {
  const cities = [
    {
      id: 1,
      name: "New York",
    },
    {
      id: 2,
      name: "Berlin",
    },
    {
      id: 3,
      name: "London",
    },

    res.json(cities),
  ];
});

app.get("/secrets", isAuth, (req, res) => {
  const secrets = [
    {
      id: 1,
      name: "Secret 1",
    },
    {
      id: 2,
      name: "Secret 2",
    },
  ];

  res.json(secrets);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
