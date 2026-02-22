import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up | SRIJAN'26",
    description:
        "Create an account for F.E.T.S.U. presents SRIJAN'26, the annual Techno-Management fest of Jadavpur University. Participate in over 50+ events comprising genres of Coding, Gaming, Management, Brainstorming and many more.",
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
            "F.E.T.S.U. presents SRIJAN'26, the annual Techno-Management fest of Jadavpur University. Participate in over 50+ events comprising genres of Coding, Gaming, Management, Brainstorming and many more. ",
        creator: "FETSU",
        images: ["https://srijanju.in/opengraph.webp"],
    },
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
