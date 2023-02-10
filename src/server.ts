import app from "./app";
import AppDataSource from "./data-source";

(async () => {
  await AppDataSource.initialize().catch((error) => {
    console.error("Error during DataSource initialization.", error);
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log("Server running at port", PORT);
  });
})();
