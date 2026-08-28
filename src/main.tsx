import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { getDB, seedDefaults } from "./db/schema";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

function StartupError() {
  return (
    <main className="product-organic flex min-h-screen items-center justify-center bg-surface p-6 text-on-surface">
      <section className="max-w-md rounded-[2rem] border border-danger bg-card p-6 text-center shadow-xl">
        <h1 className="text-xl font-bold tracking-[-0.035em]">Tracklet ne peut pas démarrer</h1>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-muted">
          Le stockage local est indisponible. Vérifiez les autorisations du navigateur puis rechargez la page.
        </p>
        <button
          className="mt-5 min-h-12 rounded-2xl bg-danger px-4 font-semibold text-on-primary hover:bg-[#6F2D1C]"
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
