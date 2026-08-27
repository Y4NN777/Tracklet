import { useState } from "react";
import { HashRouter, Navigate, Routes, Route } from "react-router-dom";
import type { Realm } from "./types";
import { Layout } from "./components/Layout";
import { ToastProvider } from "./components/Toast";
import { Dashboard } from "./pages/Dashboard";
import { Pockets } from "./pages/Pockets";
import { PocketDetail } from "./pages/PocketDetail";
import { Transactions } from "./pages/Transactions";
import { Debts } from "./pages/Debts";
import { Goals } from "./pages/Goals";
import { Sales } from "./pages/Sales";
import { Reports } from "./pages/Reports";
import { CashPosition } from "./pages/CashPosition";
import { Settings } from "./pages/Settings";
import { Landing } from "./pages/Landing";

function App() {
  const [realm, setRealm] = useState<Realm>(() => {
    try {
      return localStorage.getItem("tracklet-realm") === "business" ? "business" : "personal";
    } catch {
      return "personal";
    }
  });

  const changeRealm = (nextRealm: Realm) => {
    setRealm(nextRealm);
    try { localStorage.setItem("tracklet-realm", nextRealm); } catch { /* optional preference */ }
  };

  return (
    <HashRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout realm={realm} onRealmChange={changeRealm} />}>
            <Route path="/dashboard" element={<Dashboard realm={realm} />} />
            <Route path="/pockets" element={<Pockets realm={realm} />} />
            <Route path="/pockets/:id" element={<PocketDetail realm={realm} />} />
            <Route path="/transactions" element={<Transactions realm={realm} />} />
            <Route path="/debts" element={<Debts realm={realm} />} />
            <Route path="/goals" element={<Goals realm={realm} />} />
            <Route path="/sales" element={<Sales realm={realm} />} />
            <Route path="/reports" element={<Reports realm={realm} />} />
            <Route path="/cash-position" element={<CashPosition realm={realm} />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </HashRouter>
  );
}

export default App;
