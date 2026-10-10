"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, ShieldCheck, Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("compte");
  
  // Données
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [fullName, setFullName] = useState("");
  
  // Sécurité
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserId(user.id);
      setUserEmail(user.email || "");

      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      if (profile) {
        setFullName(profile.full_name);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", userId);
      if (error) throw error;
      alert("✅ Profil mis à jour avec succès.");
    } catch (error: any) {
      alert("❌ Erreur : " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert("⚠️ Le mot de passe doit faire au moins 6 caractères.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      alert("✅ Mot de passe mis à jour avec succès.");
      setNewPassword("");
    } catch (error: any) {
      alert("❌ Erreur : " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#2563EB]" size={32} /></div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      
      <div className="mb-10">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Configuration</p>
        <h2 className="text-2xl font-medium text-[#101D42]">Paramètres du compte</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* MENU LATÉRAL */}
        <div className="w-full md:w-64 bg-white rounded-[24px] border border-gray-200 p-4 shadow-sm shrink-0">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab("compte")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "compte" ? "bg-[#F8FAFC] text-[#101D42] font-bold" : "text-[#9CA3AF] hover:text-[#101D42] hover:bg-gray-50"}`}
            >
              <User size={18} /> Informations
            </button>
            <button 
              onClick={() => setActiveTab("securite")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "securite" ? "bg-[#F8FAFC] text-[#101D42] font-bold" : "text-[#9CA3AF] hover:text-[#101D42] hover:bg-gray-50"}`}
            >
              <ShieldCheck size={18} /> Sécurité
            </button>
          </nav>
        </div>

        {/* CONTENU ACTIF */}
        <div className="flex-1 w-full bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
          
          {/* ONGLET 1 : COMPTE */}
          {activeTab === "compte" && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="border-b border-gray-100 pb-6 mb-6">
                <h3 className="text-lg font-medium text-[#101D42]">Informations personnelles</h3>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">E-mail (Identifiant)</label>
                <input type="email" disabled value={userEmail} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed" />
                <p className="text-[10px] text-gray-400 mt-1">L'adresse e-mail ne peut pas être modifiée ici.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Nom Complet</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#101D42] focus:outline-none focus:border-[#2563EB]" />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={saving} className="bg-[#101D42] hover:bg-[#1a2b5e] text-white px-8 py-3 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 transition-colors disabled:opacity-70">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} METTRE À JOUR
                </button>
              </div>
            </form>
          )}

          {/* ONGLET 2 : SÉCURITÉ */}
          {activeTab === "securite" && (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="border-b border-gray-100 pb-6 mb-6">
                <h3 className="text-lg font-medium text-[#101D42]">Modifier le mot de passe</h3>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Nouveau mot de passe</label>
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#101D42] focus:outline-none focus:border-[#2563EB]" placeholder="••••••••" />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={saving || !newPassword} className="bg-[#2563EB] hover:bg-blue-700 text-white px-8 py-3 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 transition-colors disabled:opacity-70">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />} SAUVEGARDER
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}