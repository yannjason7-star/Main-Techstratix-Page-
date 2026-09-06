"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  CheckCircle2, XCircle, ExternalLink, Phone, Loader2, Search, 
  AlertTriangle, PauseCircle, Eye, FileText, Download, FolderOpen, Globe
} from "lucide-react";

type ValidStatus = "pending" | "under_review" | "approved" | "rejected" | "suspended";

type Profile = {
  id: string;
  full_name: string;
  role: string;
  status: ValidStatus;
  phone: string;
  company: string;
  application_details: any;
  rejection_reason: string;
  created_at: string;
  startup_profiles?: any[];
  mentor_profiles?: any[];
  investor_profiles?: any[];
  kyc_documents?: any[];
};

export default function AdminUsersPage() {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ValidStatus>("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Profile | null>(null);
  const [decisionType, setDecisionType] = useState<ValidStatus | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [internalComment, setInternalComment] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setAdminId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*, startup_profiles(*), mentor_profiles(*), investor_profiles(*), kyc_documents(*)")
        .neq("role", "admin")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setCandidates(data as Profile[]);
    } catch (error: any) {
      alert("❌ Erreur de chargement : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const startReview = async (candidate: Profile) => {
    try {
      setActionLoading(candidate.id);
      const { error: updateError } = await supabase.from("profiles").update({ status: "under_review", reviewed_by: adminId, reviewed_at: new Date().toISOString() }).eq("id", candidate.id);
      if (updateError) throw updateError;

      await supabase.from("review_logs").insert([{ profile_id: candidate.id, admin_id: adminId, previous_status: candidate.status, new_status: "under_review", comment: "Prise en charge du dossier" }]);
      setCandidates(candidates.map(c => c.id === candidate.id ? { ...c, status: "under_review" } : c));
    } catch (error: any) {
      alert("❌ Erreur : " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecision = async (id: string, newStatus: ValidStatus, name: string) => {
    try {
      setActionLoading(id);
      const { error } = await supabase.from("profiles").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setCandidates(candidates.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (error: any) {
      alert("❌ Erreur : " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const openDecisionModal = (candidate: Profile, type: ValidStatus) => {
    setSelectedCandidate(candidate);
    setDecisionType(type);
    setRejectionReason(candidate.rejection_reason || "");
    setInternalComment("");
    setModalOpen(true);
  };

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !decisionType || !adminId) return;

    try {
      setActionLoading(selectedCandidate.id);
      const updateData: any = { status: decisionType, reviewed_by: adminId, reviewed_at: new Date().toISOString(), rejection_reason: decisionType === 'rejected' ? rejectionReason : null };
      
      const { error: updateError } = await supabase.from("profiles").update(updateData).eq("id", selectedCandidate.id);
      if (updateError) throw updateError;

      await supabase.from("review_logs").insert([{ profile_id: selectedCandidate.id, admin_id: adminId, previous_status: selectedCandidate.status, new_status: decisionType, comment: internalComment || `Passage au statut ${decisionType}` }]);
      setCandidates(candidates.map(c => c.id === selectedCandidate.id ? { ...c, ...updateData } : c));
      setModalOpen(false);
    } catch (error: any) {
      alert("❌ Erreur : " + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // NOUVEAU : LA VRAIE FONCTION DE TÉLÉCHARGEMENT SECURISE
  const handleDownloadDoc = async (filePath: string) => {
    if (!filePath) return;
    try {
      // Demande une URL signée valable 60 secondes à Supabase
      const { data, error } = await supabase.storage.from('kyc_files').createSignedUrl(filePath, 60);
      if (error) throw error;
      
      if (data?.signedUrl) {
        // Ouvre le PDF téléchargé dans un nouvel onglet
        window.open(data.signedUrl, '_blank');
      }
    } catch (error: any) {
      alert("❌ Erreur d'accès au document : " + error.message);
    }
  };

  const getDetails = (c: Profile) => {
    let d = c.role === 'startup' ? c.startup_profiles : c.role === 'mentor' ? c.mentor_profiles : c.investor_profiles;
    if (Array.isArray(d)) return d[0] || {}; 
    return d || {}; 
  };

  const filteredCandidates = candidates.filter(c => {
    const details = getDetails(c);
    const companyName = c.company || details.startup_name || details.fund_name || "";
    return c.status === activeTab && (
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Modération & Rôles</p>
        <h2 className="text-2xl font-medium text-[#101D42]">Utilisateurs & Matching</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-200 pb-4">
        <div className="flex gap-4 text-sm font-medium overflow-x-auto w-full md:w-auto hide-scrollbar">
          {[
            { id: "pending", label: "Nouveaux" }, { id: "under_review", label: "En Examen" },
            { id: "approved", label: "Approuvés" }, { id: "rejected", label: "Refusés" }, { id: "suspended", label: "Suspendus" }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as ValidStatus)} className={`pb-2 px-1 whitespace-nowrap transition-colors relative ${activeTab === tab.id ? "text-[#101D42] border-b-2 border-[#101D42] font-bold" : "text-[#9CA3AF] hover:text-[#101D42]"}`}>
              {tab.label} <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full ml-1">{candidates.filter(c => c.status === tab.id).length}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#2563EB]" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-[#2563EB]"><Loader2 className="animate-spin" size={32} /></div>
      ) : filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center text-[#9CA3AF] shadow-sm"><CheckCircle2 size={48} className="mx-auto mb-4 text-gray-300" /><p className="text-lg font-medium text-[#101D42]">Aucun dossier ici.</p></div>
      ) : (
        <div className="space-y-6">
          {filteredCandidates.map((candidate) => {
            const details = getDetails(candidate);
            const displayCompany = candidate.company || details.startup_name || details.fund_name || "Organisation non spécifiée";

            return (
              <div key={candidate.id} className="bg-white rounded-[24px] border border-gray-200 shadow-sm flex flex-col transition-all hover:border-[#2563EB]/30 overflow-hidden">
                
                <div className="p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
                  
                  {/* Infos principales */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full ${candidate.role === 'startup' ? 'bg-blue-50 text-[#2563EB]' : candidate.role === 'mentor' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                        {candidate.role}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {new Date(candidate.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium text-[#101D42]">{candidate.full_name}</h3>
                      <p className="text-sm text-[#9CA3AF] font-medium flex items-center gap-2 mt-1">
                        {displayCompany}
                        {candidate.phone && <><span className="w-1 h-1 bg-gray-300 rounded-full"></span> <Phone size={12} /> {candidate.phone}</>}
                      </p>
                    </div>

                    <div className="bg-[#F8FAFC] p-5 rounded-2xl text-sm space-y-3 text-gray-600 border border-gray-100 min-h-[80px]">
                      {(!details || Object.keys(details).length === 0) ? (
                        <p className="text-xs text-gray-400 italic flex items-center gap-2 h-full">
                          <AlertTriangle size={14} className="text-orange-400" /> Ce candidat n'a pas encore complété son dossier.
                        </p>
                      ) : (
                        <>
                          {details.description && candidate.role === 'startup' && <p className="italic text-[#101D42]">"{details.description}"</p>}
                          {details.sector && candidate.role === 'startup' && <p><strong>Secteur :</strong> {details.sector}</p>}
                          
                          {details.expertise_domain && <p><strong>Expertise :</strong> {details.expertise_domain}</p>}
                          {details.years_experience !== undefined && <p><strong>Expérience :</strong> {details.years_experience} ans</p>}
                          {details.bio && <p className="italic">"{details.bio}"</p>}
                          {details.availability && <p><strong>Disponibilité :</strong> {details.availability}</p>}
                          
                          {details.target_sectors && <p><strong>Cibles :</strong> {details.target_sectors}</p>}
                          {details.ticket_size && <p><strong>Ticket cible :</strong> {details.ticket_size}</p>}
                          {details.investment_thesis && <p className="italic">"{details.investment_thesis}"</p>}
                          
                          {details.linkedin_url && (
                            <a href={details.linkedin_url.startsWith('http') ? details.linkedin_url : `https://${details.linkedin_url}`} target="_blank" rel="noreferrer" className="text-[#2563EB] inline-flex items-center gap-1.5 hover:underline font-medium mt-2">
                              <ExternalLink size={14} /> Profil LinkedIn
                            </a>
                          )}
                          {details.website && (
                            <a href={details.website.startsWith('http') ? details.website : `https://${details.website}`} target="_blank" rel="noreferrer" className="text-[#101D42] inline-flex items-center gap-1.5 hover:underline font-medium mt-2 ml-4">
                              <Globe size={14} /> Site Web
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* DOCUMENTS JOINTS */}
                  <div className="lg:w-1/3 flex flex-col space-y-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
                    <h4 className="text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase flex items-center gap-2">
                      <FolderOpen size={16} className="text-[#9CA3AF]" /> Pièces jointes
                    </h4>
                    
                    <div className="space-y-2">
                      {/* BOUTON CORRIGÉ POUR LE PITCH DECK DE STARTUP */}
                      {candidate.role === 'startup' && details?.pitch_deck_path && (
                        <button onClick={() => handleDownloadDoc(details.pitch_deck_path)} className="w-full flex items-center justify-between bg-white border border-gray-200 hover:border-[#2563EB] p-3 rounded-xl transition-colors group text-left">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg shrink-0"><FileText size={16} /></div>
                            <span className="text-xs font-medium text-[#101D42] truncate">Pitch Deck</span>
                          </div>
                          <Download size={14} className="text-gray-400 group-hover:text-[#2563EB] shrink-0" />
                        </button>
                      )}

                      {/* BOUTON CORRIGÉ POUR LES AUTRES DOCUMENTS (Mentor/Investor) */}
                      {candidate.kyc_documents && candidate.kyc_documents.length > 0 ? (
                        candidate.kyc_documents.map((doc: any, i: number) => (
                          <button key={i} onClick={() => handleDownloadDoc(doc.storage_path)} className="w-full flex items-center justify-between bg-white border border-gray-200 hover:border-[#2563EB] p-3 rounded-xl transition-colors group text-left">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="p-2 bg-gray-50 text-gray-500 rounded-lg shrink-0"><FileText size={16} /></div>
                              <span className="text-xs font-medium text-[#101D42] truncate">{doc.file_name}</span>
                            </div>
                            <Download size={14} className="text-gray-400 group-hover:text-[#2563EB] shrink-0" />
                          </button>
                        ))
                      ) : (
                        candidate.role !== 'startup' && <p className="text-xs text-gray-400 italic">Aucun document fourni.</p>
                      )}
                      
                      {candidate.role === 'startup' && !details?.pitch_deck_path && (
                        <p className="text-xs text-gray-400 italic">Aucun Pitch Deck fourni.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* BOUTONS D'ACTION */}
                <div className="bg-[#F8FAFC] border-t border-gray-100 p-4 lg:px-8 flex justify-end gap-3">
                  {candidate.status === "pending" && (
                    <button onClick={() => startReview(candidate)} disabled={actionLoading === candidate.id} className="flex items-center justify-center gap-2 bg-[#101D42] hover:bg-[#1a2b5e] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all disabled:opacity-50">
                      {actionLoading === candidate.id ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />} PRENDRE EN CHARGE
                    </button>
                  )}

                  {candidate.status === "under_review" && (
                    <>
                      <button onClick={() => openDecisionModal(candidate, "rejected")} className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 px-6 py-2.5 rounded-full text-xs font-bold transition-all border border-red-200">
                        <XCircle size={16} /> REFUSER
                      </button>
                      <button onClick={() => openDecisionModal(candidate, "approved")} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm">
                        <CheckCircle2 size={16} /> APPROUVER LE DOSSIER
                      </button>
                    </>
                  )}

                  {candidate.status === "approved" && (
                    <button onClick={() => openDecisionModal(candidate, "suspended")} className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-600 px-6 py-2.5 rounded-full text-xs font-bold transition-all border border-gray-200">
                      <PauseCircle size={16} /> SUSPENDRE L'ACCÈS
                    </button>
                  )}

                  {(candidate.status === "rejected" || candidate.status === "suspended") && (
                    <button onClick={() => handleDecision(candidate.id, "under_review", candidate.full_name)} className="flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-[#2563EB] px-6 py-2.5 rounded-full text-xs font-bold transition-all border border-blue-200">
                      <AlertTriangle size={16} /> RÉEXAMINER
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODALE DE DÉCISION */}
      {modalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101D42]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl">
            <div className={`p-6 border-b border-gray-100 flex items-center gap-4 ${decisionType === 'approved' ? 'bg-emerald-50 text-emerald-700' : decisionType === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'}`}>
              {decisionType === 'approved' ? <CheckCircle2 size={24} /> : decisionType === 'rejected' ? <XCircle size={24} /> : <AlertTriangle size={24} />}
              <div>
                <h3 className="text-lg font-bold">Confirmer l'action</h3>
                <p className="text-xs opacity-80">Dossier de {selectedCandidate.full_name}</p>
              </div>
            </div>
            <form onSubmit={handleDecisionSubmit} className="p-8 space-y-6">
              {decisionType === 'rejected' && (
                <div>
                  <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Motif du refus <span className="text-red-500">*</span></label>
                  <textarea required rows={3} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 text-sm text-[#101D42] resize-none" placeholder="Ce message sera visible par le candidat." />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold tracking-[0.1em] text-[#101D42] uppercase mb-2">Commentaire interne (Optionnel)</label>
                <input type="text" value={internalComment} onChange={(e) => setInternalComment(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2563EB] text-sm text-[#101D42]" placeholder="Note privée pour l'équipe..." />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3.5 rounded-full font-semibold text-gray-500 hover:bg-gray-100 transition-colors text-sm">ANNULER</button>
                <button type="submit" disabled={actionLoading === selectedCandidate.id} className={`flex-1 py-3.5 rounded-full font-semibold text-white transition-colors text-sm flex items-center justify-center gap-2 ${decisionType === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : decisionType === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
                  {actionLoading === selectedCandidate.id ? <Loader2 size={16} className="animate-spin" /> : "CONFIRMER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}