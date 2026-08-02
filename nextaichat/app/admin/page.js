"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Eye,
  FileText,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Globe,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: null, text: "" });

  // Form State for Create / Edit
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Study & Education");
  const [author, setAuthor] = useState("NextAiChat Team");
  const [published, setPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg({ type: null, text: "" });

    try {
      const endpoint = editingId ? `/api/blogs/${editingId}` : "/api/blogs";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          excerpt,
          content,
          category,
          author,
          published,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusMsg({ type: "error", text: data.error || "Operation failed." });
      } else {
        setStatusMsg({
          type: "success",
          text: editingId ? "Blog updated successfully!" : "New blog post published!",
        });
        resetForm();
        fetchBlogs();
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: "An error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCategory("Study & Education");
    setAuthor("NextAiChat Team");
    setPublished(true);
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setCategory(blog.category);
    setAuthor(blog.author);
    setPublished(blog.published);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const togglePublished = async (blog) => {
    try {
      await fetch(`/api/blogs/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !blog.published }),
      });
      fetchBlogs();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  // Analytics Computations
  const totalBlogs = blogs.length;
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
  const publishedCount = blogs.filter((b) => b.published).length;
  const topBlog = [...blogs].sort((a, b) => b.views - a.views)[0];

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden selection:bg-purple-500 selection:text-white py-10 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-8 w-full">
      {/* Background Glows */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed inset-0 bg-antigravity-grid pointer-events-none opacity-40" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Blog Analytics & Content Management
          </h1>
        </div>

        <button
          onClick={fetchBlogs}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Analytics Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Views */}
        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-purple-500/30 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-white">{totalViews}</div>
          <p className="text-[11px] text-neutral-400">Accumulated reader traffic</p>
        </div>

        {/* Card 2: Total Articles */}
        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-cyan-500/30 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Articles</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-white">{totalBlogs}</div>
          <p className="text-[11px] text-neutral-400">{publishedCount} Published • {totalBlogs - publishedCount} Drafts</p>
        </div>

        {/* Card 3: Top Performing */}
        <div className="p-5 rounded-3xl bg-neutral-900/60 border border-emerald-500/30 backdrop-blur-md space-y-2 col-span-1 sm:col-span-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider">🔥 Top Performing Article</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          {topBlog ? (
            <div>
              <div className="text-sm font-bold text-white truncate">{topBlog.title}</div>
              <div className="text-xs text-emerald-300 font-semibold">{topBlog.views} total views</div>
            </div>
          ) : (
            <div className="text-xs text-neutral-400">No blog posts found yet</div>
          )}
        </div>
      </div>

      {/* Blog Creator / Editor Form Card */}
      <div className="relative z-10 p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-purple-500/30 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>{editingId ? "Edit Blog Post" : "Create New Database Blog Article"}</span>
          </h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {statusMsg.text && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              statusMsg.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
                : "bg-red-950/80 border-red-500/40 text-red-300"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Blog Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to Use AI Roleplay for Exam Prep"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Custom URL Slug (Optional)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. ai-roleplay-exam-prep"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white outline-none transition-colors cursor-pointer"
              >
                <option value="Study & Education">Study & Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Guides">Guides</option>
                <option value="Platform Updates">Platform Updates</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-300">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="NextAiChat Team"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300">Excerpt / Short Summary</label>
            <textarea
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of why this article matters for study or entertainment..."
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl p-3.5 text-base sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300">Content (Markdown Supported)</label>
            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write full article in Markdown..."
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl p-3.5 text-base sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded bg-neutral-950 border-neutral-800 text-purple-600 focus:ring-0 cursor-pointer"
              />
              <span>Publish Immediately</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Saving..." : editingId ? "Update Article" : "Save Article to DB"}
            </button>
          </div>
        </form>
      </div>

      {/* Blogs Table Card */}
      <div className="relative z-10 p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white">All Database Articles</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Views</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-xs">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white max-w-xs truncate">{b.title}</td>
                  <td className="py-3 px-3 text-neutral-400">{b.category}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold text-[11px] inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {b.views}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => togglePublished(b)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                        b.published
                          ? "bg-emerald-950 border border-emerald-700 text-emerald-300"
                          : "bg-amber-950 border border-amber-700 text-amber-300"
                      }`}
                    >
                      {b.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(b)}
                      className="p-1.5 text-purple-400 hover:text-purple-300 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
