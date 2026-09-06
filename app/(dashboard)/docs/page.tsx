"use client";

import { useState } from "react";
import { FileText, Download, Upload, MoreVertical, Loader2, FileCheck2, Trash2 } from "lucide-react";

// Fausses données pour le prototype
const INITIAL_DOCS = [
  { id: 1, name: "Pitch_Deck_GreenTech_V3.pdf", size: "4.2 MB", date: "Aujourd'hui, 10:30", type: "pdf", uploader: "Alexandre" },
  { id: 2, name: "Previsionnel_Financier_2024.xlsx", size: "1.1 MB", date: "12 Octobre", type: "excel", uploader: "Sarah (Mentor)" },
  { id: 3, name: "Kbis_A_Jour.pdf", size: "0.8 MB", date: "05 Octobre", type: "pdf", uploader: "Alexandre" },
];

export default function DocsPage() {
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Fonction pour simuler l'import d'un document
  const handleUpload = async () => {
    try {
      setIsUploading(true);
      
      // Simulation d'un upload de 2 secondes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDoc = {
        id: Date.now(),
        name: "Nouveau_Document_Signe.pdf",
        size: "2.5 MB",
        date: "À l'instant",
        type: "pdf",
        uploader: "Alexandre"
      };
      
      setDocs([newDoc, ...docs]);
      alert("✅ Document importé avec succès dans votre espace sécurisé.");
    } catch (error: any) {
      alert("❌ Erreur lors de l'import : " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Fonction pour simuler le téléchargement
  const handleDownload = async (id: number, name: string) => {
    try {
      setDownloadingId(id);
      
      // Simulation temps de téléchargement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`✅ Téléchargement de "${name}" terminé !`);
    } catch (error: any) {
      alert("❌ Échec du téléchargement : " + error.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      setDocs(docs.filter(d => d.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Espace sécurisé</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Documents & Data Room</h2>
        </div>
        
        <button 
          onClick={handleUpload}
          disabled={isUploading}
          className="flex items-center gap-2 bg-[#101D42] hover:bg-[#1a2b5e] text-white px-6 py-3 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm disabled:opacity-70"
        >
          {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {isUploading ? "IMPORTATION..." : "IMPORTER UN FICHIER"}
        </button>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        {/* En-tête du tableau (Léger et discret) */}
        <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-[#FAFAFA] text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase">
          <div className="col-span-6 md:col-span-5">Nom du fichier</div>
          <div className="col-span-3 hidden md:block">Ajouté par</div>
          <div className="col-span-4 md:col-span-3">Date d'ajout</div>
          <div className="col-span-2 md:col-span-1 text-right">Taille</div>
        </div>

        {/* Liste des fichiers */}
        <div className="flex-1 overflow-y-auto p-2">
          {docs.length === 0 ? (
            <div className="text-center py-20">
              <FileCheck2 size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-[#9CA3AF] font-medium">Votre espace documentaire est vide.</p>
            </div>
          ) : (
            docs.map((doc) => (
              <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-[#F8FAFC] rounded-2xl transition-colors group border-b border-gray-50 last:border-0">
                
                {/* Icône et Nom */}
                <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#EFF6FF] text-[#2563EB] rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <p className="text-sm font-medium text-[#101D42] truncate pr-4">{doc.name}</p>
                </div>

                {/* Auteur (Caché sur mobile) */}
                <div className="col-span-3 hidden md:flex items-center">
                  <span className="text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-md">
                    {doc.uploader}
                  </span>
                </div>

                {/* Date */}
                <div className="col-span-4 md:col-span-3 flex items-center">
                  <span className="text-xs text-[#9CA3AF] font-medium">{doc.date}</span>
                </div>

                {/* Actions (Télécharger / Supprimer) */}
                <div className="col-span-2 md:col-span-1 flex items-center justify-end gap-2">
                  <p className="text-xs text-gray-400 font-medium hidden md:block mr-2">{doc.size}</p>
                  
                  <button 
                    onClick={() => handleDownload(doc.id, doc.name)}
                    disabled={downloadingId === doc.id}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-[#101D42] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors disabled:opacity-50"
                  >
                    {downloadingId === doc.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:border-red-200 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}