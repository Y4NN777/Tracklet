import {
  ArrowDown,
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  Check,
  FileDown,
  Goal,
  HandCoins,
  LockKeyhole,
  ReceiptText,
  Smartphone,
  WalletCards,
  WifiOff,
} from "lucide-react";
import { Link } from "react-router-dom";

const productFeatures = [
  {
    title: "Position de trésorerie",
    description:
      "Voyez ce qui est réellement disponible, après les dettes et engagements actifs.",
    icon: WalletCards,
    className: "md:col-span-2 md:row-span-2",
    content: (
      <div className="mt-8 border-t border-[#002FA7]">
        {["Espèces", "Mobile Money", "Caisse activité"].map((pocket) => (
          <div
            key={pocket}
            className="flex items-center justify-between border-b border-black/15 py-3 text-sm"
          >
            <span>{pocket}</span>
            <span className="font-medium text-[#002FA7]">Solde calculé</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Transferts fiables",
    description: "Un débit et un crédit liés, enregistrés ensemble entre deux poches.",
    icon: ArrowRight,
    content: (
      <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em]">
        <span>Poche A</span>
        <ArrowRight aria-hidden="true" className="h-4 w-4 text-[#002FA7]" />
        <span>Poche B</span>
      </div>
    ),
  },
  {
    title: "Ventes reliées au cash",
    description: "Chaque vente crédite automatiquement la poche professionnelle choisie.",
    icon: ReceiptText,
    content: (
      <ol className="mt-7 flex flex-wrap items-center gap-2 text-xs font-medium">
        <li className="border border-black px-2 py-1">Vente</li>
        <li aria-hidden="true"><ArrowRight className="h-4 w-4 text-[#002FA7]" /></li>
        <li className="border border-black px-2 py-1">Revenu</li>
        <li aria-hidden="true"><ArrowRight className="h-4 w-4 text-[#002FA7]" /></li>
        <li className="border border-black px-2 py-1">Poche</li>
      </ol>
    ),
  },
  {
    title: "Dettes et créances",
    description: "Suivez ce que vous devez et ce que l’on vous doit, jusqu’au règlement.",
    icon: HandCoins,
  },
  {
    title: "Objectifs d’épargne",
    description: "Mesurez votre progression sans modifier artificiellement le solde des poches.",
    icon: Goal,
  },
  {
    title: "Rapports exportables",
    description: "Filtrez vos périodes et exportez un CSV quand vous en avez besoin.",
    icon: FileDown,
  },
];

function scrollToSection(id: string) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

export function Landing() {
  return (
    <div className="landing-page min-h-svh bg-white text-[#090909]">
      <a
        href="#landing-main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("landing-main")?.focus();
        }}
        className="fixed left-3 top-3 z-[60] -translate-y-24 bg-[#002FA7] px-4 py-3 text-sm font-semibold text-white focus:translate-y-0"
      >
        Aller au contenu
      </a>

      <header className="sticky top-0 z-50 border-b border-black/20 bg-white">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link to="/" className="flex items-center gap-3" aria-label="Tracklet — accueil">
            <span className="grid h-8 w-8 place-items-center bg-[#002FA7] text-sm font-bold text-white">T</span>
            <span className="text-lg font-bold tracking-[-0.03em]">Tracklet</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Navigation principale">
            <button type="button" onClick={() => scrollToSection("fonctionnement")} className="hover:text-[#002FA7]">
              Fonctionnement
            </button>
            <button type="button" onClick={() => scrollToSection("produit")} className="hover:text-[#002FA7]">
              Produit
            </button>
            <button type="button" onClick={() => scrollToSection("confidentialite")} className="hover:text-[#002FA7]">
              Confidentialité
            </button>
          </nav>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-[#002FA7] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002FA7]"
          >
            Ouvrir Tracklet
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main id="landing-main" tabIndex={-1}>
        <section className="landing-grid border-b border-black/20">
          <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1440px] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-between border-black/20 px-5 py-14 sm:px-8 sm:py-20 lg:border-r lg:px-12 lg:py-24">
              <div>
                <p className="mb-8 inline-flex items-center gap-2 border border-[#002FA7] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#002FA7]">
                  <WifiOff aria-hidden="true" className="h-4 w-4" />
                  Finance locale · FCFA · hors ligne
                </p>
                <h1 className="max-w-4xl text-[clamp(3.5rem,8.5vw,8.6rem)] font-bold leading-[0.86] tracking-[-0.075em]">
                  Votre argent perso.
                  <span className="block text-[#002FA7]">Votre activité.</span>
                  <span className="block">Enfin séparés.</span>
                </h1>
              </div>

              <div className="mt-14 grid gap-8 border-t border-black pt-7 sm:grid-cols-[1fr_auto] sm:items-end">
                <p className="max-w-xl text-lg leading-relaxed text-black/65 sm:text-xl">
                  Tracklet rassemble vos poches, ventes, dettes et objectifs dans une vue claire—sur votre appareil, même sans connexion.
                </p>
                <button
                  type="button"
                  onClick={() => scrollToSection("fonctionnement")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#002FA7] hover:text-black"
                >
                  Découvrir
                  <ArrowDown aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center bg-[#F7F7F8] px-5 py-14 sm:px-8 lg:px-12">
              <div className="w-full border border-black bg-white">
                <div className="flex items-center justify-between border-b border-black px-5 py-4">
                  <span className="text-xs font-bold uppercase tracking-[0.18em]">Position de trésorerie</span>
                  <span className="h-2.5 w-2.5 bg-[#002FA7]" aria-hidden="true" />
                </div>

                <div className="grid sm:grid-cols-2">
                  <div className="border-b border-black p-5 sm:border-b-0 sm:border-r">
                    <div className="mb-8 flex items-center justify-between">
                      <span className="text-sm font-semibold">Personnel</span>
                      <Smartphone aria-hidden="true" className="h-5 w-5 text-[#002FA7]" />
                    </div>
                    <div className="space-y-3">
                      <div className="border-t border-black/20 pt-3 text-sm">Espèces</div>
                      <div className="border-t border-black/20 pt-3 text-sm">Mobile Money</div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="mb-8 flex items-center justify-between">
                      <span className="text-sm font-semibold">Activité</span>
                      <BriefcaseBusiness aria-hidden="true" className="h-5 w-5 text-[#002FA7]" />
                    </div>
                    <div className="space-y-3">
                      <div className="border-t border-black/20 pt-3 text-sm">Caisse</div>
                      <div className="border-t border-black/20 pt-3 text-sm">Mobile Money Pro</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#002FA7] bg-[#002FA7] p-6 text-white">
                  <div className="mb-8 flex items-start justify-between gap-6">
                    <p className="max-w-xs text-sm leading-relaxed text-white/75">
                      Deux espaces distincts. Une lecture honnête de ce qui est disponible.
                    </p>
                    <Banknote aria-hidden="true" className="h-7 w-7 shrink-0" />
                  </div>
                  <p className="text-2xl font-bold tracking-[-0.04em] sm:text-3xl">Calculé en FCFA</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Principes du produit" className="border-b border-black/20">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 md:grid-cols-4">
            {[
              [WifiOff, "Hors ligne par défaut"],
              [LockKeyhole, "Sans compte obligatoire"],
              [Banknote, "Pensé pour le FCFA"],
              [Smartphone, "Données sur votre appareil"],
            ].map(([Icon, label], index) => {
              const PrincipleIcon = Icon as typeof WifiOff;
              return (
                <div
                  key={label as string}
                  className={`flex min-h-32 flex-col justify-between gap-5 p-5 sm:p-7 ${
                    index % 2 === 0 ? "border-r" : ""
                  } ${index < 2 ? "border-b md:border-b-0" : ""} md:border-r md:last:border-r-0 border-black/20`}
                >
                  <PrincipleIcon aria-hidden="true" className="h-5 w-5 text-[#002FA7]" />
                  <p className="max-w-[12rem] text-sm font-semibold">{label as string}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="fonctionnement" className="scroll-mt-20 border-b border-black/20 bg-white">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="mb-5 text-sm font-semibold text-[#002FA7]">Une méthode simple</p>
                <h2 className="max-w-md text-4xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                  Le même téléphone. Deux réalités financières.
                </h2>
              </div>
              <p className="max-w-2xl self-end text-lg leading-relaxed text-black/60 sm:text-xl">
                Tracklet ne transforme pas votre quotidien en logiciel comptable. Il vous aide à enregistrer les mouvements essentiels et à garder l’argent personnel séparé de l’activité.
              </p>
            </div>

            <ol className="mt-16 grid border-l border-t border-black md:grid-cols-3">
              {[
                ["01", "Séparez", "Créez vos poches personnelles et professionnelles."],
                ["02", "Enregistrez", "Ajoutez revenus, dépenses, transferts, ventes et dettes."],
                ["03", "Comprenez", "Lisez votre trésorerie, vos rapports et vos objectifs."],
              ].map(([number, title, copy]) => (
                <li key={number} className="border-b border-r border-black p-6 sm:p-8">
                  <span className="block text-7xl font-bold leading-none tracking-[-0.08em] text-[#002FA7] sm:text-8xl">{number}</span>
                  <h3 className="mt-10 text-2xl font-bold tracking-[-0.04em]">{title}</h3>
                  <p className="mt-3 max-w-xs leading-relaxed text-black/60">{copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="produit" className="scroll-mt-20 border-b border-black/20 bg-[#F7F7F8]">
          <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="mb-14 flex flex-col justify-between gap-6 border-b border-black pb-8 md:flex-row md:items-end">
              <h2 className="max-w-3xl text-4xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Les outils qui suivent vraiment votre cash.
              </h2>
              <p className="max-w-sm text-base leading-relaxed text-black/60">
                Pas de données décoratives : chaque écran répond à une décision financière concrète.
              </p>
            </div>

            <ul className="grid auto-rows-auto border-l border-t border-black md:grid-cols-2 lg:grid-cols-3">
              {productFeatures.map(({ title, description, icon: Icon, className = "", content }) => (
                <li key={title} className={`min-h-72 border-b border-r border-black bg-white p-6 sm:p-8 ${className}`}>
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-bold tracking-[-0.04em]">{title}</h3>
                      <p className="mt-3 max-w-md leading-relaxed text-black/60">{description}</p>
                    </div>
                    <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-[#002FA7]" />
                  </div>
                  {content}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="confidentialite" className="scroll-mt-20 bg-[#002FA7] text-white">
          <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
            <div className="border-white/35 px-5 py-20 sm:px-8 lg:border-r lg:px-12 lg:py-28">
              <LockKeyhole aria-hidden="true" className="mb-12 h-9 w-9" />
              <h2 className="max-w-2xl text-4xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Vos chiffres restent là où ils servent : chez vous.
              </h2>
            </div>
            <div className="flex flex-col justify-between px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
              <p className="max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
                Les données financières sont stockées dans le navigateur. Tracklet n’exige ni compte, ni serveur, ni synchronisation cloud pour fonctionner.
              </p>
              <ul className="mt-14 border-t border-white/45">
                {[
                  "Stockage local avec IndexedDB",
                  "Sauvegarde JSON exportable et restaurable",
                  "Aucune télémétrie financière",
                  "Exports à conserver comme des documents sensibles",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 border-b border-white/45 py-4 text-sm font-medium">
                    <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="landing-grid border-b border-black/20">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-12 px-5 py-20 sm:px-8 lg:flex-row lg:items-end lg:px-12 lg:py-28">
            <div>
              <p className="mb-6 text-sm font-semibold text-[#002FA7]">Prêt sur ce navigateur</p>
              <h2 className="max-w-4xl text-5xl font-bold leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
                Commencez par une poche. Voyez enfin l’ensemble.
              </h2>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex shrink-0 items-center gap-3 bg-[#002FA7] px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#002FA7]"
            >
              Ouvrir l’application
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/20 bg-white text-black">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end lg:px-12">
          <div>
            <p className="text-2xl font-bold tracking-[-0.04em]">Tracklet</p>
            <p className="mt-2 max-w-sm text-sm text-black/55">Copilote financier local pour les micro-entrepreneurs francophones.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-black/65">
            <button type="button" onClick={() => scrollToSection("produit")} className="hover:text-[#002FA7]">Produit</button>
            <button type="button" onClick={() => scrollToSection("confidentialite")} className="hover:text-[#002FA7]">Confidentialité</button>
            <Link to="/dashboard" className="hover:text-[#002FA7]">Application</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
