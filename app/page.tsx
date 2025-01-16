"use client";

import { useLocalStorage } from "@uidotdev/usehooks";

export default function Home() {
  const [userId] = useLocalStorage<string | null>("test-userId");
  const [username] = useLocalStorage<string | null>("test-username");
  return (
    <main>
      {username && <div>Current logged in user: {username}</div>}
      {/* User not signed in */}
      {!userId && <div>Not signed in</div>}
    </main>
  );
}
