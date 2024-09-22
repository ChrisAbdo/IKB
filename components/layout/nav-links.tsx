"use client";
import React from "react";
import Link from "next/link";
// import { HistoryButton } from "./history-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Plus,
  BookOpenText,
  Book,
  Settings2,
  Shapes,
  Bug,
  FilePlus,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { History } from "../history";

interface HistoryItem {
  id: string;
  title: string;
  category: string;
}

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="grid gap-2 p-2">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link href="/create">
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg"
              aria-label="New point"
            >
              <Plus className="size-5" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          New Point
        </TooltipContent>
      </Tooltip>

      {/* <HistoryButton history={history} /> */}
      <History />

      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link href="/playground">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-lg ${
                pathname === "/view-mode"
                  ? "bg-[#ececee] dark:bg-[#FFFFFF17]"
                  : ""
              }`}
              aria-label="API"
            >
              <Shapes className="size-5" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          Playground
        </TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link href="/create">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              aria-label="Create Markdown"
            >
              <FilePlus className="size-5 " />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          Create Markdown
        </TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg"
            aria-label="Settings"
          >
            <Settings2 className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          Settings
        </TooltipContent>
      </Tooltip>
    </nav>
  );
}
