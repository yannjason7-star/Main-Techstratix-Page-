"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Briefcase, Calendar, MessageCircle, FileText, Rocket, Target, ChevronRight, Loader2, Users } from "lucide-react";
import Link from "next/link";

type StartupProfile = {
  id: string;
  full_name: string; // Nom du fondateur
  startup_profiles?: {
    startup_name: string;
    sector: string;
    description: string;
    pitch_deck_path: string | null;
  }[];
};

export default function MesStartupsPage() {
  const [startups, setStartups] = useState<StartupProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      // On va chercher toutes les Startups qui ont été validées (approved) par l'Admin
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id, 
          full_name, 
          startup_profiles (startup_name, sector, description, pitch_deck_path)
        `)
        .eq("role", "startup")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setStartups(data);
    } catch (error: any) {
      alert("❌ Erreur de chargement des startups : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // VRAIE FONCTION DE TÉLÉCHARGEMENT SÉCURISÉ DU PITCH DECK
  const handleDownloadDeck = async (startupId: string, filePath: string | null | undefined) => {
    if (!filePath) {
      alert("⚠️ Cette startup n'a pas encore mis en ligne son Pitch Deck.");
      return;
    }
    
    try {
      setDownloadingId(startupId);
      const { data, error } = await supabase.storage.from('kyc_files').createSignedUrl(filePath, 60);
      if (error) throw error;
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error: any) {
      alert("❌ Erreur d'accès au document : " + error.message);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* HEADER MENTOR */}
      <div className="mb-10">
        <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-600 uppercase mb-2">Suivi d'accompagnement</p>
        <h2 className="text-2xl font-medium text-[#101D42]">Startups de l'incubateur</h2>
        <p className="text-sm text-[#9CA3AF] mt-2">Retrouvez ici les projets approuvés par l'administration que vous pouvez accompagner.</p>
      </div>

      {startups.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-gray-200 p-16 text-center shadow-sm">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-[#101D42] mb-2">Aucune startup assignée</h3>
          <p className="text-[#9CA3AF] text-sm">Il n'y a pas encore de startups approuvées par l'administration dans le programme.</p>
        </div>
      ) : (
        /* GRILLE DES VRAIES STARTUPS */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {startups.map((startup) => {
            // Extraction intelligente des détails (car Supabase renvoie un tableau pour les relations)
            const details = startup.startup_profiles && startup.startup_profiles.length > 0 
              ? startup.startup_profiles[0] 
              : null;
            
            const startupName = details?.startup_name || "Nom non renseigné";
            const sector = details?.sector || "Secteur inconnu";
            const pitch = details?.description || "Aucune description fournie par les fondateurs.";
            const hasDeck = !!details?.pitch_deck_path;

            // Simulation de données dynamiques en attendant les fonctions avancées (Phase 7)
            // On génère une progression aléatoire pour le design visuel
            const fakeProgress = Math.floor(Math.random() * 40) + 40; 

            return (
              <div key={startup.id} className="bg-white rounded-[32px] border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all flex flex-col overflow-hidden group">
                
                {/* EN-TÊTE DE LA CARTE */}
                <div className="p-8 pb-6 border-b border-gray-50 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-5 rounded-full blur-[40px] group-hover:opacity-10 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-2xl flex items-center justify-center shadow-inner">
                        <Rocket size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-[#101D42]">{startupName}</h3>
                        <p className="text-xs font-bold text-[#9CA3AF] tracking-wider uppercase mt-0.5">{sector}</p>
                      </div>
                    </div>
                    
                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Actif
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed italic relative z-10 line-clamp-3">
                    "{pitch}"
                  </p>
                </div>

                {/* CORPS DE LA CARTE */}
                <div className="p-8 bg-[#FAFAFA] flex-1">
                  
                  {/* Fondateurs */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#101D42] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        {startup.full_name.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-[#101D42] ml-2">Par {startup.full_name}</span>
                    </div>
                    
                    <button className="text-[10px] font-bold text-[#2563EB] uppercase hover:underline flex items-center gap-1">
                      Voir le profil <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Jauge de progression (Visuel simulé pour l'instant) */}
                  <div className="mb-8">
                    <div className="flex justify-between text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">
                      <span className="flex items-center gap-1.5"><Target size={14} className="text-[#101D42]" /> Objectifs & Formations</span>
                      <span className="text-[#101D42]">{fakeProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#101D42] rounded-full" style={{ width: `${fakeProgress}%` }}></div>
                    </div>
                  </div>

                  {/* Prochain RDV */}
                  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Prochaine Session Visio</p>
                      <p className="text-sm font-medium text-[#101D42] mt-0.5">À planifier</p>
                    </div>
                  </div>
                </div>

                {/* PIED DE LA CARTE (Boutons d'action Connectés !) */}
                <div className="p-6 bg-white border-t border-gray-50 flex gap-4">
                  <button 
                    onClick={() => handleDownloadDeck(startup.id, details?.pitch_deck_path)}
                    disabled={!hasDeck || downloadingId === startup.id}
                    className={`flex-1 flex items-center justify-center gap-2 border py-3.5 rounded-full text-xs font-bold tracking-wide transition-colors ${
                      hasDeck 
                        ? 'border-gray-200 text-[#101D42] hover:bg-[#F8FAFC]' 
                        : 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                    }`}
                  >
                    {downloadingId === startup.id ? <Loader2 size={16} className="animate-spin text-[#2563EB]" /> : <FileText size={16} className={hasDeck ? "text-[#2563EB]" : "text-gray-300"} />}
                    {hasDeck ? "LIRE LE PITCH" : "AUCUN PITCH"}
                  </button>

                  <Link href="/messages" className="flex-1 flex items-center justify-center gap-2 bg-[#101D42] text-white py-3.5 rounded-full text-xs font-bold tracking-wide hover:bg-[#1a2b5e] transition-colors shadow-md">
                    <MessageCircle size={16} className="text-emerald-400" /> DISCUTER
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}