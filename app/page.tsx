"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Rocket, Users, TrendingUp, ShieldCheck, UserCheck, Network, Lock } from "lucide-react";
import GooeyNav from "@/components/GooeyNav";
import Lightfall from "@/components/Lightfall";

const navItems = [
  { label: "Notre approche", href: "#valeur" },
  { label: "Profils", href: "#profils" },
  { label: "Sélection", href: "#confiance" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function LandingPage() {
  
  // Fonction pour remonter en haut de la page au clic sur le logo
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#101D42] font-sans selection:bg-[#2563EB] selection:text-white overflow-x-hidden relative">
      
      {/* ========================================== */}
      {/* FOND ANIMÉ 3D GLOBAL (Lightfall - Fixé)    */}
      {/* ========================================== */}
      <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none overflow-hidden opacity-40">
        <Lightfall
          colors={['#2563EB', '#101D42', '#60A5FA']} /* Palette TechStratix */
          backgroundColor="#F8FAFC" /* Correspond au fond du site */
          lightMode={true} /* Indispensable pour un fond clair */
          speed={0.4} 
          streakCount={4} 
          streakWidth={1.5}
          glow={0.5}
          opacity={0.8}
          mouseInteraction={true} /* Les faisceaux de lumière réagiront à la souris */
        />
      </div>

      {/* ========================================== */}
      {/* HEADER (Menu de navigation)                */}
      {/* ========================================== */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-gray-100/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO CLIQUABLE (Retour en haut) */}
          <a href="#" onClick={scrollToTop} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 bg-[#101D42] rounded flex items-center justify-center shadow-sm group-hover:bg-[#2563EB] transition-colors">
              <span className="text-white font-serif font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-[#101D42] hidden sm:block">TechStratix</span>
          </a>

          {/* GOOEY NAV */}
          <div className="hidden md:block">
            <GooeyNav items={navItems} />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#101D42] transition-colors hidden sm:block">
              Se connecter
            </Link>
            <Link href="/register" className="bg-[#101D42] hover:bg-[#1a2b5e] text-white px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2 group">
              Créer mon profil
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* CONTENU PRINCIPAL                          */}
      {/* ========================================== */}
      <main className="relative z-10">
        
        {/* ========================================== */}
        {/* HERO SECTION                               */}
        {/* ========================================== */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 min-h-[90vh] flex items-center bg-transparent">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10 w-full mt-10 lg:mt-0">
            
            {/* TEXTE DE GAUCHE */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex-1 text-center lg:text-left">
              <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-[4.5rem] font-semibold leading-[1.1] mb-6 tracking-tight text-[#101D42]">
                L'espace où les projets ambitieux rencontrent l'expertise et le <span className="font-serif italic text-[#2563EB]">capital.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg text-gray-500 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                TechStratix réunit sur une plateforme unique les fondateurs qui construisent demain, les mentors qui les guident, et les investisseurs qui les financent.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/register" className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-700 text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group">
                  Créer mon profil
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login" className="w-full sm:w-auto bg-white/60 backdrop-blur-md border border-gray-200 hover:border-gray-300 hover:bg-white text-[#101D42] px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all flex items-center justify-center">
                  Accéder à la plateforme
                </Link>
              </motion.div>
            </motion.div>

            {/* VISUEL DE DROITE : LE TRIANGLE ORIGINAL SVG */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="flex-1 w-full relative h-[400px] hidden lg:block">
              <div className="absolute inset-0 flex items-center justify-center">
                
                {/* Lignes du Triangle SVG dessinées exactement d'un centre à l'autre */}
                <svg className="absolute w-[200px] h-[180px] z-0" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -45%)' }}>
                  <path d="M 100 0 L 0 180" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4"/>
                  <path d="M 100 0 L 200 180" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4"/>
                  <path d="M 0 180 L 200 180" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4"/>
                </svg>

                {/* Nœud du Haut (Startups) */}
                <div className="absolute flex flex-col items-center z-10" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -170px)' }}>
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-xl flex items-center justify-center text-[#2563EB] mb-3 relative group cursor-pointer hover:scale-110 transition-transform">
                    <Rocket size={24} className="relative z-10" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100/50">Startups</span>
                </div>

                {/* Nœud Bas Gauche (Mentors) */}
                <div className="absolute flex flex-col items-center z-10" style={{ top: '50%', left: '50%', transform: 'translate(-150px, 10px)' }}>
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-xl flex items-center justify-center text-emerald-500 mb-3 relative group cursor-pointer hover:scale-110 transition-transform">
                    <Users size={24} className="relative z-10" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100/50">Mentors</span>
                </div>

                {/* Nœud Bas Droit (Investisseurs) */}
                <div className="absolute flex flex-col items-center z-10" style={{ top: '50%', left: '50%', transform: 'translate(50px, 10px)' }}>
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-xl flex items-center justify-center text-orange-500 mb-3 relative group cursor-pointer hover:scale-110 transition-transform">
                    <TrendingUp size={24} className="relative z-10" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100/50">Investisseurs</span>
                </div>

                {/* Centre TechStratix */}
                <div className="absolute w-24 h-24 bg-[#101D42] rounded-full flex items-center justify-center shadow-2xl shadow-[#101D42]/20 z-20">
                  <span className="text-white font-serif font-bold text-3xl">T</span>
                </div>

              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION PROFILS                            */}
        {/* ========================================== */}
        <section id="profils" className="py-24 px-6 bg-transparent border-y border-gray-200/30 relative z-10">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#101D42] mb-4">
                Une infrastructure dédiée à chaque <span className="font-serif italic text-[#2563EB]">acteur</span>.
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Nous ne fournissons pas qu'un réseau. Nous fournissons les outils pour que chaque mise en relation génère de la valeur.</p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <motion.div variants={fadeUp} className="group bg-white/60 backdrop-blur-md p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Rocket size={24} />
                </div>
                <h3 className="text-xl font-medium text-[#101D42] mb-3">Fondateurs</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Structurez votre projet, suivez vos objectifs de croissance et accédez à des formations ciblées. Préparez-vous sereinement avant d'être présenté aux investisseurs.
                </p>
                <Link href="/register" className="text-sm font-semibold text-[#2563EB] hover:text-[#101D42] flex items-center gap-1 transition-colors">
                  Créer mon profil <ArrowRight size={14} />
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="group bg-white/60 backdrop-blur-md p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-medium text-[#101D42] mb-3">Mentors & Experts</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Partagez votre expertise avec des équipes sérieuses. Suivez l'évolution des startups qui vous sont assignées et validez leurs étapes clés via un tableau de bord pensé pour vous.
                </p>
                <Link href="/register" className="text-sm font-semibold text-emerald-600 hover:text-[#101D42] flex items-center gap-1 transition-colors">
                  Créer mon profil <ArrowRight size={14} />
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="group bg-white/60 backdrop-blur-md p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-medium text-[#101D42] mb-3">Investisseurs</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Découvrez des projets qualifiés. Accédez à un deal flow organisé, consultez les Data Rooms sécurisées et participez à notre Demo Day exclusif pour vos prochains investissements.
                </p>
                <Link href="/register" className="text-sm font-semibold text-orange-600 hover:text-[#101D42] flex items-center gap-1 transition-colors">
                  Créer mon profil <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION PROCESSUS                          */}
        {/* ========================================== */}
        <section id="valeur" className="py-24 px-6 bg-transparent relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-[#101D42] text-center mb-16">Le processus d'intégration</h2>
            
            <div className="space-y-12">
              {[
                { step: "01", title: "Création du dossier", desc: "Choisissez votre rôle et complétez les informations requises. Votre dossier est stocké en toute sécurité." },
                { step: "02", title: "Examen par l'équipe", desc: "Nous examinons minutieusement chaque profil pour garantir la pertinence et le sérieux des échanges sur la plateforme." },
                { step: "03", title: "Accès au Hub", desc: "Une fois validé, vous accédez à un espace de travail personnalisé selon vos objectifs (Formations, Mentorat, Sourcing)." },
                { step: "04", title: "Mise en relation", desc: "Connectez-vous aux acteurs clés. Les startups prêtes sont présentées aux investisseurs lors d'événements dédiés." }
              ].map((item, i) => (
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} key={i} className="flex gap-6 items-start bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-3xl font-serif text-[#E2E8F0] font-light mt-1">{item.step}</div>
                  <div>
                    <h4 className="text-lg font-medium text-[#101D42] mb-2">{item.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION CONFIANCE                          */}
        {/* ========================================== */}
        <section id="confiance" className="py-24 px-6 bg-transparent relative z-10">
          <div className="max-w-7xl mx-auto bg-[#101D42]/95 backdrop-blur-xl rounded-[32px] overflow-hidden flex flex-col lg:flex-row shadow-xl border border-[#101D42]/20">
            
            <div className="p-12 lg:p-20 flex-1 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">La qualité par la <span className="font-serif italic text-[#2563EB]">sélection.</span></h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-md">
                Nous ne croyons pas aux réseaux ouverts sans filtre. TechStratix est un environnement protégé. Les documents sont confidentiels, les profils vérifiés, et les mises en relation ont un véritable objectif d'affaires.
              </p>
              <ul className="space-y-4 text-sm text-gray-300 font-medium">
                <li className="flex items-center gap-3"><ShieldCheck className="text-[#2563EB]" size={18} /> Données et Data Room privées</li>
                <li className="flex items-center gap-3"><UserCheck className="text-[#2563EB]" size={18} /> Validation manuelle des identités</li>
                <li className="flex items-center gap-3"><Lock className="text-[#2563EB]" size={18} /> Accès restreint au Deal Flow</li>
              </ul>
            </div>

            <div className="bg-[#0b1430]/90 lg:w-2/5 p-12 lg:p-20 flex flex-col justify-center items-center text-center border-t lg:border-t-0 lg:border-l border-white/5">
               <Network className="text-gray-500 mb-6" size={48} strokeWidth={1} />
               <p className="text-white font-medium mb-2">Rejoignez le cercle restreint</p>
               <p className="text-gray-500 text-xs mb-8">Les inscriptions spontanées sont soumises à approbation stricte.</p>
               <Link href="/register" className="w-full bg-white hover:bg-gray-100 text-[#101D42] py-4 rounded-full text-sm font-semibold tracking-wide transition-colors shadow-lg">
                  Créer mon profil
               </Link>
            </div>

          </div>
        </section>

      </main>

      {/* ========================================== */}
      {/* FOOTER                                     */}
      {/* ========================================== */}
      <footer className="bg-transparent border-t border-gray-200/50 py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#101D42] rounded flex items-center justify-center shadow-sm">
              <span className="text-white font-serif font-bold text-[10px]">T</span>
            </div>
            <span className="text-sm font-medium tracking-tight text-[#101D42]">TechStratix</span>
          </div>
          
          <div className="flex gap-6 text-sm text-gray-500 font-medium">
            <Link href="/login" className="hover:text-[#101D42] transition-colors bg-white/60 px-4 py-1.5 rounded-full backdrop-blur-sm">Connexion</Link>
            <Link href="/register" className="hover:text-[#101D42] transition-colors bg-white/60 px-4 py-1.5 rounded-full backdrop-blur-sm">Inscription</Link>
          </div>

          <p className="text-xs text-gray-500 bg-white/60 px-4 py-1.5 rounded-full backdrop-blur-sm">© 2026 TechStratix. Tous droits réservés.</p>
        </div>
      </footer>

    </div>
  );
}