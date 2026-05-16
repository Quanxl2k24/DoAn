import app from "./app";
import { pool } from "./config/database";

const PORT = 3000;

app.listen(PORT, () => {
  pool
    .connect()
    .then(() => {
      console.log("Connected PostgreSQL");
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(`Server running on port ${PORT}`);
});
