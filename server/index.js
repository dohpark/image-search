const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "../src")));

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "../src/index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
