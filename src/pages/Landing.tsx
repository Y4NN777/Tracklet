import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  FileDown,
  HandCoins,
  Leaf,
  LockKeyhole,
  Menu,
  ReceiptText,
  Smartphone,
  WalletCards,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark } from "../components/BrandMark";

const outcomes = [
  {
    icon: WalletCards,
    title: "Ce que vous pouvez utiliser",
    description: "Tracklet calcule la trésorerie disponible à partir des poches, dettes et créances actives.",
  },
  {
    icon: ReceiptText,
    title: "Ce que l’activité rapporte",
    description: "Les ventes créditent la bonne poche et sont comparées aux dépenses professionnelles.",
  },
  {
    icon: HandCoins,
    title: "Ce qui doit encore bouger",
    description: "Les sommes à payer et à recevoir restent visibles jusqu’à leur règlement.",
  },
];

const answers = [
  {
    question: "Combien puis-je réellement utiliser ?",
    answer: "La position de trésorerie réunit les soldes de vos poches, retire les engagements actifs et ajoute les créances attendues.",
    items: ["Espèces et Mobile Money", "Poches séparées par espace", "Transferts enregistrés des deux côtés"],
  },
  {
    question: "Mon activité gagne-t-elle de l’argent ?",
    answer: "Les ventes et les dépenses professionnelles alimentent un résultat mensuel lisible, sans mélanger les dépenses personnelles.",
    items: ["Ventes liées à une poche", "Dépenses professionnelles", "Résultat et marge du mois"],
  },
  {
    question: "Qu’est-ce qui doit entrer ou sortir ?",
    answer: "Les dettes et créances actives restent dans votre vue de trésorerie jusqu’à ce qu’elles soient réglées ou abandonnées.",
    items: ["Sommes empruntées", "Sommes prêtées", "Statuts de règlement"],
  },
  {
    question: "Comment garder mes données ?",
    answer: "Vos données vivent dans ce navigateur. Une sauvegarde JSON permet de les restaurer et les rapports peuvent être exportés en CSV.",
    items: ["Sauvegarde complète", "Restauration confirmée", "Exports CSV par période"],
  },
];

function scrollToSection(id: string) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

