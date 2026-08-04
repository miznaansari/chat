"use client";

import { useRouter } from "next/navigation";
import ChatView from "@/components/ChatView";
import HomeDiscoveryView from "@/components/HomeDiscoveryView";
import { useChatLayout } from "@/context/ChatLayoutContext";

export default function ClientChatPage() {
  const router = useRouter();
  const {
    chats,
    activeChat,
    setActiveChatId,
    viewMode,
    setViewMode,
    handleSessionCreated,
    handleUpdateChat,
    handleDeleteChat,
  } = useChatLayout();

  return (
    <>
      {viewMode === "home" ? (
        <HomeDiscoveryView
          chats={chats}
          onSelectChat={(id) => {
            setActiveChatId(id);
            setViewMode("chat");
            if (typeof window !== "undefined" && window.location.pathname !== `/chat/${id}`) {
              window.history.pushState(null, "", `/chat/${id}`);
            }
          }}
          onSessionCreated={handleSessionCreated}
          onOpenNewModal={() => router.push("/character/add")}
          onSwitchToChatView={() => setViewMode("chat")}
        />
      ) : (
        <ChatView
          activeChat={activeChat}
          onUpdateChat={handleUpdateChat}
          onDeleteChat={handleDeleteChat}
          onOpenNewModal={() => router.push("/character/add")}
        />
      )}
    </>
  );
}
