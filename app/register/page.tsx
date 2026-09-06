"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Rocket, Users, TrendingUp, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SLIDER_MESSAGES = [
  {
    title: "Accélérez votre croissance.",
    desc: "Un écosystème conçu pour structurer votre projet, monter en compétences et réussir votre levée de fonds.",
    icon: <Rocket size={32} className="text-[#2563EB]" />
  },
  {
    title: "Transmettez votre expertise.",
    desc: "Accompagnez des fondateurs ambitieux et participez activement à l'innovation de demain.",
    icon: <Users size={32} className="text-emerald-400" />
  },
  {
    title: "Découvrez les pépites tech.",
    desc: "Un deal flow exclusif, qualifié et organisé pour vos prochains investissements stratégiques.",
    icon: <TrendingUp size={32} className="text-orange-400" />
  }
];

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState("startup");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDER_MESSAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg("Veuillez saisir votre nom complet.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: selectedRole, full_name: fullName } }
      });
      if (error) throw error;
      router.push("/onboarding");
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#101D42] mb-10 transition-colors">
            <ArrowLeft size={16} /> Retour à l'accueil
          </Link>

          <h1 className="text-3xl font-medium tracking-tight text-[#101D42] mb-2">Rejoindre TechStratix</h1>
          <p className="text-[#9CA3AF] text-sm mb-8">Sélectionnez votre profil pour commencer.</p>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div onClick={() => setSelectedRole("startup")} className={`cursor-pointer border rounded-2xl p-4 flex flex-col items-center gap-3 transition-all ${selectedRole === "startup" ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] shadow-sm" : "border-gray-200 text-gray-400 hover:border-[#101D42]"}`}>
                <Rocket size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Startup</span>
              </div>
              <div onClick={() => setSelectedRole("mentor")} className={`cursor-pointer border rounded-2xl p-4 flex flex-col items-center gap-3 transition-all ${selectedRole === "mentor" ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-sm" : "border-gray-200 text-gray-400 hover:border-emerald-500"}`}>
                <Users size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Mentor</span>
              </div>
              <div onClick={() => setSelectedRole("investor")} className={`cursor-pointer border rounded-2xl p-4 flex flex-col items-center gap-3 transition-all ${selectedRole === "investor" ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm" : "border-gray-200 text-gray-400 hover:border-orange-500"}`}>
                <TrendingUp size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Investisseur</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Nom Complet</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" placeholder="Jean Dupont" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">E-mail</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" placeholder="nom@exemple.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Mot de passe</label>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Confirmer</label>
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" placeholder="••••••••" />
                </div>
              </div>
            </div>

            {errorMsg && <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm font-medium text-red-600">{errorMsg}</div>}

            <button type="submit" disabled={loading} className="w-full bg-[#101D42] hover:bg-[#1a2b5e] text-white font-semibold py-4 rounded-full tracking-wide transition-colors text-sm disabled:opacity-70 mt-4">
              {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "CRÉER MON COMPTE"}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm">
            <span className="text-[#9CA3AF]">Vous avez déjà un compte ?</span>{" "}
            <Link href="/login" className="text-[#101D42] font-semibold hover:underline">Se connecter</Link>
          </div>
        </div>
      </div>

      {/* DROITE : LE PANNEAU MARKETING ANIMÉ */}
      <div className="hidden lg:flex w-1/2 bg-[#060B14] p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2563EB] opacity-20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500 opacity-10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-serif font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-medium tracking-tight text-white">TechStratix</span>
          </Link>
        </div>

        <div className="relative z-10 h-64 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-sm shadow-xl">
                {SLIDER_MESSAGES[currentIndex].icon}
              </div>
              <h2 className="text-4xl lg:text-5xl font-medium text-white mb-6 leading-[1.1] tracking-tight">
                {SLIDER_MESSAGES[currentIndex].title}
              </h2>
              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                {SLIDER_MESSAGES[currentIndex].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 flex gap-3 w-full max-w-sm">
          {SLIDER_MESSAGES.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
              {i === currentIndex && (
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: "100%" }} 
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full bg-[#2563EB]"
                />
              )}
              {i < currentIndex && <div className="h-full bg-[#2563EB]" />}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}