export function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openAnswer, setOpenAnswer] = useState<number | null>(0);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstMenuItem = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    firstMenuItem.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButton.current?.focus());
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const goTo = (id: string) => {
    setMenuOpen(false);
    window.requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <div className="landing-organic min-h-svh bg-[#E8DCC7] text-[#30351F]">
      <a
        href="#landing-main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("landing-main")?.focus();
        }}
        className="fixed left-3 top-3 z-[70] -translate-y-24 rounded-2xl bg-[#465024] px-4 py-3 text-sm font-semibold text-[#E8DCC7] focus:translate-y-0"
      >
        Aller au contenu
      </a>

      <header className="sticky top-0 z-50 border-b border-[#465024]/25 bg-[#E8DCC7]">
        <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <Link to="/" className="flex min-h-11 items-center gap-3" aria-label="Tracklet — accueil">
            <BrandMark className="h-10 w-10 shrink-0" />
            <span className="text-lg font-bold tracking-[-0.04em]">Tracklet</span>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex" aria-label="Navigation principale">
            <button type="button" onClick={() => goTo("pourquoi")} className="min-h-11 rounded-2xl px-4 text-sm font-medium hover:bg-[#D4B895]">
              Ce que ça clarifie
            </button>
            <button type="button" onClick={() => goTo("fonctionnement")} className="min-h-11 rounded-2xl px-4 text-sm font-medium hover:bg-[#D4B895]">
              Fonctionnement
            </button>
            <button type="button" onClick={() => goTo("confidentialite")} className="min-h-11 rounded-2xl px-4 text-sm font-medium hover:bg-[#D4B895]">
              Données locales
            </button>
            <Link to="/dashboard" className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[#465024] px-5 text-sm font-semibold text-[#E8DCC7] transition-colors duration-300 hover:bg-[#30351F]">
              Ouvrir Tracklet
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </nav>

          <button
            ref={menuButton}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-[#465024]/40 lg:hidden"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
          >
            {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <nav id="landing-mobile-menu" aria-label="Navigation mobile" className="border-t border-[#465024]/25 bg-[#E8DCC7] px-5 py-4 lg:hidden">
            <div className="mx-auto grid max-w-7xl gap-2">
              <button ref={firstMenuItem} type="button" onClick={() => goTo("pourquoi")} className="min-h-12 rounded-2xl px-4 text-left font-medium hover:bg-[#D4B895]">
                Ce que ça clarifie
              </button>
              <button type="button" onClick={() => goTo("fonctionnement")} className="min-h-12 rounded-2xl px-4 text-left font-medium hover:bg-[#D4B895]">
                Fonctionnement
              </button>
              <button type="button" onClick={() => goTo("confidentialite")} className="min-h-12 rounded-2xl px-4 text-left font-medium hover:bg-[#D4B895]">
                Données locales
              </button>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#465024] px-5 font-semibold text-[#E8DCC7]">
                Ouvrir Tracklet
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main id="landing-main" tabIndex={-1}>
        <section className="overflow-hidden px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20 lg:px-10">
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.04fr_0.96fr]">
            <div>
              <p className="mb-6 max-w-max rounded-2xl bg-[#D4B895] px-4 py-2 text-sm font-semibold text-[#465024]">
                Pour le foyer et la petite activité
              </p>
              <h1 className="max-w-3xl text-[clamp(3.2rem,7vw,7.4rem)] font-bold leading-[0.92] tracking-[-0.07em]">
                Votre argent personnel n’est pas la caisse de votre activité.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#30351F]/75 sm:text-xl">
                Tracklet vous aide à séparer les deux, enregistrer chaque mouvement et savoir ce que vous pouvez réellement utiliser—en FCFA, même hors ligne.
              </p>

              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link to="/dashboard" className="inline-flex min-h-13 items-center gap-3 rounded-2xl bg-[#465024] px-6 font-semibold text-[#E8DCC7] transition-colors duration-300 hover:bg-[#30351F]">
                  Ouvrir Tracklet
                  <ArrowRight aria-hidden="true" className="h-5 w-5" />
                </Link>
                <button type="button" onClick={() => goTo("fonctionnement")} className="min-h-12 rounded-2xl px-4 font-semibold text-[#465024] underline decoration-[#465024]/35 underline-offset-4 hover:decoration-[#465024]">
                  Voir comment ça fonctionne
                </button>
              </div>

              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#30351F]/75" aria-label="Caractéristiques principales">
                {["Sans compte", "Données locales", "Montants en FCFA"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check aria-hidden="true" className="h-4 w-4 text-[#465024]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <MoneyFlow />
          </div>
        </section>

        <section id="pourquoi" className="scroll-mt-24 bg-[#D4B895] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <h2 className="max-w-xl text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                Trois réponses avant de prendre une décision.
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-[#30351F]/85 lg:justify-self-end">
                Tracklet réduit les données à ce qui aide maintenant : l’argent disponible, le résultat de l’activité et les mouvements encore attendus.
              </p>
            </div>

            <ul className="mt-14 grid gap-5 lg:grid-cols-3">
              {outcomes.map(({ icon: Icon, title, description }) => (
                <li key={title} className="rounded-[2rem] border border-[#465024]/25 bg-[#E8DCC7] p-7 sm:p-8">
                  <Icon aria-hidden="true" className="h-7 w-7 text-[#C66B3D]" />
                  <h3 className="mt-10 text-2xl font-bold tracking-[-0.04em]">{title}</h3>
                  <p className="mt-4 leading-relaxed text-[#30351F]/75">{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="fonctionnement" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Leaf aria-hidden="true" className="h-8 w-8 text-[#465024]" />
              <h2 className="mt-8 max-w-lg text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                Une question à la fois.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-[#30351F]/75">
                Ouvrez seulement l’explication dont vous avez besoin. Dans l’application, chaque donnée reste liée à une action concrète.
              </p>
            </div>

            <div className="space-y-4">
              {answers.map(({ question, answer, items }, index) => {
                const isOpen = openAnswer === index;
                const buttonId = `landing-question-${index}`;
                const panelId = `landing-answer-${index}`;

                return (
                  <div key={question} className={`rounded-[2rem] border border-[#465024]/25 ${isOpen ? "bg-[#E8DCC7]" : "bg-[#D4B895]"}`}>
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        onClick={() => setOpenAnswer(isOpen ? null : index)}
                        className="flex min-h-20 w-full items-center justify-between gap-5 rounded-[2rem] px-6 py-5 text-left text-lg font-bold tracking-[-0.025em] sm:px-8 sm:text-xl"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                      >
                        {question}
                        <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 text-[#465024] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    </h3>
                    {isOpen && (
                      <div id={panelId} role="region" aria-labelledby={buttonId} className="px-6 pb-7 sm:px-8 sm:pb-8">
                        <p className="max-w-2xl leading-relaxed text-[#30351F]/75">{answer}</p>
                        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                          {items.map((item) => (
                            <li key={item} className="flex min-h-12 items-center gap-2 rounded-2xl bg-[#8B9D83]/30 px-4 text-sm font-medium">
                              <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-[#465024]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="confidentialite" className="scroll-mt-24 bg-[#465024] px-5 py-20 text-[#E8DCC7] sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <LockKeyhole aria-hidden="true" className="h-9 w-9 text-[#D4B895]" />
              <h2 className="mt-8 max-w-2xl text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                Un outil local, avec une sortie de secours.
              </h2>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#E8DCC7]/80">
                Les données financières restent dans IndexedDB sur cet appareil. Tracklet fonctionne sans compte, télémétrie ou serveur financier.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#E8DCC7] p-7 text-[#30351F] sm:p-9">
              <FileDown aria-hidden="true" className="h-7 w-7 text-[#C66B3D]" />
              <h3 className="mt-8 text-2xl font-bold tracking-[-0.04em]">Vous gardez une copie.</h3>
              <p className="mt-4 leading-relaxed text-[#30351F]/75">
                Exportez une sauvegarde JSON complète puis restaurez-la après confirmation. Le fichier n’est pas chiffré : conservez-le comme un document financier privé.
              </p>
              <ul className="mt-7 space-y-3 text-sm font-medium">
                {["Toutes les données dans une sauvegarde", "Restauration transactionnelle", "Rapports CSV par période"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-[#465024]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 rounded-[2rem] bg-[#D98E69] p-8 text-[#30351F] sm:p-12 lg:flex-row lg:items-end">
            <div>
              <Smartphone aria-hidden="true" className="h-8 w-8" />
              <h2 className="mt-8 max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
                Commencez avec une seule poche.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed">
                Ajoutez Espèces ou Mobile Money, puis enregistrez le prochain mouvement réel.
              </p>
            </div>
            <Link to="/dashboard" className="inline-flex min-h-13 shrink-0 items-center gap-3 rounded-2xl bg-[#30351F] px-6 font-semibold text-[#E8DCC7] transition-colors duration-300 hover:bg-[#465024]">
              Ouvrir Tracklet
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#465024]/25 px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-xl font-bold tracking-[-0.04em]">Tracklet</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#30351F]/75">
              Copilote financier local pour les micro-entrepreneurs francophones.
            </p>
          </div>
          <Link to="/dashboard" className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#465024] underline decoration-[#465024]/35 underline-offset-4 hover:decoration-[#465024]">
            Ouvrir Tracklet
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}

function MoneyFlow() {
  return (
    <div className="organic-breathe rounded-[2rem] bg-[#D4B895] p-5 sm:p-7" aria-label="Séparation des finances personnelles et professionnelles">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.5rem] bg-[#E8DCC7] p-5">
          <Smartphone aria-hidden="true" className="h-6 w-6 text-[#C66B3D]" />
          <p className="mt-7 text-lg font-bold">Personnel</p>
          <p className="mt-2 text-sm leading-relaxed text-[#30351F]/75">Espèces, Mobile Money, revenus et dépenses du foyer.</p>
        </div>
        <div className="rounded-[1.5rem] bg-[#8B9D83] p-5 text-[#252A18]">
          <BriefcaseBusiness aria-hidden="true" className="h-6 w-6 text-[#30351F]" />
          <p className="mt-7 text-lg font-bold">Activité</p>
          <p className="mt-2 text-sm leading-relaxed">Caisse, ventes, charges et poches professionnelles.</p>
        </div>
      </div>

      <svg className="my-2 h-28 w-full" viewBox="0 0 600 120" fill="none" aria-hidden="true">
        <path d="M140 0C140 62 300 42 300 120" stroke="#C66B3D" strokeWidth="5" strokeLinecap="round" />
        <path d="M460 0C460 62 300 42 300 120" stroke="#465024" strokeWidth="5" strokeLinecap="round" />
        <circle cx="300" cy="82" r="10" fill="#C08E3A" />
      </svg>

      <div className="rounded-[1.5rem] bg-[#465024] p-6 text-[#E8DCC7]">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-medium text-[#E8DCC7]/80">Votre position de trésorerie</p>
            <p className="mt-3 text-2xl font-bold leading-tight tracking-[-0.04em]">Une lecture commune, sans mélanger les poches.</p>
          </div>
          <Banknote aria-hidden="true" className="h-7 w-7 shrink-0 text-[#D4B895]" />
        </div>
        <p className="mt-6 rounded-2xl bg-[#E8DCC7]/10 px-4 py-3 text-sm leading-relaxed">
          Soldes − sommes à payer + sommes à recevoir
        </p>
      </div>
    </div>
  );
}
