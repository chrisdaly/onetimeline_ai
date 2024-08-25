import { getServerSession } from "next-auth";
import Link from "next/link";
import Login from "./Login";
import SessionProvider from "./SessionProvider";
import { authOptions } from "./[...nextauth]";

import "./globals.css";

export const metadata = {
  title: "OneTimeLine Template",
  description: "Using Design and Ai to create the Perfect Timeline ",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  console.log("getting session");
  const session = await getServerSession(authOptions);
  console.log("session", session);

  return (
    <html data-theme="dark" lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <nav className="navbar bg-base-100 p-0">
          <div className="navbar-start">
            <Link legacyBehavior href="/">
              <a className="btn btn-ghost normal-case text-xl">
                {/* <img src="/logo.svg" alt="Logo" className="h-10 mr-2 logo" /> */}
                OneTimeLine
              </a>
            </Link>
          </div>
          {session ? <img src={session?.user?.image} alt="Custom Avatar" className="w-10 h-10 rounded-full mr-2" /> : null}
        </nav>

        <SessionProvider session={session}>{!session ? <Login /> : children}</SessionProvider>
      </body>
    </html>
  );
}
