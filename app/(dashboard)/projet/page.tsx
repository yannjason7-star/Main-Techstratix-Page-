"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Target, CheckCircle2, Circle, Plus, Loader2, Trash2 } from "lucide-react";

export default function ProjetPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchSessionAndTasks();
  }, []);

  const fetchSessionAndTasks = async () => {
    setLoading(true);
    // Utilisation de getUser() qui est beaucoup plus fiable et sécurisé que getSession()
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (user) {
      setUserId(user.id);
      
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        alert("Erreur de lecture : " + error.message);
      }
      if (data) setTasks(data);
    } else {
      console.log("Utilisateur non détecté.");
    }
    setLoading(false);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    // Si l'utilisateur n'est pas détecté, on le dit !
    if (!userId) {
      alert("Erreur : Votre session est introuvable. Essayez de vous déconnecter et vous reconnecter.");
      return;
    }

    setAdding(true);
    
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        { 
          user_id: userId, 
          title: newTaskTitle, 
          status: "todo" 
        }
      ])
      .select();

    // Si Supabase bloque l'action, on affiche l'erreur exacte
    if (error) {
      alert("Erreur Supabase : " + error.message);
      console.error(error);
    }

    if (data && data.length > 0) {
      setTasks([data[0], ...tasks]);
      setNewTaskTitle("");
    }
    
    setAdding(false);
  };

  const toggleTaskStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "done" ? "todo" : "done";
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id);
      
    if (error) alert("Erreur mise à jour : " + error.message);
  };

  const deleteTask = async (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) alert("Erreur suppression : " + error.message);
  };

  return (
    <div className="max-w-4xl bg-white rounded-[24px] border border-gray-200 p-10 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9CA3AF] uppercase mb-2">Feuille de route</p>
          <h2 className="text-2xl font-medium text-[#101D42]">Mes Objectifs</h2>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="mb-10 flex gap-4">
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Nouvelle étape pour ma startup..." 
          className="flex-1 border border-gray-200 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#101D42] text-[#101D42]"
          disabled={adding}
        />
        <button 
          type="submit" 
          disabled={adding || !newTaskTitle.trim()}
          className="bg-[#101D42] text-white px-6 py-3 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 disabled:opacity-50 hover:bg-[#1a2b5e] transition-colors"
        >
          {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} 
          AJOUTER
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-[#9CA3AF]">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl">
          <Target size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-[#9CA3AF] font-medium">Aucun objectif pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const isDone = task.status === "done";
            return (
              <div key={task.id} className="flex gap-4 items-center group bg-white border border-gray-100 hover:border-gray-200 p-5 rounded-2xl transition-all">
                <button onClick={() => toggleTaskStatus(task.id, task.status)} className="mt-0.5 flex-shrink-0">
                  {isDone ? <CheckCircle2 className="text-[#2563EB]" size={24} /> : <Circle className="text-gray-300 hover:text-[#101D42] transition-colors" size={24} />}
                </button>
                <div className="flex-1">
                  <h3 className={`text-base font-medium transition-colors ${isDone ? 'text-[#9CA3AF] line-through' : 'text-[#101D42]'}`}>
                    {task.title}
                  </h3>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}