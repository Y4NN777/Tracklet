import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryState { error: Error | null }

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Tracklet render failure", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="product-organic flex min-h-svh items-center justify-center bg-surface p-6">
        <div className="max-w-md rounded-[2rem] border border-danger bg-card p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-danger">Erreur locale</p>
          <h1 className="mt-2 text-xl font-bold tracking-[-0.035em] text-on-surface">Tracklet n’a pas pu afficher cette page</h1>
          <p className="mt-2 text-sm text-on-surface-muted">
            Vos données restent sur l’appareil. Rechargez l’application ou restaurez une sauvegarde depuis les réglages.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 min-h-12 rounded-2xl bg-primary px-4 text-sm font-semibold text-on-primary"
          >
            Recharger
          </button>
        </div>
      </main>
    );
  }
}
