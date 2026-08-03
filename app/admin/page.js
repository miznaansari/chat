"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  LogOut,
  Sparkles,
  Search,
  User,
  Users,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Layers,
  ArrowLeft,
  X
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State for Adding / Editing Character
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    category: "Your Sales",
    filterGroup: "assistants",
    badge: "NEW",
    badgeBg: "bg-amber-400 text-black font-extrabold shadow-amber-500/20",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    chatsCount: 0,
    rating: "4.9",
    story: "",
    isPublic: true,
    personas: [{ name: "", persona: "" }],
  });

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setAdmin(data.admin);
      fetchAdminCharacters();
    } catch (err) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminCharacters = async () => {
    try {
      const res = await fetch("/api/admin/discover-characters");
      if (res.ok) {
        const data = await res.json();
        setCharacters(data.characters || []);
      }
    } catch (err) {
      console.error("Failed to load admin characters", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingChar(null);
    setFormData({
      name: "",
      tagline: "",
      category: "Your Sales",
      filterGroup: "assistants",
      badge: "NEW",
      badgeBg: "bg-amber-400 text-black font-extrabold shadow-amber-500/20",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      chatsCount: 0,
      rating: "4.9",
      story: "",
      isPublic: true,
      personas: [{ name: "", persona: "" }],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (char) => {
    setEditingChar(char);
    const parsedPersonas = Array.isArray(char.characters) && char.characters.length > 0
      ? char.characters
      : [{ name: char.name, persona: char.tagline }];

    setFormData({
      name: char.name || "",
      tagline: char.tagline || "",
      category: char.category || "Your Sales",
      filterGroup: char.filterGroup || "assistants",
      badge: char.badge || "NEW",
      badgeBg: char.badgeBg || "bg-amber-400 text-black font-extrabold shadow-amber-500/20",
      avatar: char.avatar || "",
      chatsCount: char.chatsCount || 0,
      rating: char.rating || "4.9",
      story: char.story || "",
      isPublic: char.isPublic !== undefined ? char.isPublic : true,
      personas: parsedPersonas,
    });
    setIsModalOpen(true);
  };

  const handleAddPersonaRow = () => {
    setFormData((prev) => ({
      ...prev,
      personas: [...prev.personas, { name: "", persona: "" }],
    }));
  };

  const handleRemovePersonaRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      personas: prev.personas.filter((_, i) => i !== index),
    }));
  };

  const handlePersonaChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.personas];
      updated[index][field] = value;
      return { ...prev, personas: updated };
    });
  };

  const handleSubmitCharacter = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const validPersonas = formData.personas
      .filter((p) => p.name.trim())
      .map((p) => ({
        name: p.name.trim(),
        persona: p.persona.trim() || `${p.name} character persona description.`,
      }));

    if (validPersonas.length === 0) {
      validPersonas.push({
        name: formData.name.trim(),
        persona: formData.tagline.trim(),
      });
    }

    const payload = {
      name: formData.name.trim(),
      tagline: formData.tagline.trim(),
      category: formData.category,
      filterGroup: formData.filterGroup,
      badge: formData.badge,
      badgeBg: formData.badgeBg,
      avatar: formData.avatar.trim(),
      chatsCount: parseInt(formData.chatsCount) || 0,
      rating: formData.rating,
      story: formData.story.trim(),
      isPublic: formData.isPublic,
      characters: validPersonas,
    };

    try {
      const endpoint = editingChar
        ? `/api/admin/discover-characters/${editingChar.id}`
        : "/api/admin/discover-characters";
      const method = editingChar ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchAdminCharacters();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save character");
      }
    } catch (err) {
      alert("Error submitting character");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCharacter = async (id, name) => {
    if (!confirm(`Are you sure you want to delete character "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/discover-characters/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCharacters((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete character");
      }
    } catch (err) {
      alert("Error deleting character");
    }
  };

  const filteredCharacters = characters.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="h-16 border-b border-purple-500/20 px-4 md:px-8 flex items-center justify-between bg-neutral-950/90 backdrop-blur-xl shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm md:text-base text-white tracking-tight">
              NextAiChat Admin Portal
            </h1>
            <p className="text-[11px] text-neutral-400 font-mono">
              Logged in as {admin?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public App</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-300 hover:text-white transition-colors cursor-pointer"
            title="Sign Out Admin"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Admin Controls Header */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 p-4 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 flex-1 bg-neutral-950 border border-neutral-800 focus-within:border-purple-500/60 p-2.5 px-4 rounded-2xl">
            <Search className="w-4 h-4 text-purple-400 shrink-0" />
            <input
              type="text"
              placeholder="Search admin characters by name or tagline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New AI Character</span>
          </button>
        </div>

        {/* Characters Grid / Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>PUBLIC SHOWCASE CHARACTERS ({filteredCharacters.length})</span>
            <span>REALTIME COUNTER ENABLED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCharacters.map((char) => (
              <div
                key={char.id}
                className="bg-neutral-900/60 border border-neutral-800 hover:border-purple-500/40 rounded-2xl p-4 flex gap-4 transition-all shadow-md group relative overflow-hidden"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-950 shrink-0 relative border border-neutral-800">
                  <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                  {char.badge && (
                    <span className={`absolute top-1 right-1 px-1.5 py-0.5 rounded ${char.badgeBg} text-[9px]`}>
                      {char.badge}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-white truncate">{char.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-mono shrink-0">
                      {char.chatsCount} chats
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-1">{char.tagline}</p>
                  <p className="text-[10px] text-neutral-500 font-mono truncate">
                    Category: <span className="text-cyan-400">{char.category}</span>
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${char.isPublic ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-neutral-800 text-neutral-400"}`}>
                      {char.isPublic ? "PUBLIC" : "DRAFT"}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(char)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Character"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteCharacter(char.id, char.name)}
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white transition-colors cursor-pointer"
                        title="Delete Character"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add / Edit Character Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-neutral-900 border border-purple-500/40 rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>{editingChar ? "Edit Showcase Character" : "Create New Showcase Character"}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCharacter} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">Character Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. NextAi Priya"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                  >
                    <option value="Your Sales">Your Sales</option>
                    <option value="Products">Products</option>
                    <option value="Recent Tools">Recent Tools</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-neutral-300">Tagline / Short Subtitle</label>
                  <input
                    type="text"
                    required
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Futuristic AI Companion & Tech Mentor"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-neutral-300">Avatar Image URL</label>
                  <input
                    type="text"
                    required
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-neutral-300">Story Scenario Background</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.story}
                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                    placeholder="Provide initial storyline description for roleplay..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">Badge Text</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="NEW, HOT, OFF, TOP"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">Chats Count</label>
                  <input
                    type="number"
                    value={formData.chatsCount}
                    onChange={(e) => setFormData({ ...formData, chatsCount: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Multi-Persona Inputs */}
              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>Dynamic Character Personas (Supports Group Debates)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPersonaRow}
                    className="px-3 py-1 rounded-lg bg-purple-950 border border-purple-700 text-purple-300 text-xs font-bold hover:bg-purple-900 cursor-pointer"
                  >
                    + Add Persona Row
                  </button>
                </div>

                {formData.personas.map((p, idx) => (
                  <div key={idx} className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2 relative">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-purple-400">Persona #{idx + 1}</span>
                      {formData.personas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePersonaRow(idx)}
                          className="text-red-400 text-xs hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Character Name (e.g. Priya)"
                      value={p.name}
                      onChange={(e) => handlePersonaChange(idx, "name", e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Character Persona Description..."
                      value={p.persona}
                      onChange={(e) => handlePersonaChange(idx, "persona", e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Character"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
