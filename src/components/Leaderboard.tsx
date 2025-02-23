import React from 'react';
import { Trophy, MessageCircle, Brain } from 'lucide-react';
import type { ChatMember } from '../types';

interface LeaderboardProps {
  members: ChatMember[];
}

export function Leaderboard({ members }: LeaderboardProps) {
  const sortedMembers = [...members].sort((a, b) => b.messageCount - a.messageCount);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Chat Leaderboard
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {sortedMembers.map((member, index) => (
          <div
            key={member.name}
            className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className={`
                w-8 h-8 flex items-center justify-center rounded-full font-bold
                ${index === 0 ? 'bg-yellow-400 text-white' :
                  index === 1 ? 'bg-gray-300 text-white' :
                  index === 2 ? 'bg-amber-600 text-white' :
                  'bg-gray-100 text-gray-600'}
              `}>
                {index + 1}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">{member.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Brain className="w-4 h-4" />
                  {member.archetype}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-1 text-gray-900">
                  <MessageCircle className="w-4 h-4" />
                  {member.messageCount}
                </div>
                <div className="text-sm text-gray-500">
                  ~{Math.round(member.averageMessageLength)} words/msg
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}