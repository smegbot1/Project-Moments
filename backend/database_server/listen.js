const app = require("./server");
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log("listening on port 9090"));
