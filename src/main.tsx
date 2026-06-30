import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { getDB, seedDefaults } from "./db/schema";
import App from "./App";
import "./index.css";

// Initialize IndexedDB + seed default categories
(async () => {
  const db = await getDB();
  await seedDefaults(db);
  console.log("Tracklet DB ready");
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
