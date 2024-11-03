// Import packages
import express from 'express';
import apiRouter from './routes/api.js';
// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/api", apiRouter);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));

export default app