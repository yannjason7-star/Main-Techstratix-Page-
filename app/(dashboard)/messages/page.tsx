"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Send, Paperclip, MoreVertical, CheckCheck } from "lucide-react";

// Fausses données pour le prototype
const CONVERSATIONS = [
  { id: 1, name: "Sarah Diop", role: "Mentor • Produit", time: "10:42", unread: 2, avatar: "S", active: true },
  { id: 2, name: "Omar Kane", role: "Investisseur", time: "Hier", unread: 0, avatar: "O", active: false },
  { id: 3, name: "Équipe TechStratix", role: "Administration", time: "Lun.", unread: 0, avatar: "T", active: false },
];

const INITIAL_CHAT = [
  { id: 1, text: "Bonjour ! Bienvenue dans le programme d'accélération. 🚀", sender: "them", time: "Hier, 09:00" },
  { id: 2, text: "Merci Sarah ! J'ai hâte de commencer notre première session.", sender: "me", time: "Hier, 09:15" },
  { id: 3, text: "J'ai vu que tu as mis à jour ton Business Plan. Pourrais-tu te concentrer sur la partie 'Modèle de revenus' avant notre appel de demain ?", sender: "them", time: "10:40" },
  { id: 4, text: "Bien sûr, je t'envoie le PDF ce soir.", sender: "me", time: "10:42" },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(CONVERSATIONS[0]);
  const [messages, setMessages] = useState(INITIAL_CHAT);
  const [newMessage, setNewMessage] = useState("");
  
  // Pour faire défiler automatiquement le chat vers le bas quand un message est envoyé
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Fonction pour envoyer un message (simulé)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // 1. On ajoute notre message
    const newMsgObj = {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      time: "À l'instant"
    };
    
    setMessages([...messages, newMsgObj]);
    setNewMessage("");

    // 2. On simule une réponse du mentor 2 secondes plus tard (Effet Wow)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "C'est noté ! J'attends ça avec impatience. 👍",
        sender: "them",
        time: "À l'instant"
      }]);
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-[24px] border border-gray-200 shadow-sm flex overflow-hidden max-w-7xl mx-auto">
      
      {/* ========================================== */}
      {/* COLONNE GAUCHE : LISTE DES CONVERSATIONS */}
      {/* ========================================== */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-white">
        
        {/* Header gauche */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-medium text-[#101D42] mb-4">Messagerie</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-[#9CA3AF]" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une discussion..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border-none rounded-full text-sm text-[#101D42] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
            />
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((conv) => (
            <div 
              key={conv.id}
              onClick={() => setActiveChat(conv)}
              className={`p-5 cursor-pointer transition-colors border-l-2 flex gap-4 ${
                activeChat.id === conv.id 
                  ? "bg-[#F8FAFC] border-[#2563EB]" 
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-[#101D42] font-serif text-lg shadow-sm">
                  {conv.avatar}
                </div>
                {/* Pastille en ligne (verte) */}
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>

              {/* Contenu conversation */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-[#101D42] truncate">{conv.name}</h4>
                  <span className={`text-[10px] font-bold ${conv.unread > 0 ? "text-[#2563EB]" : "text-[#9CA3AF]"}`}>
                    {conv.time}
                  </span>
                </div>
                <p className={`text-xs truncate ${conv.unread > 0 ? "text-[#101D42] font-medium" : "text-[#9CA3AF]"}`}>
                  {conv.role}
                </p>
              </div>

              {/* Badge non lu */}
              {conv.unread > 0 && (
                <div className="w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {conv.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* COLONNE DROITE : LE CHAT ACTIF             */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col bg-[#FAFAFA]">
        
        {/* Header du Chat */}
        <div className="h-[88px] p-6 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#F8FAFC] border border-gray-200 rounded-xl flex items-center justify-center text-[#101D42] font-serif">
              {activeChat.avatar}
            </div>
            <div>
              <h3 className="font-medium text-[#101D42]">{activeChat.name}</h3>
              <p className="text-xs text-[#2563EB] font-medium">{activeChat.role}</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-[#9CA3AF] transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Historique des messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-bold tracking-[0.1em] uppercase bg-gray-100 text-gray-400 px-3 py-1 rounded-full">
              Hier
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender === "me";
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className="flex items-end gap-2 max-w-[70%]">
                  <div className={`px-5 py-3.5 text-sm leading-relaxed ${
                    isMe 
                      ? "bg-[#101D42] text-white rounded-[20px] rounded-br-sm" 
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
          {/* Ancre invisible pour faire défiler automatiquement */}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="flex items-end gap-3 bg-[#F8FAFC] border border-gray-200 rounded-2xl p-2 focus-within:border-[#101D42] transition-colors">
            
            <button type="button" className="p-3 text-[#9CA3AF] hover:text-[#101D42] transition-colors shrink-0">
              <Paperclip size={20} />
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez votre message à Sarah..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-[#101D42] py-3"
            />
            
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:hover:bg-[#2563EB] shrink-0"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}