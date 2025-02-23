import type { Message, ChatMember, ChatSummary } from "../types";

export function parseWhatsAppChat(text: string): Message[] {
  const lines = text.split("\n");
  const messages: Message[] = [];
  const messageRegex =
    /\[?(\d{1,2}\/\d{1,2}\/\d{2,4},?\s*\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\]?\s*[-:]?\s*([^:]+):\s*(.+)/;

  for (const line of lines) {
    const match = line.match(messageRegex);
    if (match) {
      const [, timestamp, sender, content] = match;
      messages.push({
        sender: sender.trim(),
        content: content.trim(),
        timestamp: new Date(timestamp),
      });
    }
  }

  return messages;
}

export function determineArchetype(messages: Message[]): string {
  const emojiCount = (messages.join(" ").match(/[\u{1F300}-\u{1F9FF}]/gu) || [])
    .length;
  const avgLength =
    messages.reduce((acc, msg) => acc + msg.content.length, 0) /
    messages.length;

  if (emojiCount / messages.length > 0.5) return "Emoji Enthusiast";
  if (avgLength > 100) return "Story Teller";
  if (avgLength < 10) return "Quick Responder";
  if (messages.length > 100) return "Active Participant";
  return "Balanced Communicator";
}

export function analyzeChatData(messages: Message[]): ChatSummary {
  const memberStats = new Map<string, ChatMember>();

  messages.forEach((msg) => {
    const existing = memberStats.get(msg.sender) || {
      name: msg.sender,
      messageCount: 0,
      wordCount: 0,
      archetype: "",
      averageMessageLength: 0,
      emojisUsed: 0,
    };

    existing.messageCount++;
    existing.wordCount += msg.content.split(/\s+/).length;
    existing.emojisUsed += (
      msg.content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []
    ).length;
    memberStats.set(msg.sender, existing);
  });

  // Calculate archetypes and averages
  memberStats.forEach((member, name) => {
    member.averageMessageLength = member.wordCount / member.messageCount;
    member.archetype = determineArchetype(
      messages.filter((m) => m.sender === name)
    );
  });

  return {
    totalMessages: messages.length,
    totalParticipants: memberStats.size,
    members: Array.from(memberStats.values()),
    mostActiveHour: getMostActiveHour(messages),
  };
}

function getMostActiveHour(messages: Message[]): number {
  const hourCounts = new Array(24).fill(0);
  messages.forEach((msg) => {
    hourCounts[msg.timestamp.getHours()]++;
  });
  return hourCounts.indexOf(Math.max(...hourCounts));
}
