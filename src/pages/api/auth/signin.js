import { getProviders, signIn } from 'next-auth/react';

export default function SignIn({ providers }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
      <h1 className="text-4xl font-bold mb-8">Sign In</h1>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        {Object.values(providers).map((provider) => (
          <div key={provider.name} className="mb-4">
            <button
              onClick={() => signIn(provider.id)}
              className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600 w-full"
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
