"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Markdown } from "./markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export const Message = ({
  role,
  content,
}: {
  role: string;
  content: string | ReactNode;
}) => {
  return (
    <motion.div
      className="flex flex-col gap-4 w-full max-w-2xl mx-auto py-4"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {role === "assistant" ? (
        <div className="flex items-start space-x-4">
          <Avatar className="w-8 h-8 -z-10">
            <AvatarFallback>
              <Bot className="size-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 bg-background  border rounded-lg px-4 py-2 text-sm">
            <Markdown>{content as string}</Markdown>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <div className="bg-secondary text-primary rounded-lg px-4 py-2 text-sm max-w-[75%] -z-10">
            <Markdown>{content as string}</Markdown>
          </div>
        </div>
      )}
    </motion.div>
  );
};
