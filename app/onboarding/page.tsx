"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Rocket, Users, TrendingUp, Building2, Globe, FileText, AlertTriangle, UploadCloud, MapPin, Clock, Award, ShieldCheck, Briefcase, LogOut } from "lucide-react";import Link from "next/link";
import BorderGlow from "@/components/BorderGlow";
import StarBorder from "@/components/StarBorder";
import { motion } from "framer-motion";

export default function OnboardingPage() {
  const router = useRouter();
  
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // States unifiés pour tous les formulaires
  const [formData, setFormData] = useState({
    name: "", // startup_name, fund_name
    sector: "", // secteut de la startup, ou target_sectors de l'investor
    customSector: "",
    country: "",
    city: "",
    linkedin: "",
    website: "",
    description: "", // pitch, bio, ou investment_thesis
    experience: 0,
    availability: "", 
    ticketSize: "" // Pour l'investisseur
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [shakeTerms, setShakeTerms] = useState(false);

  // Fichiers (CV, Pitch, Justificatifs...)
  const [mainFile, setMainFile] = useState<File | null>(null); 
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null); 
// Fonction pour quitter proprement et reprendre plus tard
  const handleSignOut = async () => {
    if (confirm("Voulez-vous vraiment vous déconnecter ? Vous pourrez reprendre ce formulaire plus tard en vous reconnectant.")) {
      setSaving(true);
      await supabase.auth.signOut();
      router.push("/");
    }
  };
  // Verrouillage de la page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSubmitted && (formData.name || formData.description)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, isSubmitted]);

  // Initialisation
  useEffect(() => {
    const initOnboarding = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: profile } = await supabase.from("profiles").select("role, status").eq("id", user.id).single();
      if (!profile || profile.status === "approved" || profile.status === "under_review" || profile.status === "rejected") {
        return router.push("/dashboard");
      }

      let hasCompletedData = false;
      if (profile.role === 'startup') {
        const { data } = await supabase.from('startup_profiles').select('profile_id').eq('profile_id', user.id).single();
        if (data) hasCompletedData = true;
      } else if (profile.role === 'mentor') {
        const { data } = await supabase.from('mentor_profiles').select('profile_id').eq('profile_id', user.id).single();
        if (data) hasCompletedData = true;
      } else if (profile.role === 'investor') {
        const { data } = await supabase.from('investor_profiles').select('profile_id').eq('profile_id', user.id).single();
        if (data) hasCompletedData = true;
      }

      if (hasCompletedData) {
        setIsSubmitted(true);
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      setUserId(user.id);
      setUserRole(profile.role);
      setLoading(false);
    };
    initOnboarding();
  }, [router]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!termsAccepted) {
      setShakeTerms(true);
      setTimeout(() => setShakeTerms(false), 500);
      return;
    }

    setSaving(true);

    try {
      if (!userId || !userRole) throw new Error("Erreur d'identification.");

      const finalSector = formData.sector === "Autre" ? formData.customSector : formData.sector;

      // ==========================================
      // NOUVEAU : FONCTION D'UPLOAD SÉCURISÉ
      // ==========================================
      const uploadFile = async (file: File, prefix: string) => {
        const fileExt = file.name.split('.').pop();
        // On nettoie le nom du fichier pour éviter les bugs (espaces, accents...)
        const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        // Le chemin : ID_UTILISATEUR / PREFIX_TIMESTAMP_NOMFICHIER
        const filePath = `${userId}/${prefix}_${Date.now()}_${cleanName}`;
        
        const { error: uploadError } = await supabase.storage.from('kyc_files').upload(filePath, file);
        if (uploadError) throw new Error(`Erreur d'upload de ${file.name} : ${uploadError.message}`);
        return filePath; // On retourne l'adresse sécurisée
      };

      let mainFilePath = null;
      let secondaryFilePath = null;

      // On lance les vrais uploads dans Supabase Storage avant de sauvegarder le texte
      if (mainFile) mainFilePath = await uploadFile(mainFile, 'main');
      if (secondaryFile) secondaryFilePath = await uploadFile(secondaryFile, 'secondary');

      // ==========================================
      // SAUVEGARDE EN BASE DE DONNÉES
      // ==========================================
      if (formData.country || formData.city) {
        const { error: profileError } = await supabase.from("profiles")
          .update({ country: formData.country, city: formData.city })
          .eq("id", userId);
        if (profileError) throw profileError;
      }

      if (userRole === "startup") {
        const { error } = await supabase.from("startup_profiles").insert([{
          profile_id: userId, startup_name: formData.name, sector: finalSector, description: formData.description, website: formData.website || null,
          pitch_deck_path: mainFilePath // LE VRAI CHEMIN !
        }]);
        if (error) throw error;
      } 
      else if (userRole === "mentor") {
        const { error } = await supabase.from("mentor_profiles").insert([{
          profile_id: userId, expertise_domain: finalSector, bio: formData.description, years_experience: formData.experience, 
          linkedin_url: formData.linkedin, availability: formData.availability
        }]);
        if (error) throw error;
        
        if (mainFile && mainFilePath) await supabase.from("kyc_documents").insert([{ profile_id: userId, document_type: 'other', storage_path: mainFilePath, file_name: mainFile.name }]);
        if (secondaryFile && secondaryFilePath) await supabase.from("kyc_documents").insert([{ profile_id: userId, document_type: 'other', storage_path: secondaryFilePath, file_name: secondaryFile.name }]);
      } 
      else if (userRole === "investor") {
        const { error } = await supabase.from("investor_profiles").insert([{
          profile_id: userId, fund_name: formData.name, target_sectors: finalSector, ticket_size: formData.ticketSize, 
          linkedin_url: formData.linkedin, investment_thesis: formData.description
        }]);
        if (error) throw error;

        if (mainFile && mainFilePath) await supabase.from("kyc_documents").insert([{ profile_id: userId, document_type: 'id_card', storage_path: mainFilePath, file_name: mainFile.name }]);
      }

      // Déconnexion finale
      await supabase.auth.signOut();
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error: any) {
      setErrorMsg("Erreur lors de l'enregistrement : " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]"><Loader2 className="animate-spin text-[#2563EB]" size={40} /></div>;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-[32px] p-12 text-center border border-gray-200 shadow-xl">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-serif text-[#101D42] mb-4">Dossier transmis</h2>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-10">
            Votre dossier a bien été enregistré en toute sécurité. Il est actuellement en cours d’analyse par notre comité de sélection. Vous recevrez une notification prochainement.
          </p>
          <Link href="/login" className="inline-block w-full bg-[#101D42] hover:bg-[#1a2b5e] text-white font-semibold py-4 rounded-full transition-colors tracking-wide">
            RETOURNER À L'ACCUEIL
          </Link>
        </div>
      </div>
    );
  }

  return (
    
<div className="min-h-screen bg-[#FAFAFA] pb-12"> 
  

        <div className="max-w-3xl mx-auto"> </div>


      
      {/* NOUVEAU : HEADER DE DÉCONNEXION */}
      <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#101D42] rounded flex items-center justify-center shadow-sm">
            <span className="text-white font-serif font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-[#101D42] hidden sm:block">TechStratix</span>
        </div>
        
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors bg-gray-50 hover:bg-red-50 px-4 py-2 rounded-full"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Quitter et reprendre plus tard</span>
        </button>
      </header>

      <div className="max-w-3xl mx-auto pt-12 px-4 sm:px-6">
        
        {/* HEADER DYNAMIQUE (Déjà existant) */}
        <div className="text-center mb-12"></div>
        {/* HEADER DYNAMIQUE */}
        <div className="text-center mb-12">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ${userRole === 'startup' ? 'bg-[#101D42] text-[#2563EB]' : userRole === 'mentor' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
            {userRole === "startup" && <Rocket size={32} />}
            {userRole === "mentor" && <Users size={32} />}
            {userRole === "investor" && <TrendingUp size={32} />}
          </div>
          <h1 className="text-3xl font-serif text-[#101D42] mb-3">Constitution du Dossier</h1>
          <p className="text-[#9CA3AF] font-medium">Étape finale pour accéder à l'écosystème TechStratix.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* ======================================================== */}
          {/* FORMULAIRE STARTUP                                       */}
          {/* ======================================================== */}
          {userRole === "startup" && (
            <>
              <BorderGlow backgroundColor="#ffffff" className="p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-[#101D42]/10 pb-4">
                  <Building2 className="text-[#2563EB]" size={20} />
                  <h2 className="text-xl font-medium text-[#101D42]">Identité de l'entreprise</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Nom de la startup <span className="text-red-500">*</span></label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-[#2563EB] text-sm bg-white" placeholder="Ex: TechStratix Solutions" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Secteur d'activité <span className="text-red-500">*</span></label>
                      <select required value={formData.sector} onChange={(e) => setFormData({...formData, sector: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-[#2563EB] text-sm bg-white">
                        <option value="" disabled>Sélectionnez un secteur</option>
                        <option value="FinTech">FinTech</option>
                        <option value="AgriTech">AgriTech</option>
                        <option value="HealthTech">HealthTech</option>
                        <option value="EdTech">EdTech</option>
                        <option value="SaaS B2B">SaaS B2B</option>
                        <option value="Autre">Autre (Préciser)</option>
                      </select>
                    </div>
                    {formData.sector === "Autre" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                        <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Précisez le secteur <span className="text-red-500">*</span></label>
                        <input type="text" required value={formData.customSector} onChange={(e) => setFormData({...formData, customSector: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-[#2563EB] text-sm bg-white" />
                      </motion.div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Pays d'opération <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-[#2563EB] text-sm bg-white" placeholder="Ex: Sénégal" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Ville principale <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-[#2563EB] text-sm bg-white" placeholder="Ex: Dakar" />
                    </div>
                  </div>
                </div>
              </BorderGlow>

              <BorderGlow backgroundColor="#ffffff" className="p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-[#101D42]/10 pb-4">
                  <FileText className="text-[#2563EB]" size={20} />
                  <h2 className="text-xl font-medium text-[#101D42]">Le Projet & Documents</h2>
                </div>
                <div className="space-y-8">
                  <div>
                    <label className="flex justify-between text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">
                      <span>Résumé Exécutif (Pitch) <span className="text-red-500">*</span></span>
                      <span className={`${formData.description.length > 250 ? 'text-red-500' : 'text-[#9CA3AF]'}`}>{formData.description.length}/250</span>
                    </label>
                    <textarea required maxLength={250} rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-[#2563EB] text-sm bg-white resize-none" placeholder="En une phrase claire, quel problème résolvez-vous et pour qui ?" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Pitch Deck <span className="text-red-500">*</span></label>
                    <div className="border-2 border-dashed border-[#2563EB]/40 bg-[#EFF6FF]/50 rounded-2xl p-8 text-center hover:bg-[#EFF6FF] hover:border-[#2563EB] transition-colors cursor-pointer relative shadow-sm">
                      <input type="file" required={!mainFile} accept=".pdf" onChange={(e) => setMainFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <UploadCloud size={32} className="mx-auto text-[#2563EB] mb-3" />
                      <p className="text-sm font-medium text-[#101D42] mb-1">{mainFile ? mainFile.name : "Glissez-déposez votre PDF ici"}</p>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </>
          )}

          {/* ======================================================== */}
          {/* FORMULAIRE MENTOR                                        */}
          {/* ======================================================== */}
          {userRole === "mentor" && (
            <>
              {/* Le code mentor précédent... */}
              <BorderGlow backgroundColor="#ffffff" className="p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-[#101D42]/10 pb-4">
                  <MapPin className="text-emerald-500" size={20} />
                  <h2 className="text-xl font-medium text-[#101D42]">Identité & Vérification</h2>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Pays <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-emerald-500 text-sm bg-white" placeholder="Ex: Côte d'Ivoire" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Ville <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-emerald-500 text-sm bg-white" placeholder="Ex: Abidjan" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Lien LinkedIn <span className="text-red-500">*</span></label>
                    <input type="url" required value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-emerald-500 text-sm bg-white" placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>
              </BorderGlow>

              <BorderGlow backgroundColor="#ffffff" className="p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-[#101D42]/10 pb-4">
                  <Award className="text-emerald-500" size={20} />
                  <h2 className="text-xl font-medium text-[#101D42]">Expertise & Parcours</h2>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Domaine d'expertise <span className="text-red-500">*</span></label>
                      <select required value={formData.sector} onChange={(e) => setFormData({...formData, sector: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-emerald-500 text-sm bg-white">
                        <option value="" disabled>Sélectionnez</option>
                        <option value="Stratégie & Go-to-Market">Stratégie & Go-to-Market</option>
                        <option value="Finance & Levée">Finance & Levée</option>
                        <option value="Produit & Tech (CTO)">Produit & Tech (CTO)</option>
                        <option value="Marketing & Growth">Marketing & Growth</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Années d'expérience <span className="text-red-500">*</span></label>
                      <input type="number" min="0" required value={formData.experience} onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-emerald-500 text-sm bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Biographie <span className="text-red-500">*</span></label>
                    <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-emerald-500 text-sm bg-white resize-none" placeholder="Présentez votre parcours..." />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">CV (PDF) <span className="text-red-500">*</span></label>
                    <div className="border-2 border-dashed border-emerald-500/40 bg-emerald-50/50 rounded-2xl p-6 text-center hover:bg-emerald-50 transition-colors cursor-pointer relative shadow-sm">
                      <input type="file" required={!mainFile} accept=".pdf" onChange={(e) => setMainFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <p className="text-sm font-medium text-[#101D42]">{mainFile ? mainFile.name : "Importer votre CV"}</p>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </>
          )}

          {/* ======================================================== */}
          {/* FORMULAIRE INVESTISSEUR                                  */}
          {/* ======================================================== */}
          {userRole === "investor" && (
            <>
              <BorderGlow backgroundColor="#ffffff" className="p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-[#101D42]/10 pb-4">
                  <Building2 className="text-orange-500" size={20} />
                  <h2 className="text-xl font-medium text-[#101D42]">Structure d'investissement</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Nom du Fonds / Business Angel <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-orange-500 text-sm bg-white" placeholder="Ex: Africa Tech Ventures" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Ticket d'investissement <span className="text-red-500">*</span></label>
                      <select required value={formData.ticketSize} onChange={(e) => setFormData({...formData, ticketSize: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-orange-500 text-sm bg-white">
                        <option value="" disabled>Sélectionnez un montant</option>
                        <option value="< 50k€">&lt; 50k€ (Pre-seed)</option>
                        <option value="50k€ - 200k€">50k€ - 200k€ (Seed)</option>
                        <option value="200k€ - 1M€">200k€ - 1M€ (Serie A)</option>
                        <option value="> 1M€">&gt; 1M€ (Serie B+)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Pays du siège <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-orange-500 text-sm bg-white" placeholder="Ex: France" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Ville <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-orange-500 text-sm bg-white" placeholder="Ex: Paris" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Profil LinkedIn du Partenaire <span className="text-red-500">*</span></label>
                    <input type="url" required value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-orange-500 text-sm bg-white" placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>
              </BorderGlow>

              <BorderGlow backgroundColor="#ffffff" className="p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-[#101D42]/10 pb-4">
                  <Briefcase className="text-orange-500" size={20} />
                  <h2 className="text-xl font-medium text-[#101D42]">Thèse d'investissement & KYC</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Secteurs ciblés <span className="text-red-500">*</span></label>
                    <input type="text" required value={formData.sector} onChange={(e) => setFormData({...formData, sector: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-orange-500 text-sm bg-white" placeholder="Ex: FinTech, SaaS, IA..." />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Thèse d'investissement (Description) <span className="text-red-500">*</span></label>
                    <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-[#101D42]/15 shadow-sm focus:outline-none focus:border-orange-500 text-sm bg-white resize-none" placeholder="Expliquez brièvement votre stratégie d'investissement et la valeur que vous apportez..." />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.1em] text-[#9CA3AF] uppercase mb-2">Preuve d'Accréditation / Identité <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-500 mb-3">Pour accéder aux données confidentielles des startups, veuillez fournir un Kbis ou une pièce d'identité.</p>
                    <div className="border-2 border-dashed border-orange-500/40 bg-orange-50/50 rounded-2xl p-6 text-center hover:bg-orange-50 transition-colors cursor-pointer relative shadow-sm">
                      <input type="file" required={!mainFile} accept=".pdf,.jpg,.png" onChange={(e) => setMainFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <ShieldCheck size={24} className="mx-auto text-orange-500 mb-2" />
                      <p className="text-sm font-medium text-[#101D42]">{mainFile ? mainFile.name : "Importer votre document sécurisé"}</p>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </>
          )}

          {/* CONDITIONS & SUBMIT (Commun aux 3 rôles) */}
          <div className="pt-8">
            <motion.div animate={shakeTerms ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="flex items-start gap-3 mb-8 bg-white p-5 rounded-2xl border border-[#101D42]/15 shadow-sm">
              <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className={`mt-1 w-5 h-5 rounded border-gray-300 focus:ring-2 ${userRole === 'mentor' ? 'text-emerald-500 focus:ring-emerald-500' : userRole === 'investor' ? 'text-orange-500 focus:ring-orange-500' : 'text-[#2563EB] focus:ring-[#2563EB]'}`} />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                Je certifie que les informations fournies sont exactes. J'accepte que mon dossier soit examiné par le comité TechStratix.
              </label>
            </motion.div>

            {errorMsg && <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2 border border-red-100"><AlertTriangle size={18} /> {errorMsg}</div>}

            <StarBorder as="button" type="submit" disabled={saving} color={userRole === 'mentor' ? '#10b981' : userRole === 'investor' ? '#f97316' : '#2563EB'} className="w-full font-bold tracking-widest text-sm uppercase shadow-xl">
              {saving ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18} /> ENREGISTREMENT...</span> : "SOUMETTRE MON DOSSIER DÉFINITIF"}
            </StarBorder>
          </div>

        </form>
      </div>
    </div>
  );
}