import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Merchandise | SRIJAN'26",
    description:
        "Official Merchandise for SRIJAN'26, the annual Techno-Management fest of Jadavpur University. Polo t-shirt available in black and white colors.",
};

export default function MerchandiseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
