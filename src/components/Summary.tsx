import React from "react";
import { Users, Clock, MessageSquare } from "lucide-react";
import type { ChatSummary } from "../types";

interface SummaryProps {
  summary: ChatSummary;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Total Messages
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {summary.totalMessages}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Participants
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {summary.totalParticipants}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Most Active Hour
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {summary.mostActiveHour}:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
