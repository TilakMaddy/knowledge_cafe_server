const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {
  res.status(200).send("Hello")
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
