import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { getDB, seedDefaults } from "./db/schema";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

function StartupError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <section className="max-w-md rounded-2xl border border-red-500/30 bg-slate-900 p-6 text-center shadow-xl">
        <h1 className="text-xl font-semibold">Tracklet ne peut pas démarrer</h1>
        <p className="mt-3 text-sm text-slate-300">
          Le stockage local est indisponible. Vérifiez les autorisations du navigateur puis rechargez la page.
        </p>
        <button
          className="mt-5 rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-400"
          type="button"
          onClick={() => window.location.reload()}
        >
          Recharger
        </button>
      </section>
    </main>
  );
}

async function bootstrap() {
  const db = await getDB();
  await seedDefaults(db);
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ErrorBoundary><App /></ErrorBoundary>
    </StrictMode>,
  );
}

bootstrap().catch((error) => {
  console.error("Tracklet startup failure", error);
  const root = document.getElementById("root");
  if (root) createRoot(root).render(<StartupError />);
});
