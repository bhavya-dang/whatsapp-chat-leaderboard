import { useState } from "react";
import FileUploader from "./components/FileUploader";
import {
  parseChat,
  generateLeaderboard,
  categorizeMember,
} from "./utils/chatParser";

function App() {
  const [messages, setMessages] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const handleFileUpload = (chatText) => {
    const parsedMessages = parseChat(chatText);
    setMessages(parsedMessages);
    const leaderboardData = generateLeaderboard(parsedMessages);
    console.log("Leaderboard Data:", leaderboardData); // Debug log
    setLeaderboard(leaderboardData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">WhatsApp Chat Summarizer</h1>
      <FileUploader onFileUpload={handleFileUpload} />

      {leaderboard.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
          <ul className="space-y-2">
            {leaderboard.map((user, index) => (
              <li
                key={user.sender}
                className="flex justify-between items-center p-4 border rounded-md shadow-sm"
              >
                <span>
                  {index + 1}. {user.sender}
                </span>
                <span>
                  {user.count} messages -{" "}
                  <span className="italic">{categorizeMember(user.count)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
