export interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

export interface ChatMember {
  name: string;
  messageCount: number;
  wordCount: number;
  archetype: string;
  averageMessageLength: number;
  emojisUsed: number;
}

export interface ChatSummary {
  totalMessages: number;
  totalParticipants: number;
  members: ChatMember[];
  mostActiveHour: number;
}