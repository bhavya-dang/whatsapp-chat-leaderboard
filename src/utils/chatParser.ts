import { Coins, Cone } from "lucide-react";
import type { Message, ChatMember, ChatSummary } from "../types";

export function parseWhatsAppChat(
  text: string
): Message[] & { groupName: string } {
  const lines = text.split("\n");
  const messages: Message[] = [];
  let groupName = "";
  const messageRegex =
    /\[?(\d{1,2}\/\d{1,2}\/\d{2,4},?\s*\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AP]M)?)\]?\s*[-:]?\s*([^:]+):\s*(.+)/;

  for (const line of lines) {
    const match = line.match(messageRegex);
    if (match) {
      const [, timestamp, sender, content] = match;
      const trimmedSender = sender.trim();

      // Patterns for system messages related to group metadata
      const groupNamePatterns = [
        /.*created by.*/i,
        /.*added to.*/i,
        /.*changed group name.*/i,
        /.*removed.*/i,
        /.*left the group.*/i,
        /.*created group.*/i,
        /.*changed this group's icon.*/i,
        /Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them./i,
        /Only messages that mention @Meta AI are sent to Meta. Meta can't read any other messages in this chat. Some responses may be inaccurate or inappropriate./i,
      ];

      if (
        content.includes("changed the subject from") ||
        content.includes("created group")
      ) {
        groupName = trimmedSender;
      }

      if (
        trimmedSender === "Meta AI" ||
        trimmedSender === groupName ||
        trimmedSender.includes("changed the subject") ||
        groupNamePatterns.some((pattern) => pattern.test(content))
      ) {
        continue; // Skip these messages
      }

      messages.push({
        sender: trimmedSender,
        content: content.trim(),
        timestamp: new Date(timestamp),
      });
    }
  }

  return Object.assign(messages, { groupName });
}

export function determineArchetype(messages: Message[]): string {
  if (messages.length === 0) return "New Member";

  // Calculate emoji usage per message
  let totalEmojiCount = 0;
  let totalCharLength = 0;

  for (const msg of messages) {
    const emojiMatches = msg.content.match(/[\u{1F300}-\u{1F9FF}]/gu) || [];
    totalEmojiCount += emojiMatches.length;
    totalCharLength += msg.content.length;
  }

  const avgEmojisPerMsg = totalEmojiCount / messages.length;
  const avgMsgLength = totalCharLength / messages.length;

  // Determine archetype based on messaging patterns
  if (avgEmojisPerMsg >= 2) return "Emoji Enthusiast";
  if (avgMsgLength >= 200) return "Story Teller";
  if (avgMsgLength <= 15) return "Quick Responder";
  if (messages.length >= 500) return "Active Participant";
  return "Balanced Communicator";
}

export function analyzeChatData(
  messages: Message[]
): ChatSummary & { groupName: string } {
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

  const groupName = (messages as Message[] & { groupName: string }).groupName;

  return {
    totalMessages: messages.length,
    totalParticipants: memberStats.size,
    members: Array.from(memberStats.values()),
    mostActiveHour: getMostActiveHour(messages),
    groupName: groupName,
  };
}

function getMostActiveHour(messages: Message[]): number {
  const hourCounts = new Array(24).fill(0);
  messages.forEach((msg) => {
    hourCounts[msg.timestamp.getHours()]++;
  });
  return hourCounts.indexOf(Math.max(...hourCounts));
}
