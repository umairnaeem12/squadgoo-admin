"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { MessageCircle } from "lucide-react";

export default function AdminChatPage() {
  return (
    <div className="p-2 md:p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Internal Chat
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Placeholder for internal SquadGoo staff chat – align this with the
        “Internal Chat” entry in the admin panel header from the product
        document.
      </p>

      <ComponentCard
        title="Support & operations conversations"
        desc="In a full build this area would host channels between support, disputes, compliance and engineering."
      >
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-gray-600 dark:text-gray-400">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
            <MessageCircle className="w-6 h-6 text-brand-500 dark:text-brand-400" />
          </div>
          <p className="text-sm">
            No real-time messaging is wired yet. Use this page later to embed
            your chosen chat provider or a custom internal thread view.
          </p>
        </div>
      </ComponentCard>
    </div>
  );
}

