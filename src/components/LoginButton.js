// components/LoginButton.js
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <button onClick={() => signOut()}>Logout</button>
        <p>Signed in as {session.user.name}</p>
      </>
    );
  }
  return <button onClick={() => signIn("discord")}>Login with Discord</button>;
}
