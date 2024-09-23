import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { CheckIcon, FolderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileContextProps {
  activeFiles: string[];
  allFiles: string[];
  onFileToggle: (file: string) => void;
  onManageFiles: () => void;
}

export function FileContext({
  activeFiles,
  allFiles,
  onFileToggle,
  onManageFiles,
}: FileContextProps): React.ReactElement {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Manage active files"
          aria-expanded={open}
          className="flex justify-between md:max-w-[200px] lg:max-w-[200px]"
        >
          <>
            <span className="bg-emerald-400 size-2 rounded-full animate-pulse mr-2" />
            Active Files ({activeFiles.length})
          </>
          <CaretSortIcon className="ml-4 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search files..." />
          <CommandList>
            <CommandEmpty>No files found.</CommandEmpty>
            <CommandGroup heading="Files">
              {allFiles.map((file) => (
                <CommandItem key={file} onSelect={() => onFileToggle(file)}>
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      activeFiles.includes(file) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {file}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={onManageFiles}>
                <FolderIcon className="mr-2 h-4 w-4" />
                Manage Files
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
