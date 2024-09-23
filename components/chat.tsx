"use client";

import { Message } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import { Files } from "@/components/files";
import { AnimatePresence, motion } from "framer-motion";
import { FileIcon } from "@/components/icons";
import { Message as PreviewMessage } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { Session } from "next-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { FileContext } from "./chat/file-context";
import { ShareChat } from "./chat/share-chat";
import { ModeToggle } from "./layout/mode-toggle";

const suggestedActions = [
  {
    title: "What's the summary",
    label: "of these documents?",
    action: "what's the summary of these documents?",
  },
  {
    title: "Who is the author",
    label: "of these documents?",
    action: "who is the author of these documents?",
  },
];

export function Chat({
  id,
  initialMessages,
  session,
}: {
  id: string;
  initialMessages: Array<Message>;
  session: Session | null;
}) {
  const [selectedFilePathnames, setSelectedFilePathnames] = useState<
    Array<string>
  >([]);
  const [isFilesVisible, setIsFilesVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [rowCount, setRowCount] = useState(1);
  const [allFiles, setAllFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllFiles = async () => {
      const response = await fetch("/api/files/list");
      const files = await response.json();
      setAllFiles(files.map((file: any) => file.pathname));
    };
    fetchAllFiles();
  }, []);

  useEffect(() => {
    if (isMounted !== false && session && session.user) {
      localStorage.setItem(
        `${session.user.email}/selected-file-pathnames`,
        JSON.stringify(selectedFilePathnames)
      );
    }
  }, [selectedFilePathnames, isMounted, session]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (session && session.user) {
      setSelectedFilePathnames(
        JSON.parse(
          localStorage.getItem(
            `${session.user.email}/selected-file-pathnames`
          ) || "[]"
        )
      );
    }
  }, [session]);

  const { messages, handleSubmit, input, setInput, append } = useChat({
    body: { id, selectedFilePathnames },
    initialMessages,
    onFinish: () => {
      window.history.replaceState({}, "", `/${id}`);
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const updateRowCount = (value: string) => {
    const lines = value.split("\n");
    setRowCount(lines.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const onFileToggle = (file: string) => {
    setSelectedFilePathnames((prev) =>
      prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
    );
  };

  const onManageFiles = () => {
    setIsFilesVisible(true);
  };
  return (
    <div className="h-screen">
      <header className="sticky w-full bg-gray-50 dark:bg-neutral-900 border-b top-0 z-10 flex h-[53px] items-center justify-between px-2 overflow-x-auto">
        <FileContext
          activeFiles={selectedFilePathnames}
          allFiles={allFiles}
          onFileToggle={onFileToggle}
          onManageFiles={onManageFiles}
        />
        <div className="flex gap-2">
          {messages.length > 0 && <ShareChat />}
          <ModeToggle />
        </div>
      </header>

      <div ref={messagesContainerRef}>
        {messages.map((message, index) => (
          <PreviewMessage
            key={`${id}-${index}`}
            role={message.role}
            content={message.content}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-3xl w-full mx-auto p-4 flex flex-col space-y-4">
        {messages.length === 0 && (
          <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px]">
            {suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{suggestedAction.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {suggestedAction.label}
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="relative flex-1 flex items-center">
            <Textarea
              className={`ta flex-1 pr-12 py-3 resize-none bg-muted border-none focus:ring-0 focus:outline-none ${
                rowCount === 1 ? "rounded-full" : "rounded-3xl"
              }`}
              style={{
                minHeight: "46px",
                maxHeight: "200px",
                paddingLeft: "3.8rem",
              }}
              placeholder="Send a message..."
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                updateRowCount(event.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute left-2 text-sm rounded-full size-9 flex-shrink-0 flex flex-row items-center justify-center ${
                    rowCount === 1 ? "" : "bottom-1"
                  }`}
                  onClick={() => {
                    setIsFilesVisible(!isFilesVisible);
                  }}
                >
                  <FileIcon />
                  {selectedFilePathnames.length > 0 && (
                    <motion.div
                      className="absolute text-xs -top-1 -right-1 bg-primary size-4 rounded-full flex flex-row justify-center items-center text-primary-foreground"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {selectedFilePathnames.length}
                    </motion.div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Browse Files</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </form>
      </div>

      <AnimatePresence>
        <Files
          isFilesVisible={isFilesVisible}
          setIsFilesVisible={setIsFilesVisible}
          selectedFilePathnames={selectedFilePathnames}
          setSelectedFilePathnames={setSelectedFilePathnames}
        />
      </AnimatePresence>
    </div>
  );
}
