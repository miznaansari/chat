"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import GeminiLayout from "@/components/GeminiLayout";
import NewSessionModal from "@/components/NewSessionModal";
import { ChatLayoutContext } from "@/context/ChatLayoutContext";

export default function AppRouteLayoutShell({ initialUser, initialChats = [], children }) {
  const router = useRouter();
  const pathname = usePathname();

  const isChatRoute = pathname?.startsWith("/chat/");
  const routeChatId = isChatRoute
    ? pathname.replace("/chat/", "").split("?")[0].split("/")[0]
    : null;

  const [user, setUser] = useState(initialUser);
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(() => {
    if (routeChatId) return routeChatId;
    return initialChats && initialChats.length > 0 ? initialChats[0].id : null;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    if (isChatRoute) return "chat";
    return "home";
  }); // "home" | "chat"

  const navigateUrl = (url) => {
    if (typeof window !== "undefined" && window.location.pathname !== url) {
      window.history.pushState(null, "", url);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/chat/")) {
        const urlId = currentPath.replace("/chat/", "").split("?")[0].split("/")[0];
        if (urlId) {
          setActiveChatId(urlId);
          setViewMode("chat");
        }
      } else if (currentPath === "/") {
        setViewMode("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        const freshChats = data.chats || [];
        setChats(freshChats);
        if (freshChats.length > 0) {
          setActiveChatId((prev) => {
            const currentPath = typeof window !== "undefined" ? window.location.pathname : pathname;
            if (currentPath?.startsWith("/chat/")) {
              const urlId = currentPath.replace("/chat/", "").split("?")[0].split("/")[0];
              if (urlId && freshChats.some((c) => c.id === urlId)) {
                return urlId;
              }
            }
            if (prev && freshChats.some((c) => c.id === prev)) {
              return prev;
            }
            return freshChats[0].id;
          });
        }
      }
    } catch (err) {
      console.error("Failed to load chats", err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSessionCreated = (newSession) => {
    setChats((prev) => [newSession, ...prev]);
    setActiveChatId(newSession.id);
    setViewMode("chat");
    setIsModalOpen(false);
    navigateUrl(`/chat/${newSession.id}`);
  };

  const handleUpdateChat = (updatedSession) => {
    setChats((prev) =>
      prev.map((c) => (c.id === updatedSession.id ? { ...c, ...updatedSession } : c))
    );
  };

  const handleDeleteChat = async (chatId) => {
    if (!confirm("Are you sure you want to delete this roleplay chat session? All messages will be permanently deleted.")) {
      return;
    }

    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const remaining = chats.filter((c) => c.id !== chatId);
        setChats(remaining);
        if (activeChatId === chatId) {
          if (remaining.length > 0) {
            setActiveChatId(remaining[0].id);
            setViewMode("chat");
            navigateUrl(`/chat/${remaining[0].id}`);
          } else {
            setActiveChatId(null);
            setViewMode("home");
            navigateUrl("/");
          }
        }
      } else {
        alert("Failed to delete chat session.");
      }
    } catch (err) {
      alert("Error deleting chat session.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleBatchDeleteChats = async (chatIds) => {
    if (!chatIds || chatIds.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${chatIds.length} selected chat session${
          chatIds.length > 1 ? "s" : ""
        }? All messages will be permanently deleted.`
      )
    ) {
      return;
    }

    const targetSet = new Set(chatIds);
    const remaining = chats.filter((c) => !targetSet.has(c.id));
    setChats(remaining);

    if (activeChatId && targetSet.has(activeChatId)) {
      if (remaining.length > 0) {
        setActiveChatId(remaining[0].id);
        setViewMode("chat");
        navigateUrl(`/chat/${remaining[0].id}`);
      } else {
        setActiveChatId(null);
        setViewMode("home");
        navigateUrl("/");
      }
    }

    try {
      await Promise.all(
        chatIds.map((id) =>
          fetch(`/api/chats/${id}`, {
            method: "DELETE",
          })
        )
      );
    } catch (err) {
      console.error("Failed to delete selected chats", err);
      fetchChats();
    }
  };

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const contextValue = {
    user,
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    activeChat,
    viewMode,
    setViewMode,
    fetchChats,
    handleSessionCreated,
    handleUpdateChat,
    handleDeleteChat,
    handleBatchDeleteChats,
    handleLogout,
  };

  return (
    <ChatLayoutContext.Provider value={contextValue}>
      <GeminiLayout
        user={user}
        chats={chats}
        activeChatId={activeChatId}
        activeChat={activeChat}
        viewMode={viewMode}
        onSelectHome={() => {
          setViewMode("home");
          navigateUrl("/");
        }}
        onUpdateChat={handleUpdateChat}
        onSelectChat={(id) => {
          setActiveChatId(id);
          setViewMode("chat");
          navigateUrl(`/chat/${id}`);
        }}
        onNewChat={() => router.push("/character/add")}
        onDeleteChat={handleDeleteChat}
        onBatchDeleteChats={handleBatchDeleteChats}
        onLogout={handleLogout}
      >
        {children}

        <NewSessionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSessionCreated={handleSessionCreated}
        />
      </GeminiLayout>
    </ChatLayoutContext.Provider>
  );
}
