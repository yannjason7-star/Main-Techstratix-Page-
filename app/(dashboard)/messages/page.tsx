"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Send, Paperclip, MoreVertical, CheckCheck, Loader2, MessageSquare } from "lucide-react";

type Contact = {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
};

// Historique simulé pour valider l'UX
const INITIAL_CHAT = [
  { id: 1, text: "Bonjour ! Comment puis-je vous aider aujourd'hui ? 👋", sender: "them", time: "10:00" },
];

export default function MessagesPage() {
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeChat, setActiveChat] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [messages, setMessages] = useState(INITIAL_CHAT);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages, activeChat]);

  // Chargement des VRAIS contacts depuis la base de données
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Quel est mon rôle ?
        const { data: myProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (!myProfile) return;
        setCurrentUserRole(myProfile.role);

        // 2. Qui ai-je le droit de contacter ?
        let targetRoles: string[] = [];
        if (myProfile.role === 'startup') targetRoles = ['mentor', 'admin'];
        else if (myProfile.role === 'mentor') targetRoles = ['startup', 'admin'];
        else if (myProfile.role === 'investor') targetRoles = ['startup', 'admin'];
        else if (myProfile.role === 'admin') targetRoles = ['startup', 'mentor', 'investor'];

        // 3. Récupérer les profils approuvés correspondants
        const { data: usersData, error } = await supabase
          .from('profiles')
          .select('id, full_name, role, avatar_url')
          .in('role', targetRoles)
          .eq('status', 'approved')
          .neq('id', user.id); // Exclure soi-même

        if (error) throw error;
        if (usersData) setContacts(usersData);

      } catch (error: any) {
        console.error("Erreur chargement contacts:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // Fonction pour envoyer un message (simulé visuellement)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    // Ajout visuel du message
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage("");

    // Simulation de réponse automatique (Effet WOW)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Message bien reçu ! (Ceci est une simulation en attendant l'activation du chat en temps réel).",
        sender: "them",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  const filteredContacts = contacts.filter(c => c.full_name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-[24px] border border-gray-200 shadow-sm flex overflow-hidden max-w-7xl mx-auto">
      
      {/* ========================================== */}
      {/* COLONNE GAUCHE : VRAIE LISTE DE CONTACTS   */}
      {/* ========================================== */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-white min-w-[280px]">
        
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-medium text-[#101D42] mb-4">Messagerie</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-[#9CA3AF]" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un nom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-transparent rounded-full text-sm text-[#101D42] focus:outline-none focus:border-[#2563EB]/30 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#2563EB]" size={24} /></div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">Aucun contact trouvé dans votre réseau.</div>
          ) : (
            filteredContacts.map((contact) => (
              <div 
                key={contact.id}
                onClick={() => { setActiveChat(contact); setMessages(INITIAL_CHAT); }}
                className={`p-5 cursor-pointer transition-colors border-l-2 flex gap-4 items-center ${
                  activeChat?.id === contact.id ? "bg-[#F8FAFC] border-[#2563EB]" : "border-transparent hover:bg-gray-50"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-[#101D42] font-serif text-lg shadow-sm">
                    {contact.full_name.charAt(0)}
                  </div>
                  {/* Pastille en ligne (verte) */}
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[#101D42] truncate">{contact.full_name}</h4>
                  <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#9CA3AF] mt-1">
                    {contact.role}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* COLONNE DROITE : LE CHAT ACTIF             */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col bg-[#FAFAFA]">
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 bg-blue-50 text-[#2563EB] rounded-full flex items-center justify-center mb-6">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-medium text-[#101D42] mb-2">Vos conversations</h3>
            <p className="text-gray-500 max-w-sm">Sélectionnez un contact dans la liste de gauche pour démarrer une discussion sécurisée.</p>
          </div>
        ) : (
          <>
            {/* Header du Chat */}
            <div className="h-[88px] p-6 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#F8FAFC] border border-gray-200 rounded-xl flex items-center justify-center text-[#101D42] font-serif shadow-sm">
                  {activeChat.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-[#101D42]">{activeChat.full_name}</h3>
                  <span className={`text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full ${
                    activeChat.role === 'startup' ? 'bg-blue-50 text-[#2563EB]' :
                    activeChat.role === 'mentor' ? 'bg-emerald-50 text-emerald-600' :
                    activeChat.role === 'investor' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {activeChat.role}
                  </span>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-[#9CA3AF] transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>

            {/* Historique des messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="text-center">
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase bg-gray-100/80 text-gray-400 px-3 py-1 rounded-full">
                  Aujourd'hui
                </span>
              </div>

              {messages.map((msg) => {
                const isMe = msg.sender === "me";
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-end gap-2 max-w-[75%]">
                      <div className={`px-5 py-3.5 text-sm leading-relaxed ${
                        isMe 
                          ? "bg-[#101D42] text-white rounded-[20px] rounded-br-sm shadow-md" 
                          : "bg-white border border-gray-200 text-[#101D42] rounded-[20px] rounded-bl-sm shadow-sm"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 px-1">
                      <span className="text-[10px] font-medium text-[#9CA3AF]">{msg.time}</span>
                      {isMe && <CheckCheck size={14} className="text-[#2563EB]" />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3 bg-[#F8FAFC] border border-gray-200 rounded-2xl p-2 focus-within:border-[#2563EB]/50 focus-within:bg-white transition-all shadow-sm">
                
                <button type="button" className="p-3 text-[#9CA3AF] hover:text-[#101D42] transition-colors shrink-0">
                  <Paperclip size={20} />
                </button>
                
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Écrivez à ${activeChat.full_name.split(' ')[0]}...`}
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-[#101D42] py-3"
                />
                
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:hover:bg-[#2563EB] shrink-0 shadow-md"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}