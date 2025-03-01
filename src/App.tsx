import React, { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { Leaderboard } from "./components/Leaderboard";
import { Summary } from "./components/Summary";
import { parseWhatsAppChat, analyzeChatData } from "./utils/chatParser";
import type { ChatSummary } from "./types";

function App() {
  const [chatSummary, setChatSummary] = useState<ChatSummary | null>(null);

  const handleFileSelect = (content: string) => {
    const messages = parseWhatsAppChat(content);
    const summary = analyzeChatData(messages);
    setChatSummary(summary);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 -mt-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <a href="/" rel="noopener noreferrer">
              WhatsApp Chat Summarizer
            </a>
          </h1>

          {!chatSummary && (
            <p className="text-lg text-gray-600">
              Upload your WhatsApp chat export to see insights and statistics
            </p>
          )}
        </div>

        {!chatSummary && <FileUpload onFileSelect={handleFileSelect} />}

        {chatSummary && (
          <>
            <Summary summary={chatSummary} />
            <Leaderboard
              members={chatSummary.members}
              groupName={chatSummary.groupName}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
