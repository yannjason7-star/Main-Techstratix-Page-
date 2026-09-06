"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BookOpen, Plus, PlayCircle, Lock, Unlock, MoreVertical, FileVideo, Loader2, X, DollarSign } from "lucide-react";

// Le type correspondant à notre table 'courses' dans Supabase
type Course = {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  instructor: string;
  is_premium: boolean;
  price: number;
  description: string;
};

export default function AdminLMSPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la modale de création
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "BUSINESS",
    duration: "",
    level: "Débutant",
    instructor: "",
    is_premium: false,
    price: 0,
    description: ""
  });

  // Charger les vrais cours depuis la base de données
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("title", { ascending: true }); // On trie par ordre alphabétique

      if (error) throw error;
      if (data) setCourses(data as Course[]);
    } catch (error: any) {
      alert("❌ Erreur de chargement : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Publier un nouveau cours
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Insertion dans la table 'courses'
      const { data, error } = await supabase
        .from("courses")
        .insert([{
          title: formData.title,
          category: formData.category,
          duration: formData.duration,
          level: formData.level,
          instructor: formData.instructor,
          is_premium: formData.is_premium,
          price: formData.is_premium ? formData.price : 0,
          description: formData.description
        }])
        .select();

      if (error) throw error;

      if (data) {
        setCourses([data[0], ...courses]); // Met à jour l'interface immédiatement
        setIsModalOpen(false); // Ferme la modale
        
        // Reset du formulaire
        setFormData({ title: "", category: "BUSINESS", duration: "", level: "Débutant", instructor: "", is_premium: false, price: 0, description: "" });
        alert("✅ Nouveau cours publié avec succès ! Les startups peuvent maintenant le voir.");
      }
    } catch (error: any) {
      alert("❌ Erreur de création : " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">E-Learning</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Gestion des Formations (LMS)</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#101D42] hover:bg-[#1a2b5e] text-white px-6 py-3 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm"
        >
          <Plus size={16} /> NOUVEAU COURS
        </button>
      </div>

      {/* TABLEAU DES COURS */}
      <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-[#FAFAFA] text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase">
          <div className="col-span-12 md:col-span-6">Titre du cours & Instructeur</div>
          <div className="col-span-4 md:col-span-2">Accès & Prix</div>
          <div className="col-span-4 md:col-span-3">Niveau & Durée</div>
          <div className="col-span-4 md:col-span-1 text-right">Actions</div>
        </div>

        <div>
          {loading ? (
            <div className="flex justify-center py-20 text-[#2563EB]"><Loader2 className="animate-spin" size={32} /></div>
          ) : courses.length === 0 ? (
            <div className="p-16 text-center text-[#9CA3AF]">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-[#101D42]">Le catalogue est vide.</p>
              <p className="text-sm mt-1">Créez votre première formation pour vos startups.</p>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="grid grid-cols-12 gap-4 p-6 border-b border-gray-50 last:border-0 items-center hover:bg-[#F8FAFC] transition-colors group">
                
                {/* Colonne 1 : Titre */}
                <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <PlayCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#101D42] mb-1">{course.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-[0.1em] text-gray-500 uppercase">{course.category}</span>
                      <span className="text-xs text-gray-400">• Par {course.instructor}</span>
                    </div>
                  </div>
                </div>

                {/* Colonne 2 : Accès */}
                <div className="col-span-4 md:col-span-2 flex flex-col items-start gap-1">
                  {course.is_premium ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md uppercase">
                        <Lock size={12} /> Premium
                      </span>
                      <span className="text-xs font-bold text-[#101D42] ml-1">{course.price} €</span>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
                      <Unlock size={12} /> Inclus
                    </span>
                  )}
                </div>

                {/* Colonne 3 : Détails */}
                <div className="col-span-4 md:col-span-3 flex flex-col gap-1 text-xs text-[#9CA3AF] font-medium">
                  <span className="flex items-center gap-2 text-[#101D42]"><FileVideo size={14} className="text-[#2563EB]"/> {course.level}</span>
                  <span className="ml-5">{course.duration}</span>
                </div>

                {/* Colonne 4 : Actions */}
                <div className="col-span-4 md:col-span-1 flex items-center justify-end gap-6">
                  <button className="text-gray-300 hover:text-[#101D42] transition-colors"><MoreVertical size={18} /></button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================= */}
      {/* MODALE DE CRÉATION DE COURS               */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101D42]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="sticky top-0 z-10 p-6 border-b border-gray-100 flex items-center justify-between bg-white/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg"><BookOpen size={20} /></div>
                <h3 className="text-lg font-bold text-[#101D42]">Publier une formation</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-[#101D42]"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateCourse} className="p-8 space-y-6">
              
              <div>
                <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Titre du cours <span className="text-red-500">*</span></label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" placeholder="Ex: Masterclass Vente B2B" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Catégorie <span className="text-red-500">*</span></label>
                  <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42] bg-white">
                    <option value="BUSINESS">Business & Vente</option>
                    <option value="FINANCE">Finance & Levée</option>
                    <option value="PRODUIT">Produit & Tech</option>
                    <option value="MARKETING">Marketing & Growth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Niveau <span className="text-red-500">*</span></label>
                  <select required value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42] bg-white">
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Durée estimée <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" placeholder="Ex: 2h 30m" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Instructeur / Expert <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.instructor} onChange={(e) => setFormData({...formData, instructor: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" placeholder="Ex: Sarah Diop" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Description du cours <span className="text-red-500">*</span></label>
                <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42] resize-none" placeholder="Ce que les startups vont apprendre..." />
              </div>

              {/* GESTION PREMIUM / MONÉTISATION */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <input 
                    type="checkbox" id="premium" 
                    checked={formData.is_premium} 
                    onChange={(e) => setFormData({...formData, is_premium: e.target.checked})}
                    className="w-5 h-5 rounded border-orange-300 text-orange-600 focus:ring-orange-600"
                  />
                  <label htmlFor="premium" className="text-sm font-bold text-orange-800 flex items-center gap-2 cursor-pointer">
                    <Lock size={16} /> Contenu Premium (Payant)
                  </label>
                </div>
                
                {formData.is_premium && (
                  <div className="ml-8">
                    <label className="block text-xs font-bold tracking-[0.1em] text-orange-800 uppercase mb-2">Prix de vente (€) <span className="text-red-500">*</span></label>
                    <div className="relative w-32">
                      <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" />
                      <input type="number" min="1" required={formData.is_premium} value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full pl-9 pr-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:border-orange-500 text-sm text-[#101D42]" placeholder="99.99" />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-full font-bold tracking-wide text-gray-500 hover:bg-gray-100 transition-colors text-xs">
                  ANNULER
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-4 rounded-full font-bold tracking-wide text-white transition-colors text-xs flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 shadow-md">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : "PUBLIER LE COURS"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}