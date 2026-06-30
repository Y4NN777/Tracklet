import { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import type { Realm } from "./types";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Pockets } from "./pages/Pockets";
import { PocketDetail } from "./pages/PocketDetail";
import { Transactions } from "./pages/Transactions";
import { Debts } from "./pages/Debts";
import { Reports } from "./pages/Reports";

function App() {
  const [realm, setRealm] = useState<Realm>("personal");

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout realm={realm} onRealmChange={setRealm} />}>
          <Route path="/" element={<Dashboard realm={realm} />} />
          <Route path="/pockets" element={<Pockets realm={realm} />} />
          <Route path="/pockets/:id" element={<PocketDetail realm={realm} />} />
          <Route path="/transactions" element={<Transactions realm={realm} />} />
          <Route path="/debts" element={<Debts realm={realm} />} />
          <Route path="/reports" element={<Reports realm={realm} />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
