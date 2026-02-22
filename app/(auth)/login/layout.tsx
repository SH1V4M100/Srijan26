import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | SRIJAN'26",
    description:
        "Login to your account for F.E.T.S.U. presents SRIJAN'26, the annual Techno-Management fest of Jadavpur University.",
    keywords: ["SRIJAN'26", "Jadavpur University", "Kolkata", "Fest", "Techfest", "Management events", "skills", "comedy show", "concert", "DJ night", "workshop", "seminar", "FETSU", "Techno-Management Fest", "Coding", "Gaming", "Management", "Brainstorming"],
    authors: [{ name: "FETSU" }],
    creator: "FETSU",
    publisher: "FETSU",
    openGraph: {
        type: "website",
    },
    twitter: {
        title: "SRIJAN'26 | Jadavpur University",
        description:
            "F.E.T.S.U. presents SRIJAN'26, the annual Techno-Management fest of Jadavpur University. Participate in over 50+ events comprising genres of Coding, Gaming, Management, Brainstorming and many more. Since it's inception in 2007, Srijan has held a plethora of events, and collecting the best ideas & minds of Kolkata ever since",
        creator: "FETSU",
        images: ["https://srijanju.in/opengraph.webp"],
    },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
