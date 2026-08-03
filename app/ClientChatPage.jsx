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
