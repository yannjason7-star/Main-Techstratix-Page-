"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Layers, Plus, Calendar, Users, Target, MoreVertical, Loader2, X } from "lucide-react";

type Cohort = {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'completed';
  start_date: string;
  end_date: string;
};

export default function CohortesPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la modale de création
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "draft" as Cohort['status'],
    start_date: "",
    end_date: ""
  });

  // Charger les données depuis Supabase
  useEffect(() => {
    fetchCohorts();
  }, []);

  const fetchCohorts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cohorts")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) throw error;
      if (data) setCohorts(data);
    } catch (error: any) {
      alert("❌ Erreur de chargement : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau programme
  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      alert("❌ La date de fin doit être après la date de début !");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("cohorts")
        .insert([formData])
        .select();

      if (error) throw error;

      if (data) {
        setCohorts([data[0], ...cohorts]); // Ajoute le nouveau programme visuellement
        setIsModalOpen(false); // Ferme la modale
        setFormData({ name: "", status: "draft", start_date: "", end_date: "" }); // Reset
        alert("✅ Programme créé avec succès !");
      }
    } catch (error: any) {
      alert("❌ Erreur de création : " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Fonction intelligente pour calculer la progression en temps réel
  const calculateProgress = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const now = new Date().getTime();

    if (now < startDate) return 0; // Pas encore commencé
    if (now > endDate) return 100; // Terminé

    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;
    return Math.round((elapsed / totalDuration) * 100);
  };

  // Traduction des statuts pour l'affichage
  const statusConfig = {
    draft: { label: "Brouillon / Inscriptions", color: "bg-gray-100 text-gray-600" },
    active: { label: "En cours", color: "bg-blue-50 text-[#2563EB]" },
    completed: { label: "Terminé", color: "bg-emerald-50 text-emerald-600" },
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Organisation</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Programmes & Cohortes</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#101D42] hover:bg-[#1a2b5e] text-white px-6 py-3 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm"
        >
          <Plus size={16} /> CRÉER UN PROGRAMME
        </button>
      </div>

      {/* LISTE DES COHORTES */}
      {loading ? (
        <div className="flex justify-center py-20 text-[#2563EB]"><Loader2 className="animate-spin" size={32} /></div>
      ) : cohorts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center text-[#9CA3AF] shadow-sm">
          <Layers size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-[#101D42]">Aucun programme actif.</p>
          <p className="text-sm mt-1">Créez votre première cohorte pour y regrouper vos startups.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cohorts.map((cohort) => {
            const progress = calculateProgress(cohort.start_date, cohort.end_date);
            const style = statusConfig[cohort.status];

            return (
              <div key={cohort.id} className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm flex flex-col justify-between hover:border-[#2563EB]/30 transition-all group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full ${style.color}`}>
                      {style.label}
                    </span>
                    <button className="text-gray-400 hover:text-[#101D42]"><MoreVertical size={18} /></button>
                  </div>
                  <h3 className="text-xl font-medium text-[#101D42] mb-4">{cohort.name}</h3>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-[#9CA3AF] font-medium">
                      <Calendar size={16} className="text-[#2563EB]" /> 
                      {new Date(cohort.start_date).toLocaleDateString('fr-FR')} - {new Date(cohort.end_date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#9CA3AF] font-medium opacity-50">
                      {/* Pour l'instant, on laisse 0. On fera le matching plus tard */}
                      <Users size={16} /> 0 Startups assignées
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-[#9CA3AF] uppercase mb-2">
                    <span>Progression du programme</span>
                    <span className="text-[#101D42]">{progress}%</span>
                  </div>
                  <div className="w-full bg-[#F8FAFC] rounded-full h-2">
                    <div className={`h-2 rounded-full ${cohort.status === 'completed' ? 'bg-emerald-500' : 'bg-[#2563EB]'}`} style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================= */}
      {/* MODALE DE CRÉATION                        */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101D42]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAFAFA]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg"><Layers size={20} /></div>
                <h3 className="text-lg font-bold text-[#101D42]">Nouveau Programme</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-[#101D42]"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateCohort} className="p-8 space-y-6">
              
              <div>
                <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Nom de la cohorte <span className="text-red-500">*</span></label>
                <input 
                  type="text" required 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" 
                  placeholder="Ex: Batch Été 2026" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Statut initial <span className="text-red-500">*</span></label>
                <select 
                  required 
                  value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as Cohort['status']})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42] bg-white"
                >
                  <option value="draft">Brouillon (Ouvert aux inscriptions)</option>
                  <option value="active">Actif (En cours)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Date de début <span className="text-red-500">*</span></label>
                  <input 
                    type="date" required 
                    value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Date de fin <span className="text-red-500">*</span></label>
                  <input 
                    type="date" required 
                    value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" 
                  />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={saving} className="w-full py-4 rounded-full font-bold tracking-wide text-white transition-colors text-xs flex items-center justify-center gap-2 bg-[#101D42] hover:bg-[#1a2b5e]">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : "GÉNÉRER LE PROGRAMME"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}