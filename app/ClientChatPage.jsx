"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GeminiLayout from "@/components/GeminiLayout";
import ChatView from "@/components/ChatView";
import NewSessionModal from "@/components/NewSessionModal";

export default function ClientChatPage({ initialUser, initialChats = [] }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(
    initialChats && initialChats.length > 0 ? initialChats[0].id : null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchChats();
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

  const handleSessionCreated = (newSession) => {
    setChats((prev) => [newSession, ...prev]);
    setActiveChatId(newSession.id);
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
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        if (activeChatId === chatId) {
          const remaining = chats.filter((c) => c.id !== chatId);
          setActiveChatId(remaining.length > 0 ? remaining[0].id : null);
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

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  return (
    <GeminiLayout
      user={user}
      chats={chats}
      activeChatId={activeChatId}
      onSelectChat={(id) => setActiveChatId(id)}
      onNewChat={() => setIsModalOpen(true)}
      onDeleteChat={handleDeleteChat}
      onLogout={handleLogout}
    >
      <ChatView
        activeChat={activeChat}
        onUpdateChat={handleUpdateChat}
        onDeleteChat={handleDeleteChat}
        onOpenNewModal={() => setIsModalOpen(true)}
      />

      <NewSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSessionCreated={handleSessionCreated}
      />
    </GeminiLayout>
  );
}
