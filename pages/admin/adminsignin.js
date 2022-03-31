import { getProviders, signIn as SignIntoProvider } from "next-auth/react";
import Header from "../../components/Header";

export default function signIn({ providers }) {
  return (
    <div className="bg-gradient-to-br from-gray-700 to-black h-screen overflow-y-scroll scrollbar-hide">
      {/* <Header /> */}
      <div className="flex flex-col items-center justify-center min-h-screen py-2  px-14">
        <img src="/logo-main-white.svg" className="w-60" />

        <p className="text-3xl italic mt-10 text-gray-100">Upload files page</p>
        <div className="mt-40">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="p-3 bg-blue-500 rounded-lg text-white"
                onClick={() =>
                  SignIntoProvider(provider.id, {
                    callbackUrl: "/admin/adminindex",
                  })
                }
              >
                {/* <button onClick={() => SignIntoProvider(provider.id)}> */}
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
