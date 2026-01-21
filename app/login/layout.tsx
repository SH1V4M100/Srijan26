import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Login | Srijan 2026",
    description: "Explore various events at JU Srijan 2025, from workshops to competitions, designed to inspire and engage aspiring entrepreneurs.",
    openGraph: {
        title: "Login | Srijan 2026",
        description: "Explore various events at JU Srijan 2025, from workshops to competitions, designed to inspire and engage aspiring entrepreneurs.",
        url: "https://srijanju.in/login",
        siteName: "F.E.T.S.U. presents Srijan 2026",
        images: [
            {
                url: "https://srijanju.in/opengraph-image.png",
                width: 1200,
                height: 640,
            },
        ],
        locale: "en_US",
        type: "website",
    },
};
export default async function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
       headers:await headers(),
  });
  if(session){
    redirect("/dashboard");
  }
  return (
    <>
      {children}
    </>
  );
}
