"use client";
import React, { useEffect, useState } from "react";
import { TransitionPanel } from "../ui/transition-panel";
import useMeasure from "react-use-measure";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";

function Buttons({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="relative flex h-8 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 bg-transparent px-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800"
    >
      {children}
    </button>
  );
}
export function Panel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ref, bounds] = useMeasure();
  const [enteredUrl, setEnteredUrl] = useState("");
  const [scrapedContent, setScrapedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const FEATURES = [
    {
      title: "Easily turn your documentation into a knowledge base",
      description:
        "Get started by importing your existing documentation and let us do the rest. We'll automatically organize your content into a ready to use knowledge base.",
      content: null,
    },
    {
      title: "Enter your URLs",
      description: "Enter the URL you want to scrape content from.",
      content: (
        <Input
          type="text"
          placeholder="Enter URL here"
          value={enteredUrl}
          onChange={(e) => setEnteredUrl(e.target.value)}
        />
      ),
    },
    {
      title: "Scraped Content",
      description: "Here's the content scraped from the provided URL.",
      content: isLoading ? (
        <Skeleton className="h-[200px] w-full" />
      ) : (
        <ScrollArea className="h-[200px] w-full">
          <pre className="whitespace-pre-wrap break-words">
            {scrapedContent}
          </pre>
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ),
    },
    {
      title: "Create Knowledge Base",
      description:
        "This is the final step. Click the button below to create your knowledge base.",
    },
  ];

  const handleSetActiveIndex = async (newIndex: number) => {
    setDirection(newIndex > activeIndex ? 1 : -1);
    if (activeIndex === 1 && newIndex === 2) {
      setIsLoading(true);
      try {
        const response = await fetch(`https://r.jina.ai/${enteredUrl}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const text = await response.text();
        setScrapedContent(text);
      } catch (error) {
        console.error("Error fetching content:", error);
        setScrapedContent("Error fetching content. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    if (activeIndex < 0) setActiveIndex(0);
    if (activeIndex >= FEATURES.length) setActiveIndex(FEATURES.length - 1);
  }, [activeIndex]);

  return (
    <div className="w-2/3 mx-auto overflow-hidden rounded-xl border bg-background z-50">
      <TransitionPanel
        activeIndex={activeIndex}
        variants={{
          enter: (direction) => ({
            x: direction > 0 ? 364 : -364,
            opacity: 0,
            height: bounds.height > 0 ? bounds.height : "auto",
            position: "initial",
          }),
          center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            height: bounds.height > 0 ? bounds.height : "auto",
          },
          exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 364 : -364,
            opacity: 0,
            position: "absolute",
            top: 0,
            width: "100%",
          }),
        }}
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        custom={direction}
      >
        {FEATURES.map((feature, index) => (
          <div key={index} className="px-4 pt-4" ref={ref}>
            <h3 className="mb-0.5 font-medium text-zinc-800 dark:text-zinc-100">
              {feature.title}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {feature.description}
            </p>
            {feature.content && <div className="mt-2">{feature.content}</div>}
          </div>
        ))}
      </TransitionPanel>
      <div className="flex justify-between p-4">
        {activeIndex > 0 ? (
          <Button
            variant="ghost"
            onClick={() => handleSetActiveIndex(activeIndex - 1)}
          >
            Previous
          </Button>
        ) : (
          <div />
        )}

        {activeIndex === FEATURES.length - 1 ? (
          <Button variant="success" onClick={() => handleSetActiveIndex(0)}>
            Create Knowledge Base
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() => handleSetActiveIndex(activeIndex + 1)}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
