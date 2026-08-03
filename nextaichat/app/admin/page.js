"use client";

import Image from "next/image";
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
  Users,
  Loader2,
  X,
  TrendingUp,
  Layers,
  Globe,
  Activity,
  CheckCircle2,
  Image as ImageIcon,
  MessageSquare,
  SlidersHorizontal,
  Star,
  ExternalLink,
  Info,
  BookOpen,
  FileText,
  Clock,
  Eye,
  Check
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Main Module Tab: "characters" | "blogs"
  const [activeModule, setActiveModule] = useState("characters");

  // Character States
  const [characters, setCharacters] = useState([]);
  const [charSearchQuery, setCharSearchQuery] = useState("");
  const [selectedCharCategory, setSelectedCharCategory] = useState("All");
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState(null);
  const [submittingChar, setSubmittingChar] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("basic");

  // Blog States
  const [blogs, setBlogs] = useState([]);
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [selectedBlogCategory, setSelectedBlogCategory] = useState("All");
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [submittingBlog, setSubmittingBlog] = useState(false);

  // Character Form State
  const [charFormData, setCharFormData] = useState({
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

  // Blog Form State
  const [blogFormData, setBlogFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    category: "Study & Education",
    author: "NextAiChat Team",
    published: true,
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
      fetchAdminBlogs();
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

  const fetchAdminBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error("Failed to load admin blog posts", err);
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

  // --- CHARACTER HANDLERS ---
  const handleOpenCreateCharModal = () => {
    setEditingChar(null);
    setActiveModalTab("basic");
    setCharFormData({
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
    setIsCharModalOpen(true);
  };

  const handleOpenEditCharModal = (char) => {
    setEditingChar(char);
    setActiveModalTab("basic");
    const parsedPersonas = Array.isArray(char.characters) && char.characters.length > 0
      ? char.characters
      : [{ name: char.name, persona: char.tagline }];

    setCharFormData({
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
    setIsCharModalOpen(true);
  };

  const handleAddPersonaRow = () => {
    setCharFormData((prev) => ({
      ...prev,
      personas: [...prev.personas, { name: "", persona: "" }],
    }));
  };

  const handleRemovePersonaRow = (index) => {
    setCharFormData((prev) => ({
      ...prev,
      personas: prev.personas.filter((_, i) => i !== index),
    }));
  };

  const handlePersonaChange = (index, field, value) => {
    setCharFormData((prev) => {
      const updated = [...prev.personas];
      updated[index][field] = value;
      return { ...prev, personas: updated };
    });
  };

  const handleSubmitCharacter = async (e) => {
    e.preventDefault();
    setSubmittingChar(true);

    const validPersonas = charFormData.personas
      .filter((p) => p.name.trim())
      .map((p) => ({
        name: p.name.trim(),
        persona: p.persona.trim() || `${p.name} character persona description.`,
      }));

    if (validPersonas.length === 0) {
      validPersonas.push({
        name: charFormData.name.trim(),
        persona: charFormData.tagline.trim(),
      });
    }

    const payload = {
      name: charFormData.name.trim(),
      tagline: charFormData.tagline.trim(),
      category: charFormData.category,
      filterGroup: charFormData.filterGroup,
      badge: charFormData.badge,
      badgeBg: charFormData.badgeBg,
      avatar: charFormData.avatar.trim(),
      chatsCount: parseInt(charFormData.chatsCount) || 0,
      rating: charFormData.rating,
      story: charFormData.story.trim(),
      isPublic: charFormData.isPublic,
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
        setIsCharModalOpen(false);
        fetchAdminCharacters();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save character");
      }
    } catch (err) {
      alert("Error submitting character");
    } finally {
      setSubmittingChar(false);
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

  // --- BLOG HANDLERS ---
  const handleOpenCreateBlogModal = () => {
    router.push("/admin/blog/add");
  };

  const handleOpenEditBlogModal = (blog) => {
    setEditingBlog(blog);
    setBlogFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      coverImage: blog.coverImage || "",
      category: blog.category || "Study & Education",
      author: blog.author || "NextAiChat Team",
      published: blog.published !== undefined ? blog.published : true,
    });
    setIsBlogModalOpen(true);
  };

  const handleGenerateSlug = () => {
    if (!blogFormData.title) return;
    const generated = blogFormData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setBlogFormData((prev) => ({ ...prev, slug: generated }));
  };

  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    setSubmittingBlog(true);

    const payload = {
      title: blogFormData.title.trim(),
      slug: blogFormData.slug.trim(),
      excerpt: blogFormData.excerpt.trim() || blogFormData.title.trim(),
      content: blogFormData.content.trim(),
      coverImage: blogFormData.coverImage.trim(),
      category: blogFormData.category,
      author: blogFormData.author.trim(),
      published: blogFormData.published,
    };

    try {
      const endpoint = editingBlog
        ? `/api/admin/blog/${editingBlog.id}`
        : "/api/admin/blog";
      const method = editingBlog ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsBlogModalOpen(false);
        fetchAdminBlogs();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save blog post");
      }
    } catch (err) {
      alert("Error submitting blog post");
    } finally {
      setSubmittingBlog(false);
    }
  };

  const handleDeleteBlog = async (id, title) => {
    if (!confirm(`Are you sure you want to delete blog article "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert("Failed to delete blog post");
      }
    } catch (err) {
      alert("Error deleting blog post");
    }
  };

  // Filter Logic
  const charCategoriesList = ["All", "Exam & Tutors", "Hinglish & Campus", "Languages & Career", "Tech & Startups", "Wellness & Mindset", "Public", "Drafts"];
  const blogCategoriesList = ["All", "Study & Education", "Entertainment", "Guides", "Platform Updates", "Published", "Drafts"];

  const filteredCharacters = characters.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(charSearchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(charSearchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCharCategory === "All") return true;
    if (selectedCharCategory === "Public") return c.isPublic;
    if (selectedCharCategory === "Drafts") return !c.isPublic;
    return c.category === selectedCharCategory;
  });

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
      b.slug.toLowerCase().includes(blogSearchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedBlogCategory === "All") return true;
    if (selectedBlogCategory === "Published") return b.published;
    if (selectedBlogCategory === "Drafts") return !b.published;
    return b.category === selectedBlogCategory;
  });

  // Calculate Metrics
  const totalChatsSum = characters.reduce((acc, curr) => acc + (curr.chatsCount || 0), 0);
  const publicCharCount = characters.filter((c) => c.isPublic).length;

  const totalBlogViews = blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const publishedBlogCount = blogs.filter((b) => b.published).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center animate-pulse">
            <ShieldCheck className="w-8 h-8 text-purple-400" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-purple-400 absolute -top-1 -right-1" />
        </div>
        <p className="text-sm font-mono text-neutral-400">Authenticating Executive Control Center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-neutral-950 to-[#030712] text-white font-sans flex flex-col selection:bg-purple-500 selection:text-white">
      
      {/* FIXED TOP EXECUTIVE ADMIN HEADER */}
      <header className="fixed top-0 left-0 right-0 z-[100] w-full h-16 md:h-20 border-b border-purple-500/20 px-4 sm:px-8 lg:px-12 flex items-center justify-between bg-neutral-950/95 backdrop-blur-2xl shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 sm:gap-4">
          <Image
            src="/logo-landspace.png"
            alt="NextAiChat Logo"
            width={280}
            height={80}
            priority
            className="h-10 sm:h-14 w-auto object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]"
          />
          <div className="border-l border-neutral-800/80 pl-3.5 hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm md:text-base text-white tracking-tight">
                Control Center
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              Admin: <strong className="text-purple-300">{admin?.email}</strong>
            </p>
          </div>
        </div>

        {/* Global Module Tab Selector */}
        <div className="hidden md:flex items-center gap-2 bg-neutral-900/80 p-1.5 rounded-2xl border border-neutral-800 backdrop-blur-md">
          <button
            onClick={() => setActiveModule("characters")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeModule === "characters"
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Showcase ({characters.length})</span>
          </button>

          <button
            onClick={() => setActiveModule("blogs")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeModule === "blogs"
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Blog Articles ({blogs.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(activeModule === "blogs" ? "/blog" : "/")}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-purple-500/40 text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <span className="hidden sm:inline">View Public {activeModule === "blogs" ? "Blog" : "App"}</span>
            <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-red-950/50 hover:bg-red-900/80 border border-red-800/50 text-red-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Sign Out Admin Session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Sub Header Module Switcher */}
      <div className="md:hidden px-4 pt-4 flex items-center gap-2">
        <button
          onClick={() => setActiveModule("characters")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeModule === "characters"
              ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              : "bg-neutral-900 text-neutral-400 border border-neutral-800"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Characters</span>
        </button>

        <button
          onClick={() => setActiveModule("blogs")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeModule === "blogs"
              ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              : "bg-neutral-900 text-neutral-400 border border-neutral-800"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Blog Posts</span>
        </button>
      </div>

      {/* Main Executive Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 space-y-8 max-w-[1500px] mx-auto w-full">
        
        {/* ==================== MODULE 1: AI CHARACTERS ==================== */}
        {activeModule === "characters" && (
          <>
            {/* KPI Summary Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-900/70 border border-purple-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="absolute top-0 right-0 p-4 text-purple-500/20 group-hover:text-purple-500/30 transition-colors">
                  <Layers className="w-8 h-8" />
                </div>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Total AI Characters</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{characters.length}</h3>
                <p className="text-[11px] text-purple-400 mt-2 font-mono flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Dedicated Presets
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/70 border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                <div className="absolute top-0 right-0 p-4 text-emerald-500/20 group-hover:text-emerald-500/30 transition-colors">
                  <Globe className="w-8 h-8" />
                </div>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Live Public Showcase</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{publicCharCount}</h3>
                <p className="text-[11px] text-emerald-400/80 mt-2 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active on App Homepage
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/70 border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                <div className="absolute top-0 right-0 p-4 text-cyan-500/20 group-hover:text-cyan-500/30 transition-colors">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Simulated Chats</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1">{totalChatsSum.toLocaleString()}</h3>
                <p className="text-[11px] text-cyan-400/80 mt-2 font-mono flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Dynamic User Engagement
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/70 border border-amber-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
                <div className="absolute top-0 right-0 p-4 text-amber-500/20 group-hover:text-amber-500/30 transition-colors">
                  <Users className="w-8 h-8" />
                </div>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Multi-Persona Debates</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
                  {characters.filter((c) => Array.isArray(c.characters) && c.characters.length > 1).length}
                </h3>
                <p className="text-[11px] text-amber-400/80 mt-2 font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Multi-Speaker Enabled
                </p>
              </div>
            </div>

            {/* Action Controls & Filtering Hub */}
            <div className="bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 p-4 sm:p-6 rounded-3xl shadow-2xl space-y-4">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                
                {/* Search Bar */}
                <div className="flex items-center gap-3 flex-1 bg-neutral-950 border border-neutral-800 focus-within:border-purple-500/60 p-3 px-4 rounded-2xl transition-all shadow-inner">
                  <Search className="w-4 h-4 text-purple-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search AI characters by name, tagline, or story scenario..."
                    value={charSearchQuery}
                    onChange={(e) => setCharSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
                  />
                  {charSearchQuery && (
                    <button onClick={() => setCharSearchQuery("")} className="text-neutral-500 hover:text-white text-xs">
                      Clear
                    </button>
                  )}
                </div>

                {/* Create Button */}
                <button
                  onClick={handleOpenCreateCharModal}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs tracking-wide flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>CREATE NEW SHOWCASE CHARACTER</span>
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs font-medium">
                <span className="text-neutral-400 text-[11px] font-mono mr-2 flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3 text-purple-400" /> Filter:
                </span>
                {charCategoriesList.map((cat) => {
                  const isActive = selectedCharCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCharCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap text-xs ${
                        isActive
                          ? "bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400/40"
                          : "bg-neutral-950 text-neutral-400 border border-neutral-800 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Character Showcase Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
                <span>SHOWCASE DATABASE RECORDS ({filteredCharacters.length})</span>
                <span>ENTERPRISE CONTROL ACTIVE</span>
              </div>

              {filteredCharacters.length === 0 ? (
                <div className="p-12 text-center bg-neutral-900/40 border border-dashed border-neutral-800 rounded-3xl space-y-3">
                  <Sparkles className="w-8 h-8 text-neutral-600 mx-auto" />
                  <h3 className="text-base font-bold text-neutral-300">No showcase characters found</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    No matching characters meet your active filter. Try clearing your search query or add a new character.
                  </p>
                  <button
                    onClick={handleOpenCreateCharModal}
                    className="px-4 py-2 rounded-xl bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold hover:bg-purple-900 cursor-pointer"
                  >
                    + Add Character Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCharacters.map((char) => {
                    const parsedPersonas = Array.isArray(char.characters) ? char.characters : [];
                    return (
                      <div
                        key={char.id}
                        className="bg-neutral-900/70 border border-neutral-800/80 hover:border-purple-500/40 rounded-3xl p-5 flex flex-col justify-between gap-4 transition-all shadow-xl hover:shadow-[0_10px_30px_rgba(147,51,234,0.15)] group relative overflow-hidden backdrop-blur-xl"
                      >
                        {/* Top Section */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-950 shrink-0 relative border border-neutral-800 shadow-md">
                              <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                              {char.badge && (
                                <span className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold ${char.badgeBg}`}>
                                  {char.badge}
                                </span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1.5">
                                <h3 className="font-extrabold text-sm md:text-base text-white truncate group-hover:text-purple-300 transition-colors">
                                  {char.name}
                                </h3>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 ${char.isPublic ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60" : "bg-neutral-800 text-neutral-400"}`}>
                                  {char.isPublic ? "PUBLIC" : "DRAFT"}
                                </span>
                              </div>

                              <p className="text-xs text-neutral-300 line-clamp-1 font-medium mt-0.5">{char.tagline}</p>
                              
                              <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-mono mt-2">
                                <span className="px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-cyan-400">
                                  {char.category}
                                </span>
                                <span className="flex items-center gap-1 text-amber-400 font-bold">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {char.rating || "4.9"}
                                </span>
                                <span className="text-neutral-500">
                                  {char.chatsCount} chats
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Story Snippet */}
                          <p className="text-xs text-neutral-400 line-clamp-2 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/60 leading-relaxed">
                            {char.story}
                          </p>

                          {/* Personas Badge Preview */}
                          {parsedPersonas.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1">
                              <span className="text-[10px] font-mono text-purple-400/80">Personas:</span>
                              {parsedPersonas.slice(0, 3).map((p, idx) => (
                                <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 font-mono">
                                  {p.name || `Persona #${idx+1}`}
                                </span>
                              ))}
                              {parsedPersonas.length > 3 && (
                                <span className="text-[10px] text-neutral-500 font-mono">+{parsedPersonas.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Bottom Action Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80">
                          <span className="text-[10px] font-mono text-neutral-500">
                            ID: {char.id.substring(0, 10)}...
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditCharModal(char)}
                              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-purple-900/60 border border-neutral-700 hover:border-purple-500/50 text-neutral-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5 text-purple-400" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteCharacter(char.id, char.name)}
                              className="p-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/80 border border-red-800/50 text-red-300 hover:text-white transition-all cursor-pointer"
                              title="Delete Character"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ==================== MODULE 2: BLOG MANAGEMENT ==================== */}
        {activeModule === "blogs" && (
          <>
            {/* KPI Summary Banner for Blogs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-900/70 border border-purple-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="absolute top-0 right-0 p-4 text-purple-500/20 group-hover:text-purple-500/30 transition-colors">
                  <BookOpen className="w-8 h-8" />
                </div>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Total Blog Articles</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{blogs.length}</h3>
                <p className="text-[11px] text-purple-400 mt-2 font-mono flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Published & Drafts
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/70 border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                <div className="absolute top-0 right-0 p-4 text-emerald-500/20 group-hover:text-emerald-500/30 transition-colors">
                  <Globe className="w-8 h-8" />
                </div>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Published Articles</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{publishedBlogCount}</h3>
                <p className="text-[11px] text-emerald-400/80 mt-2 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Visible on /blog
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/70 border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                <div className="absolute top-0 right-0 p-4 text-cyan-500/20 group-hover:text-cyan-500/30 transition-colors">
                  <Eye className="w-8 h-8" />
                </div>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Total Blog Readers</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1">{totalBlogViews.toLocaleString()}</h3>
                <p className="text-[11px] text-cyan-400/80 mt-2 font-mono flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Cumulative Page Views
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/70 border border-amber-500/20 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
                <div className="absolute top-0 right-0 p-4 text-amber-500/20 group-hover:text-amber-500/30 transition-colors">
                  <Clock className="w-8 h-8" />
                </div>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Draft Articles</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
                  {blogs.filter((b) => !b.published).length}
                </h3>
                <p className="text-[11px] text-amber-400/80 mt-2 font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Work in Progress
                </p>
              </div>
            </div>

            {/* Controls & Search Bar for Blogs */}
            <div className="bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 p-4 sm:p-6 rounded-3xl shadow-2xl space-y-4">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                
                {/* Search Bar */}
                <div className="flex items-center gap-3 flex-1 bg-neutral-950 border border-neutral-800 focus-within:border-purple-500/60 p-3 px-4 rounded-2xl transition-all shadow-inner">
                  <Search className="w-4 h-4 text-purple-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search blogs by title, slug, or content excerpt..."
                    value={blogSearchQuery}
                    onChange={(e) => setBlogSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
                  />
                  {blogSearchQuery && (
                    <button onClick={() => setBlogSearchQuery("")} className="text-neutral-500 hover:text-white text-xs">
                      Clear
                    </button>
                  )}
                </div>

                {/* Create Blog Button */}
                <button
                  onClick={handleOpenCreateBlogModal}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs tracking-wide flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>CREATE NEW BLOG ARTICLE</span>
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs font-medium">
                <span className="text-neutral-400 text-[11px] font-mono mr-2 flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3 text-purple-400" /> Category:
                </span>
                {blogCategoriesList.map((cat) => {
                  const isActive = selectedBlogCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedBlogCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap text-xs ${
                        isActive
                          ? "bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400/40"
                          : "bg-neutral-950 text-neutral-400 border border-neutral-800 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Blog Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
                <span>BLOG DATABASE ARTICLES ({filteredBlogs.length})</span>
                <span>LIVE CONTENT SYNC ACTIVE</span>
              </div>

              {filteredBlogs.length === 0 ? (
                <div className="p-12 text-center bg-neutral-900/40 border border-dashed border-neutral-800 rounded-3xl space-y-3">
                  <BookOpen className="w-8 h-8 text-neutral-600 mx-auto" />
                  <h3 className="text-base font-bold text-neutral-300">No blog posts found</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    No articles match your search or category filter. Create your first official blog article now.
                  </p>
                  <button
                    onClick={handleOpenCreateBlogModal}
                    className="px-4 py-2 rounded-xl bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold hover:bg-purple-900 cursor-pointer"
                  >
                    + Write Blog Article Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="bg-neutral-900/70 border border-neutral-800/80 hover:border-purple-500/40 rounded-3xl overflow-hidden flex flex-col justify-between transition-all shadow-xl hover:shadow-[0_10px_30px_rgba(147,51,234,0.15)] group backdrop-blur-xl"
                    >
                      {/* Blog Banner Image */}
                      <div className="h-44 bg-neutral-950 relative overflow-hidden border-b border-neutral-800">
                        {blog.coverImage ? (
                          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-700 font-mono text-xs">No Cover Image</div>
                        )}
                        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${blog.published ? "bg-emerald-950/90 text-emerald-400 border border-emerald-500/40" : "bg-amber-950/90 text-amber-300 border border-amber-500/40"}`}>
                          {blog.published ? "PUBLISHED" : "DRAFT"}
                        </span>
                        <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-neutral-950/90 border border-neutral-800 text-cyan-400 text-[10px] font-mono font-bold backdrop-blur-md">
                          {blog.category}
                        </span>
                      </div>

                      {/* Blog Body */}
                      <div className="p-5 flex-1 space-y-2.5">
                        <h3 className="font-extrabold text-base text-white line-clamp-2 group-hover:text-purple-300 transition-colors leading-snug">
                          {blog.title}
                        </h3>

                        <p className="text-xs font-mono text-purple-400/80 truncate">
                          /blog/{blog.slug}
                        </p>

                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      </div>

                      {/* Blog Footer */}
                      <div className="p-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between bg-neutral-950/40">
                        <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-cyan-400" /> {blog.views || 0} views
                          </span>
                          <span>By {blog.author}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditBlogModal(blog)}
                            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-purple-900/60 border border-neutral-700 hover:border-purple-500/50 text-neutral-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 text-purple-400" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteBlog(blog.id, blog.title)}
                            className="p-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/80 border border-red-800/50 text-red-300 hover:text-white transition-all cursor-pointer"
                            title="Delete Blog Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ==================== CHARACTER MODAL DIALOG ==================== */}
      {isCharModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#090d16] border border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(147,51,234,0.3)] my-auto flex flex-col max-h-[85vh]">
            
            {/* Fixed Modal Header Bar */}
            <div className="px-6 py-4 sm:py-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {editingChar ? "Edit Showcase AI Character" : "Create New Showcase AI Character"}
                  </h2>
                  <p className="text-xs text-neutral-400">Configure persona behavior, avatars, storyline scenarios & multi-speaker debates.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCharModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Switcher */}
            <div className="px-6 py-3 bg-neutral-950/60 border-b border-neutral-800/80 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalTab("basic")}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeModalTab === "basic"
                    ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>1. Core Profile & Story</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab("visuals")}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeModalTab === "visuals"
                    ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>2. Visuals & Badging</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab("personas")}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeModalTab === "personas"
                    ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>3. Sub-Personas ({charFormData.personas.length})</span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="admin-char-form" onSubmit={handleSubmitCharacter} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
              
              {/* TAB 1: BASIC PROFILE */}
              {activeModalTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-200">Character Name *</label>
                      <input
                        type="text"
                        required
                        value={charFormData.name}
                        onChange={(e) => setCharFormData({ ...charFormData, name: e.target.value })}
                        placeholder="e.g. NextAi Priya"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-200">Category Section *</label>
                      <select
                        value={charFormData.category}
                        onChange={(e) => setCharFormData({ ...charFormData, category: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                      >
                        <option value="Exam & Tutors">Exam & Tutors</option>
                        <option value="Hinglish & Campus">Hinglish & Campus</option>
                        <option value="Languages & Career">Languages & Career</option>
                        <option value="Tech & Startups">Tech & Startups</option>
                        <option value="Wellness & Mindset">Wellness & Mindset</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-neutral-200">Tagline / Short Subtitle *</label>
                      <input
                        type="text"
                        required
                        value={charFormData.tagline}
                        onChange={(e) => setCharFormData({ ...charFormData, tagline: e.target.value })}
                        placeholder="e.g. Futuristic AI Companion & Tech Mentor"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-neutral-200">Roleplay Storyline Background *</label>
                      <textarea
                        required
                        rows={4}
                        value={charFormData.story}
                        onChange={(e) => setCharFormData({ ...charFormData, story: e.target.value })}
                        placeholder="Describe the initial scene, backstory, roleplay scenario and rules..."
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl p-3.5 text-xs text-white outline-none transition-colors leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-4 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setActiveModalTab("visuals")}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 cursor-pointer"
                    >
                      Next: Visuals & Badging →
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: VISUALS & BADGES */}
              {activeModalTab === "visuals" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-200">Avatar Image URL *</label>
                    <input
                      type="text"
                      required
                      value={charFormData.avatar}
                      onChange={(e) => setCharFormData({ ...charFormData, avatar: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                    />
                  </div>

                  {/* Live Avatar Preview */}
                  <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-900 shrink-0 border border-purple-500/40 shadow-lg relative">
                      {charFormData.avatar ? (
                        <img src={charFormData.avatar} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600">No Image</div>
                      )}
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-purple-300">Live Image Preview</p>
                      <p className="text-neutral-400 text-[11px]">Make sure the image URL resolves cleanly and is publicly accessible.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-200">Badge Tag Text</label>
                      <input
                        type="text"
                        value={charFormData.badge}
                        onChange={(e) => setCharFormData({ ...charFormData, badge: e.target.value })}
                        placeholder="NEW, HOT, TOP, RECOMMENDED"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-200">Initial Chats Counter</label>
                      <input
                        type="number"
                        value={charFormData.chatsCount}
                        onChange={(e) => setCharFormData({ ...charFormData, chatsCount: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setActiveModalTab("basic")}
                      className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveModalTab("personas")}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 cursor-pointer"
                    >
                      Next: Sub-Personas →
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: DYNAMIC SUB-PERSONAS */}
              {activeModalTab === "personas" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-purple-300">Multi-Speaker Roleplay Personas</p>
                      <p className="text-[11px] text-neutral-400">Add individual speakers if this character is a group debate or dynamic team roleplay.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPersonaRow}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer transition-all shadow-md shrink-0"
                    >
                      + Add Speaker
                    </button>
                  </div>

                  <div className="space-y-3">
                    {charFormData.personas.map((p, idx) => (
                      <div key={idx} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-purple-400">Speaker Persona #{idx + 1}</span>
                          {charFormData.personas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePersonaRow(idx)}
                              className="text-red-400 text-xs font-bold hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Speaker Name (e.g. Priya)"
                            value={p.name}
                            onChange={(e) => handlePersonaChange(idx, "name", e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500 transition-colors"
                          />

                          <input
                            type="text"
                            placeholder="Persona Prompt Description (e.g. Energetic Tech Lead who asks deep questions...)"
                            value={p.persona}
                            onChange={(e) => handlePersonaChange(idx, "persona", e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-start pt-4 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setActiveModalTab("visuals")}
                      className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold cursor-pointer"
                    >
                      ← Back
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Fixed Action Footer (Outside Scroll Container) */}
            <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsCharModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-bold cursor-pointer transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="admin-char-form"
                disabled={submittingChar}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {submittingChar ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Saving Character...</span>
                  </>
                ) : (
                  <span>{editingChar ? "SAVE CHANGES" : "CREATE CHARACTER NOW"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== BLOG MODAL DIALOG ==================== */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#090d16] border border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(147,51,234,0.3)] my-auto flex flex-col max-h-[85vh]">
            
            {/* Fixed Modal Header Bar */}
            <div className="px-6 py-4 sm:py-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <BookOpen className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {editingBlog ? "Edit Blog Article" : "Create New Official Blog Article"}
                  </h2>
                  <p className="text-xs text-neutral-400">Publish articles, guides, and tutorials visible on the public /blog route.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBlogModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="admin-blog-form" onSubmit={handleSubmitBlog} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 custom-scrollbar">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-neutral-200">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={blogFormData.title}
                    onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                    placeholder="e.g. How to Use AI Personas for Exam Prep & Study"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-neutral-200">URL Slug *</label>
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="text-[11px] text-purple-400 hover:underline cursor-pointer font-mono"
                    >
                      ⚡ Auto-Generate from Title
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={blogFormData.slug}
                    onChange={(e) => setBlogFormData({ ...blogFormData, slug: e.target.value })}
                    placeholder="how-to-use-ai-personas-for-exam-prep"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors font-mono"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-200">Category Section *</label>
                  <select
                    value={blogFormData.category}
                    onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                  >
                    <option value="Study & Education">Study & Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Guides">Guides</option>
                    <option value="Platform Updates">Platform Updates</option>
                  </select>
                </div>

                {/* Author */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-200">Author Name</label>
                  <input
                    type="text"
                    value={blogFormData.author}
                    onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
                    placeholder="NextAiChat Team"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                  />
                </div>

                {/* Excerpt / Summary */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-neutral-200">Short Excerpt / Meta Description *</label>
                  <textarea
                    required
                    rows={2}
                    value={blogFormData.excerpt}
                    onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                    placeholder="Brief 1-2 sentence preview for search engines & cards..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl p-3 text-xs text-white outline-none transition-colors leading-relaxed"
                  />
                </div>

                {/* Cover Image */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-neutral-200">Cover Image URL *</label>
                  <input
                    type="text"
                    required
                    value={blogFormData.coverImage}
                    onChange={(e) => setBlogFormData({ ...blogFormData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                  />
                </div>

                {/* Live Cover Preview */}
                {blogFormData.coverImage && (
                  <div className="sm:col-span-2 h-32 rounded-2xl overflow-hidden border border-neutral-800 relative bg-neutral-950">
                    <img src={blogFormData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-purple-300">
                      Live Cover Image Preview
                    </span>
                  </div>
                )}

                {/* Full Article Content */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-neutral-200">Full Article Content (Markdown / HTML Supported) *</label>
                  <textarea
                    required
                    rows={10}
                    value={blogFormData.content}
                    onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                    placeholder="Write your complete blog post content here..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl p-4 text-xs text-white outline-none transition-colors font-mono leading-relaxed"
                  />
                </div>

                {/* Published Status Toggle */}
                <div className="space-y-1.5 sm:col-span-2 p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">Publish Article Status</p>
                    <p className="text-[11px] text-neutral-400">When enabled, article immediately appears on /blog page.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBlogFormData((prev) => ({ ...prev, published: !prev.published }))}
                    className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      blogFormData.published
                        ? "bg-emerald-950 border border-emerald-500/40 text-emerald-400"
                        : "bg-neutral-800 border border-neutral-700 text-neutral-400"
                    }`}
                  >
                    {blogFormData.published ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                    <span>{blogFormData.published ? "PUBLISHED (LIVE)" : "DRAFT (HIDDEN)"}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Fixed Action Footer (Outside Scroll Container) */}
            <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsBlogModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-bold cursor-pointer transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="admin-blog-form"
                disabled={submittingBlog}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {submittingBlog ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Saving Article...</span>
                  </>
                ) : (
                  <span>{editingBlog ? "SAVE ARTICLE CHANGES" : "PUBLISH BLOG ARTICLE"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
