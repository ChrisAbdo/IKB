import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/(auth)/auth";
import { SignOutButton } from "./sign-out";
import { Session } from "next-auth";

export default function ProfileDropdown({ session }: { session: Session }) {
  const signOutAction = async () => {
    "use server";
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Image
            className="h-6 w-6 select-none rounded-full ring-1 ring-zinc-100/10 grayscale"
            src={`https://avatar.vercel.sh/${session.user?.email}`}
            alt="avatar"
            height={48}
            width={48}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 mb-2"
        align="center"
        side="right"
        sideOffset={4}
        forceMount
      >
        <DropdownMenuItem className="flex justify-between">
          <div className="text-xs font-medium">{session.user?.email}</div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutButton signOutAction={signOutAction} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
