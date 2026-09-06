"use client";

import { useState } from "react";
import { Search, MessageCircle, Star, Briefcase, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

// Nos fausses données (Mock) pour le prototype
const NETWORK_PROFILES = [
  { id: 1, name: "Sarah Diop", role: "mentor", title: "Senior Product Manager", company: "Jumia Tech", location: "Dakar, Sénégal", tags: ["UX Design", "Agile", "Product"], rating: 4.9 },
  { id: 2, name: "Omar Kane", role: "investor", title: "Investment Director", company: "Africa Tech Ventures", location: "Casablanca, Maroc", tags: ["Series A", "Fintech", "Seed"], rating: 4.8 },
  { id: 3, name: "Marc Olivier", role: "mentor", title: "Directeur Financier", company: "Banque Atlantique", location: "Abidjan, RCI", tags: ["Finance", "Business Plan", "Levée"], rating: 5.0 },
  { id: 4, name: "Fatou Sall", role: "mentor", title: "Marketing Director", company: "Wave Mobile Money", location: "Dakar, Sénégal", tags: ["Growth", "Acquisition", "B2C"], rating: 4.7 },
  { id: 5, name: "TechCorp Africa", role: "corporate", title: "Corporate Partner", company: "TechCorp", location: "Lagos, Nigeria", tags: ["Partenariat", "B2B", "Scale"], rating: null },
];

export default function ReseauPage() {
  const router = useRouter();
  
  // States pour les filtres et la recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("tous");

  // Logique de filtrage instantané
  const filteredProfiles = NETWORK_PROFILES.filter((profile) => {
    // 1. Filtre par onglet (Rôle)
    const matchesFilter = activeFilter === "tous" || profile.role === activeFilter;
    
    // 2. Filtre par texte (Nom, entreprise ou tags)
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      profile.name.toLowerCase().includes(searchLower) || 
      profile.company.toLowerCase().includes(searchLower) ||
      profile.tags.some(tag => tag.toLowerCase().includes(searchLower));

    return matchesFilter && matchesSearch;
  });

  const handleContact = (name: string) => {
    // On simule l'ouverture d'une conversation et on redirige vers les messages
    alert(`💬 Ouverture d'une conversation sécurisée avec ${name}...`);
    router.push("/messages");
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      
      {/* HEADER DE LA PAGE */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Écosystème TechStratix</p>
        <h2 className="text-2xl font-medium text-[#101D42]">Annuaire des Experts & Partenaires</h2>
      </div>

      {/* BARRE DE RECHERCHE & FILTRES */}
      <div className="bg-white p-4 rounded-[24px] border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-10">
        
        {/* Input de recherche */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-[#9CA3AF]" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une compétence, un nom, une entreprise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border-none rounded-full text-sm text-[#101D42] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
          />
        </div>

        {/* Pilules de filtres */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {[
            { id: "tous", label: "Tous les profils" },
            { id: "mentor", label: "Mentors" },
            { id: "investor", label: "Investisseurs" },
            { id: "corporate", label: "Entreprises" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                activeFilter === filter.id
                  ? "bg-[#101D42] text-white shadow-md"
                  : "bg-white border border-gray-200 text-[#9CA3AF] hover:text-[#101D42] hover:border-[#101D42]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRILLE DES RÉSULTATS */}
      {filteredProfiles.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-[24px]">
          <Search size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-[#101D42] font-medium text-lg">Aucun profil ne correspond à votre recherche.</p>
          <p className="text-[#9CA3AF] text-sm mt-2">Essayez d'autres mots-clés ou modifiez vos filtres.</p>
          <button 
            onClick={() => { setSearchQuery(""); setActiveFilter("tous"); }}
            className="mt-6 text-[#2563EB] text-sm font-semibold hover:underline"
          >
            Réinitialiser la recherche
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
          {filteredProfiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm flex flex-col justify-between hover:border-[#2563EB]/40 transition-colors">
              
              {/* En-tête de la carte */}
              <div>
                <div className="flex justify-between items-start mb-5">
                  <div className="w-16 h-16 bg-[#F8FAFC] rounded-2xl border border-gray-100 flex items-center justify-center text-[#101D42] font-serif text-2xl shadow-sm">
                    {profile.name.charAt(0)}
                  </div>
                  {profile.rating && (
                    <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                      <Star size={12} fill="currentColor" /> {profile.rating}
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-medium text-[#101D42] mb-1">{profile.name}</h3>
                
                <div className="space-y-1.5 mb-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#2563EB]">
                    <Briefcase size={14} /> {profile.title} @ {profile.company}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#9CA3AF] font-medium">
                    <MapPin size={14} /> {profile.location}
                  </div>
                </div>
                
                {/* Tags (Compétences) */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {profile.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold tracking-[0.1em] text-[#101D42] bg-[#F8FAFC] border border-gray-200 px-3 py-1.5 rounded-md uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button 
                onClick={() => handleContact(profile.name)}
                className="w-full flex justify-center items-center gap-2 bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:text-[#2563EB] text-[#101D42] py-3.5 rounded-full text-xs font-semibold tracking-wide transition-colors border border-gray-100"
              >
                <MessageCircle size={16} /> CONTACTER
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}