import { auth, signOut } from "@/app/(auth)/auth";
import { History } from "./history";
import { ModeToggle } from "./layout/mode-toggle";

// export const Navbar = async () => {
//   let session = await auth();

//   return (
//     <div className="absolute top-0 left-0 w-dvw border-b dark:border-zinc-800 py-2 px-3 justify-between flex flex-row items-center z-30">
//       <div className="flex flex-row gap-3 items-center">
//         <History />
//         <div className="text-sm dark:text-zinc-300">
//           Internal Knowledge Base
//         </div>
//       </div>

//       <div className="flex space-x-1">
//         {session ? (
//           <div className="group py-1 px-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer relative">
//             <div className="text-sm dark:text-zinc-400 z-10">
//               {session.user?.email}
//             </div>
// <div className="flex-col absolute top-6 right-0 w-full pt-5 group-hover:flex hidden">
{
  /* <form
  action={async () => {
    "use server";
    await signOut();
  }}
> */
}
//     <button
//       type="submit"
//       className="text-sm w-full p-1 rounded-md bg-red-500 text-red-50 hover:bg-red-600"
//     >
//       Sign out
//     </button>
//   </form>
// </div>
//           </div>
//         ) : (
// <div className="space-x-1">
//   <Button asChild variant="secondary">
//     <Link href="login">Login</Link>
//   </Button>
//   <Button asChild>
//     <Link href="register">Register</Link>
//   </Button>
// </div>
//         )}
//         <ModeToggle />
//       </div>
//     </div>
//   );
// };

import React from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import { HamburgerMenuIcon, RocketIcon } from "@radix-ui/react-icons";
// import ProfileDropdown from "./profile-dropdown";

// export const Navbar = async () => {
//   let session = await auth();

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <nav
//         className="flex items-center justify-between py-3 px-3"
//         aria-label="Global"
//       >
//         <div className="flex items-center gap-x-12">
//           <Link href="/" className="flex items-center space-x-2">
//             <RocketIcon className="h-5 w-5 text-foreground" />
//           </Link>
//           <History />
//           <div className="hidden md:flex md:gap-x-12">
//             <Link
//               href="/upload"
//               className={cn(
//                 "transition-colors hover:text-foreground/80 text-sm font-light"
//                 // pathname === "/upload"
//                 //   ? "text-foreground"
//                 //   : "text-foreground/60"
//               )}
//             >
//               Upload
//             </Link>

//             {session ? (
//               <Link
//                 href="/profile"
//                 className={cn(
//                   "transition-colors hover:text-foreground/80 text-sm font-light"
//                   // pathname === "/profile"
//                   //   ? "text-foreground"
//                   //   : "text-foreground/60"
//                 )}
//               >
//                 Profile
//               </Link>
//             ) : null}
//           </div>
//         </div>
//         <div className="flex lg:hidden">
//           <button
//             type="button"
//             className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
//           >
//             <span className="sr-only">Open main menu</span>
//             {/* <Menu className="h-6 w-6" aria-hidden="true" /> */}
//           </button>
//         </div>
//         <div className="flex items-center space-x-1">
//           {session ? (
//             // <ProfileDropdown />
//             <div className="group py-1 px-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer relative">
//               <div className="text-sm dark:text-zinc-400 z-10">
//                 {session.user?.email}
//               </div>
//               <div className="flex-col absolute top-6 right-0 w-full pt-5 group-hover:flex hidden">
//                 <form
//                   action={async () => {
//                     "use server";
//                     await signOut();
//                   }}
//                 >
//                   <button
//                     type="submit"
//                     className="text-sm w-full p-1 rounded-md bg-red-500 text-red-50 hover:bg-red-600"
//                   >
//                     Sign out
//                   </button>
//                 </form>
//               </div>
//             </div>
//           ) : (
//             <div className="space-x-1">
//               <Button asChild variant="link" size="sm">
//                 <Link href="login">Login</Link>
//               </Button>
//               <Button asChild variant="secondary" size="sm">
//                 <Link href="register">Sign Up</Link>
//               </Button>
//             </div>
//           )}

//           <ModeToggle />
//         </div>
//       </nav>
//     </header>
//   );
// };

import {
  Book,
  BookOpenText,
  CircleDotDashed,
  Code2,
  Plus,
  Settings2,
} from "lucide-react";
import ProfileDropdown from "./auth/profile-dropdown";
import NavLinks from "./layout/nav-links";

// import ProfileDropdown from "@/components/auth/profile-dropdown";

// import NavLinks from "./nav-links";

export const Navbar = async () => {
  let session = await auth();
  return (
    <div className=" w-full">
      <aside className="fixed bg-gray-50 dark:bg-neutral-900 inset-y-0 left-0 z-20 flex h-full w-[53px] flex-col border-r">
        <div className="border-b p-2">
          <Button asChild variant="ghost" size="icon" aria-label="Home">
            <Link href="/">
              <CircleDotDashed className="size-5 fill-foreground" />
            </Link>
          </Button>
        </div>
        <NavLinks />
        <nav className="mt-auto grid gap-1 p-2">
          {session ? <ProfileDropdown session={session} /> : null}
        </nav>
      </aside>
    </div>
  );
};
