import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Events | SRIJAN'26",
    description:
        "F.E.T.S.U. presents SRIJAN'26, the annual Techno-Management fest of Jadavpur University. Participate in over 50+ events comprising genres of Coding, Gaming, Management, Brainstorming and many more.",
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
