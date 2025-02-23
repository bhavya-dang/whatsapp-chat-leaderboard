// src/utils/chatParser.js

export const parseChat = (chatText) => {
  const lines = chatText.split("\n");
  const messages = [];

  // Updated regex to match the format: [20/01/25, 2:39:41 PM] Sender: Message
  const messageRegex =
    /^\[(\d{2}\/\d{2}\/\d{2}),\s+(\d{1,2}:\d{2}:\d{2}\s+(?:AM|PM))\]\s+([^:]+):\s+(.*)$/;

  lines.forEach((line) => {
    const match = line.match(messageRegex);
    if (match) {
      const [, date, time, sender, message] = match;
      messages.push({ date, time, sender, message });
    } else {
      console.warn("Unmatched line:", line);
    }
  });

  console.log("Parsed messages:", messages);
  return messages;
};

export const generateLeaderboard = (messages) => {
  const counts = {};

  messages.forEach(({ sender }) => {
    counts[sender] = (counts[sender] || 0) + 1;
  });

  const leaderboard = Object.entries(counts).map(([sender, count]) => ({
    sender,
    count,
  }));
  leaderboard.sort((a, b) => b.count - a.count);
  return leaderboard;
};

export const categorizeMember = (count) => {
  if (count > 1000) return "Chatterbox";
  if (count > 500) return "Conversationalist";
  if (count > 100) return "Participant";
  return "Observer";
};
