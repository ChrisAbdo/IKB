"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { TransitionPanel } from "../ui/transition-panel";
import useMeasure from "react-use-measure";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { LoaderIcon, SearchIcon, XIcon } from "lucide-react";
import { convertMarkdownToTxt } from "@/utils/md-to-txt";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../ui/label";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "../ui/separator";

export function Panel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ref, bounds] = useMeasure();
  const [scrapedContent, setScrapedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [inputMethod, setInputMethod] = useState("Manual");
  const [manualUrls, setManualUrls] = useState<string[]>([""]);
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [scrapedUrls, setScrapedUrls] = useState<string[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [selectedScrapedUrls, setSelectedScrapedUrls] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSitemapScrape = useCallback(async () => {
    setIsScraping(true);
    try {
      const response = await fetch(
        `/api/scrape?url=${encodeURIComponent(sitemapUrl)}`
      );
      if (!response.ok) {
        throw new Error("Failed to scrape sitemap");
      }
      const urls = await response.json();
      setScrapedUrls(urls);
    } catch (error) {
      console.error("Error scraping sitemap:", error);
      toast.error("Failed to scrape sitemap. Please try again.");
    } finally {
      setIsScraping(false);
    }
  }, [sitemapUrl]);

  const handleSetActiveIndex = useCallback(
    async (newIndex: number) => {
      setDirection(newIndex > activeIndex ? 1 : -1);
      if (activeIndex === 1 && newIndex === 2) {
        setIsLoading(true);
        setIsFetching(true);
        try {
          const urlsToFetch =
            inputMethod === "Manual" ? manualUrls : selectedScrapedUrls;
          const responses = await Promise.all(
            urlsToFetch.map(async (url) => {
              const content = await fetch(`https://r.jina.ai/${url}`).then(
                (res) => res.text()
              );
              return { url, content };
            })
          );
          setScrapedContent(
            responses
              .map((r) => `URL: ${r.url}\n\n${r.content}`)
              .join("\n\n--- Next URL ---\n\n")
          );
        } catch (error) {
          console.error("Error fetching content:", error);
          setScrapedContent("Error fetching content. Please try again.");
        } finally {
          setIsLoading(false);
          setIsFetching(false);
        }
      } else if (activeIndex === 3 && newIndex === 0) {
        setIsLoading(true);
        const errors = [];
        const successfulUploads = [];

        try {
          const urlsToUpload =
            inputMethod === "Manual" ? manualUrls : selectedScrapedUrls;
          for (const url of urlsToUpload) {
            const content = await fetch(`https://r.jina.ai/${url}`).then(
              (res) => res.text()
            );
            const plainText = `Source URL: ${url}\n\n${await convertMarkdownToTxt(
              content
            )}`;
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split("/").filter(Boolean);
            const filename = `${urlObj.hostname}${
              pathParts.length > 0 ? "_" + pathParts.join("_") : ""
            }.txt`;

            const response = await fetch(
              `/api/files/upload?filename=${filename}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "text/plain",
                },
                body: plainText,
              }
            );

            if (response.ok) {
              successfulUploads.push(url);
            } else {
              const errorText = await response.text();
              errors.push(
                `Failed to upload file for URL: ${url}. Error: ${errorText}`
              );
            }
          }

          if (successfulUploads.length > 0) {
            toast.success(
              `Successfully uploaded ${successfulUploads.length} file(s)`
            );
          }
          if (errors.length > 0) {
            toast.error(
              `Failed to upload ${errors.length} file(s). Check console for details.`
            );
            console.error("Upload errors:", errors);
          }

          setManualUrls([""]);
          setSelectedScrapedUrls([]);
          setScrapedContent("");
        } catch (error) {
          console.error("Error uploading files:", error);
          toast.error(
            "An error occurred while uploading files. Please try again."
          );
        } finally {
          setIsLoading(false);
        }
      }
      setActiveIndex(newIndex);
    },
    [activeIndex, inputMethod, manualUrls, selectedScrapedUrls]
  );

  useEffect(() => {
    if (activeIndex < 0) setActiveIndex(0);
    if (activeIndex >= FEATURES.length) setActiveIndex(FEATURES.length - 1);
  }, [activeIndex]);

  const filteredScrapedUrls = useMemo(() => {
    return scrapedUrls.filter((url) =>
      url.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [scrapedUrls, searchTerm]);

  const FEATURES = useMemo(
    () => [
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
          <div>
            <RadioGroup
              value={inputMethod}
              onValueChange={setInputMethod}
              className="flex justify-between mb-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Manual" id="r1" />
                <Label htmlFor="r1">Manual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Sitemap" id="r2" />
                <Label htmlFor="r2">Sitemap/XML</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Placeholder" id="r3" />
                <Label htmlFor="r3">Placeholder</Label>
              </div>
            </RadioGroup>

            <Separator className="my-4" />

            {inputMethod === "Manual" && (
              <>
                {manualUrls.map((url, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Input
                      type="text"
                      placeholder="Enter URL here"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...manualUrls];
                        newUrls[index] = e.target.value;
                        setManualUrls(newUrls);
                      }}
                      className="flex-grow bg-muted"
                    />
                    {index !== 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newUrls = manualUrls.filter(
                            (_, i) => i !== index
                          );
                          setManualUrls(newUrls);
                        }}
                        className="ml-2"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                    {index === manualUrls.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (url.trim() !== "") {
                            setManualUrls([...manualUrls, ""]);
                          }
                        }}
                        className="ml-2"
                        disabled={url.trim() === ""}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </>
            )}

            {inputMethod === "Sitemap" && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter sitemap URL here"
                    className="flex-grow bg-muted"
                    value={sitemapUrl}
                    onChange={(e) => setSitemapUrl(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={handleSitemapScrape}
                    disabled={isScraping || !sitemapUrl}
                  >
                    {isScraping ? "Scraping..." : "Scrape"}
                  </Button>
                </div>

                {isScraping ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  scrapedUrls.length > 0 && (
                    <div className="mt-2">
                      <Separator className="my-4" />
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="relative flex-grow">
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4" />
                          <Input
                            type="text"
                            placeholder="Search URLs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-3 w-full"
                          />
                        </div>
                        {searchTerm && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSearchTerm("")}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">Select</TableHead>
                              <TableHead>URL</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredScrapedUrls.map((url, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedScrapedUrls.includes(url)}
                                    onCheckedChange={(checked) => {
                                      setSelectedScrapedUrls((prev) =>
                                        checked
                                          ? [...prev, url]
                                          : prev.filter((u) => u !== url)
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell className="truncate">
                                  {url}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {inputMethod === "Placeholder" && (
              <div className="p-4 bg-gray-100 rounded-md">
                <p>Hello</p>
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Scraped Content",
        description: "Here's the content scraped from the provided URL.",
        content: (
          <ScrollArea className="h-[400px] w-full">
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
    ],
    [
      inputMethod,
      manualUrls,
      sitemapUrl,
      isScraping,
      scrapedUrls,
      selectedScrapedUrls,
      scrapedContent,
      handleSitemapScrape,
      searchTerm,
      filteredScrapedUrls,
    ]
  );

  return (
    <div
      className={cn(
        "mx-auto overflow-hidden rounded-xl border bg-background z-50 transition-all duration-300",
        activeIndex === 1 || activeIndex === 2
          ? "w-5/6 max-w-5xl"
          : "w-2/3 max-w-4xl"
      )}
    >
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
          <div key={index} className="px-6 pt-6" ref={ref}>
            <h3 className="mb-2 text-xl font-medium text-zinc-800 dark:text-zinc-100">
              {feature.title}
            </h3>
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">
              {feature.description}
            </p>
            {feature.content && <div className="mt-4">{feature.content}</div>}
          </div>
        ))}
      </TransitionPanel>
      <div className="flex justify-between p-6">
        {activeIndex > 0 ? (
          <Button
            variant="outline"
            onClick={() => handleSetActiveIndex(activeIndex - 1)}
          >
            Previous
          </Button>
        ) : (
          <div />
        )}

        {activeIndex === FEATURES.length - 1 ? (
          <>
            {isLoading ? (
              <Button
                disabled
                variant="success"
                onClick={() => handleSetActiveIndex(0)}
              >
                <span className="animate-spin mr-2">
                  <LoaderIcon />
                </span>
                Creating
              </Button>
            ) : (
              <Button variant="success" onClick={() => handleSetActiveIndex(0)}>
                Create Knowledge Base
              </Button>
            )}
          </>
        ) : (
          <Button
            variant="secondary"
            onClick={() => handleSetActiveIndex(activeIndex + 1)}
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <span className="animate-spin mr-2">
                  <LoaderIcon />
                </span>
                Converting
              </>
            ) : (
              "Next"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
