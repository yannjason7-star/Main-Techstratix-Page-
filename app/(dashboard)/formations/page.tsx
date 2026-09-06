"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PlayCircle, Clock, Loader2, BookOpen, X, Check, Lock, Unlock, Award } from "lucide-react";

export default function FormationsPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // NOUVEAU STATE : Gère le cours actuellement sélectionné pour ouvrir la fenêtre (Modal)
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("courses").select("*");
      if (error) throw error;
      if (data) setCourses(data);
    } catch (error: any) {
      alert("❌ Impossible de charger les formations : " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string, courseTitle: string, isPremium: boolean, price: number) => {
    try {
      setActionLoading(courseId);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté.");

      await new Promise(resolve => setTimeout(resolve, 800)); // Simulation de chargement

      if (isPremium) {
        alert(`💳 Redirection vers la passerelle de paiement pour régler ${price}€ pour "${courseTitle}".`);
      } else {
        alert(`✅ Succès ! Vous êtes maintenant inscrit au cours "${courseTitle}".`);
        setSelectedCourse(null); // On ferme la fenêtre après l'inscription
      }
    } catch (error: any) {
      alert("❌ Erreur : " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* HEADER DE LA PAGE */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">E-Learning</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Catalogue de Formations</h2>
        </div>
      </div>

      {/* SYSTÈME D'ONGLETS (Comme dans l'ancien design) */}
      <div className="flex gap-6 mb-8 border-b border-gray-100 pb-2">
        <button className="text-[#101D42] border-b-2 border-[#101D42] pb-2 text-sm font-medium">Toutes les formations</button>
        <button className="text-[#9CA3AF] hover:text-[#101D42] pb-2 text-sm font-medium transition-colors">En cours (0)</button>
        <button className="text-[#9CA3AF] hover:text-[#101D42] pb-2 text-sm font-medium transition-colors">Premium</button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-[#9CA3AF]">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl bg-white">
          <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-[#9CA3AF] font-medium">Aucune formation disponible.</p>
        </div>
      ) : (
        /* L'ANCIENNE GRILLE PARFAITE (2 Colonnes) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id} 
              onClick={() => setSelectedCourse(course)} // Ouvre la fenêtre au clic
              className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm group hover:border-[#2563EB]/40 transition-all cursor-pointer flex flex-col justify-between h-[280px]"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-full uppercase">
                    {course.category}
                  </span>
                  {course.is_premium ? (
                    <Lock size={18} className="text-orange-400" />
                  ) : (
                    <Unlock size={18} className="text-emerald-400" />
                  )}
                </div>
                
                <h3 className="text-xl font-medium text-[#101D42] mb-3 leading-tight group-hover:text-[#2563EB] transition-colors">{course.title}</h3>
                
                <div className="flex items-center gap-4 text-xs text-[#9CA3AF] mb-8 font-medium">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {course.duration}</span>
                  <span>•</span>
                  <span>{course.level}</span>
                </div>
              </div>

              {/* Barre de progression (0% par défaut) */}
              <div>
                <div className="flex justify-between text-xs mb-2 font-medium">
                  <span className="text-[#9CA3AF]">Non commencé</span>
                  <span className="text-[#101D42]">0%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-[#101D42] h-1.5 rounded-full" style={{ width: `0%` }}></div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* FENÊTRE MODALE (POP-UP) - DÉTAILS DE LA FORMATION           */}
      {/* ========================================================= */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101D42]/20 backdrop-blur-sm">
          
          {/* Conteneur de la fenêtre */}
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Bouton Fermer */}
            <button 
              onClick={() => setSelectedCourse(null)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors z-10"
            >
              <X size={18} />
            </button>

            {/* En-tête du Modal */}
            <div className="p-8 border-b border-gray-100 bg-[#FAFAFA]">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold tracking-[0.15em] text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-full uppercase">
                  {selectedCourse.category}
                </span>
                {selectedCourse.is_premium && (
                  <span className="text-[10px] font-bold tracking-[0.15em] text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase">
                    Premium
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-medium text-[#101D42] mb-2 leading-tight pr-10">{selectedCourse.title}</h2>
              <p className="text-sm text-[#9CA3AF] font-medium">Formateur : {selectedCourse.instructor}</p>
            </div>

            {/* Corps du Modal (Défilable si trop long) */}
            <div className="p-8 overflow-y-auto flex-1">
              
              <div className="mb-8">
                <h4 className="text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-3">À propos de ce cours</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedCourse.description}</p>
              </div>

              <div className="mb-8">
                <h4 className="text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-4">Compétences acquises</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCourse.learning_outcomes?.map((outcome: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-4">Programme détaillé</h4>
                <div className="space-y-3">
                  {selectedCourse.syllabus?.map((mod: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-xl">
                      <span className="text-sm font-medium text-[#101D42]">{mod.title}</span>
                      <span className="text-xs font-bold text-[#9CA3AF] bg-[#F8FAFC] px-2 py-1 rounded-md">{mod.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pied du Modal (Bouton d'action Fixe en bas) */}
            <div className="p-6 border-t border-gray-100 bg-white flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-1">Tarif</p>
                <p className="text-2xl font-medium text-[#101D42]">
                  {selectedCourse.is_premium ? `${selectedCourse.price} €` : "Inclus"}
                </p>
              </div>
              
              <button 
                onClick={() => handleEnroll(selectedCourse.id, selectedCourse.title, selectedCourse.is_premium, selectedCourse.price)}
                disabled={actionLoading === selectedCourse.id}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold tracking-[0.1em] transition-colors disabled:opacity-50 ${
                  selectedCourse.is_premium 
                    ? "bg-[#101D42] hover:bg-[#1a2b5e] text-white" 
                    : "bg-[#2563EB] hover:bg-blue-700 text-white"
                }`}
              >
                {actionLoading === selectedCourse.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : selectedCourse.is_premium ? (
                  <><Lock size={16} /> DÉBLOQUER L'ACCÈS</>
                ) : (
                  <><PlayCircle size={16} /> COMMENCER</>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}