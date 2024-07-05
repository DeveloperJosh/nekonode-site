// pages/protected.js
import { getSession } from "next-auth/react";

export default function ProtectedPage() {
  return <div>Protected Content</div>;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
