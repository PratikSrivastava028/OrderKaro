import app from "./app.js";
import { connectDB } from "./src/config/database.config.js";
import { PORT } from "./src/config/index.js";

connectDB()
  .then(() => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log("Error starting server:", err);
        process.exit(1);
      }
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
    process.exit(1);
  });
