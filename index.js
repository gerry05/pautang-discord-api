// Import packages
const express = require("express");
const apiRoute = require("./routes/api");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/api", apiRoute);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));

export default app