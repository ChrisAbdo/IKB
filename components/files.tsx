"use client";

import { useState, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@/utils/functions";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { TrashIcon, UploadIcon, LoaderIcon } from "lucide-react";

export function Files({
  selectedFilePathnames,
  setSelectedFilePathnames,
  setIsFilesVisible,
  isFilesVisible,
}: {
  selectedFilePathnames: string[];
  setSelectedFilePathnames: React.Dispatch<React.SetStateAction<string[]>>;
  setIsFilesVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isFilesVisible: boolean;
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);
  const [deleteQueue, setDeleteQueue] = useState<Array<string>>([]);
  const {
    data: files,
    mutate,
    isLoading,
  } = useSWR<Array<{ pathname: string }>>("api/files/list", fetcher, {
    fallbackData: [],
  });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadQueue((currentQueue) => [...currentQueue, file.name]);
      await fetch(`/api/files/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });
      setUploadQueue((currentQueue) =>
        currentQueue.filter((filename) => filename !== file.name)
      );
      mutate([...(files || []), { pathname: file.name }]);
    }
  };

  const handleFileDelete = async (file: { pathname: string; url?: string }) => {
    setDeleteQueue((currentQueue) => [...currentQueue, file.pathname]);
    await fetch(`/api/files/delete?fileurl=${file.url}`, {
      method: "DELETE",
    });
    setDeleteQueue((currentQueue) =>
      currentQueue.filter((filename) => filename !== file.pathname)
    );
    setSelectedFilePathnames((currentSelections) =>
      currentSelections.filter((path) => path !== file.pathname)
    );
    mutate(files?.filter((f) => f.pathname !== file.pathname));
  };

  const toggleFileSelection = (pathname: string) => {
    setSelectedFilePathnames((currentSelections) => {
      if (currentSelections.includes(pathname)) {
        return currentSelections.filter((path) => path !== pathname);
      } else {
        return [...currentSelections, pathname];
      }
    });
  };

  return (
    <Drawer open={isFilesVisible} onClose={() => setIsFilesVisible(false)}>
      <DrawerContent className="h-1/2">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>Manage Knowledge Base</DrawerTitle>
          <Input
            className="w-[250px]"
            type="file"
            ref={inputFileRef}
            accept=".txt"
            onChange={handleFileUpload}
          />
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Select</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : files?.length === 0 && uploadQueue.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No files found
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {files?.map((file) => (
                    <TableRow key={file.pathname}>
                      <TableCell>
                        <Checkbox
                          checked={selectedFilePathnames.includes(
                            file.pathname
                          )}
                          onCheckedChange={() =>
                            toggleFileSelection(file.pathname)
                          }
                        />
                      </TableCell>
                      <TableCell>{file.pathname}</TableCell>
                      <TableCell>
                        {deleteQueue.includes(file.pathname) ? (
                          <LoaderIcon className="animate-spin" />
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleFileDelete(file)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {uploadQueue.map((fileName) => (
                    <TableRow key={fileName}>
                      <TableCell>
                        <LoaderIcon className="animate-spin h-4 w-4" />
                      </TableCell>
                      <TableCell>{fileName}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
        <DrawerFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {`${selectedFilePathnames.length}/${files?.length}`} Selected
          </div>
          <div>
            <Button onClick={() => setIsFilesVisible(false)}>Close</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
