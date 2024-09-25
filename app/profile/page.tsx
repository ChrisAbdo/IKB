import React from "react";
import { auth } from "@/app/(auth)/auth";
import { getUser } from "@/app/db";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const userEmail = session.user.email;
  const [user] = await getUser(userEmail!);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="bg-background shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email</label>
          <p>{user.email}</p>
        </div>
        {/* Add more user details here if available in the database */}
      </div>
    </div>
  );
}
