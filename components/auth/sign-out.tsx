"use client";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface SignOutButtonProps {
  signOutAction: () => Promise<void>;
}

export function SignOutButton({ signOutAction }: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutAction();
    router.push("/login");
  };

  return (
    <DropdownMenuItem onSelect={handleSignOut}>
      <span>Log out</span>
    </DropdownMenuItem>
  );
}
