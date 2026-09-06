"use client";

import { useState } from "react";
import { User, Building2, ShieldCheck, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profil");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      // Simulation sauvegarde BDD
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("✅ Profil mis à jour avec succès.");
    } catch (error: any) {
      alert("❌ Erreur : " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      
      <div className="mb-10">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Configuration</p>
        <h2 className="text-2xl font-medium text-[#101D42]">Paramètres du compte</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Menu latéral des paramètres */}
        <div className="w-full md:w-64 bg-white rounded-[24px] border border-gray-200 p-4 shadow-sm shrink-0">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab("profil")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "profil" ? "bg-[#F8FAFC] text-[#2563EB]" : "text-[#9CA3AF] hover:text-[#101D42] hover:bg-gray-50"}`}
            >
              <Building2 size={18} /> Profil Startup
            </button>
            <button 
              onClick={() => setActiveTab("compte")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "compte" ? "bg-[#F8FAFC] text-[#2563EB]" : "text-[#9CA3AF] hover:text-[#101D42] hover:bg-gray-50"}`}
            >
              <User size={18} /> Compte Fondateur
            </button>
            <button 
              onClick={() => setActiveTab("securite")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "securite" ? "bg-[#F8FAFC] text-[#2563EB]" : "text-[#9CA3AF] hover:text-[#101D42] hover:bg-gray-50"}`}
            >
              <ShieldCheck size={18} /> Sécurité
            </button>
          </nav>
        </div>

        {/* Formulaire Actif */}
        <div className="flex-1 w-full bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
          
          {activeTab === "profil" && (
            <form onSubmit={handleSave} className="space-y-8">
              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-lg font-medium text-[#101D42] mb-1">Informations de l'entreprise</h3>
                <p className="text-xs text-[#9CA3AF]">Ces informations sont visibles par vos mentors et investisseurs.</p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Nom de la startup</label>
                    <input type="text" defaultValue="GreenTech Solutions" required className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#101D42] focus:outline-none focus:border-[#2563EB] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Secteur d'activité</label>
                    <select defaultValue="CleanTech" className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#101D42] focus:outline-none focus:border-[#2563EB] transition-colors appearance-none">
                      <option value="AgriTech">AgriTech</option>
                      <option value="CleanTech">CleanTech / Énergie</option>
                      <option value="FinTech">FinTech</option>
                      <option value="HealthTech">HealthTech</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Description courte (Pitch)</label>
                  <textarea defaultValue="Nous développons des solutions IoT pour l'optimisation énergétique en Afrique de l'Ouest." rows={3} className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#101D42] focus:outline-none focus:border-[#2563EB] transition-colors resize-none" />
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-[#101D42] hover:bg-[#1a2b5e] text-white px-8 py-3.5 rounded-full text-xs font-semibold tracking-wide transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {isSaving ? "ENREGISTREMENT..." : "SAUVEGARDER LES MODIFICATIONS"}
                </button>
              </div>
            </form>
          )}

          {/* Les autres onglets sont vides pour l'instant pour alléger le code, la logique reste la même */}
          {activeTab !== "profil" && (
            <div className="py-20 text-center">
              <p className="text-[#9CA3AF] font-medium">Cette section sera disponible prochainement.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}