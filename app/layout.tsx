import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConfirmationDialogContextProvider } from "@/hooks/useConfirmationDialog";
import { MobileNavProvider } from "@/hooks/useMobileNav";
import NavBar from "@/components/NavBar";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "@/components/Landing/SmoothScroll";
import Footer from "@/components/Landing/Footer";
import { SessionProvider } from "next-auth/react";

const euclid = localFont({
    variable: "--font-euclid",
    src: "../public/fonts/Euclid-Circular-B.woff2",
    display: "swap",
    preload: true,
});

const elnath = localFont({
    variable: "--font-elnath",
    src: "../public/fonts/ELNATH.woff2",
    display: "swap",
    preload: true,
});

const futura = localFont({
    variable: "--font-futura",
    src: "../public/fonts/Futura-Now-Headline.woff2",
    display: "swap",
    preload: true,
});

export const metadata: Metadata = {
    title: "SRIJAN'26 | Jadavpur University",
    description:
        "F.E.T.S.U. presents SRIJAN'26, the annual Techno-Management fest of Jadavpur University. Participate in over 50+ events comprising genres of Coding, Gaming, Management, Brainstorming and many more. Since it's inception in 2007, Srijan has held a plethora of events, and collecting the best ideas & minds of Kolkata ever since",
    keywords: ["SRIJAN'26", "Jadavpur University", "Kolkata", "Fest", "Techfest", "Management events", "skills", "comedy show", "concert", "DJ night", "workshop", "seminar", "FETSU", "Techno-Management Fest", "Coding", "Gaming", "Management", "Brainstorming"],
    authors: [{ name: "FETSU" }],
    creator: "FETSU",
    publisher: "FETSU",
    openGraph: {
        title: "SRIJAN'26 | Jadavpur University",
        description:
            "F.E.T.S.U. presents SRIJAN'26, the annual Techno-Management fest of Jadavpur University. Participate in over 50+ events comprising genres of Coding, Gaming, Management, Brainstorming and many more. Since it's inception in 2007, Srijan has held a plethora of events, and collecting the best ideas & minds of Kolkata ever since",
        url: "https://srijanju.in",
        siteName: "SRIJAN'26",
        images: [
            {
                url: "https://srijanju.in/opengraph.webp",
                width: 1200,
                height: 640,
                alt: "SRIJAN'26 | Jadavpur University",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        title: "SRIJAN'26 | Jadavpur University",
        description:
            "F.E.T.S.U. presents SRIJAN'26, the annual Techno-Management fest of Jadavpur University. Participate in over 50+ events comprising genres of Coding, Gaming, Management, Brainstorming and many more. Ever since it's inception in 2007, Srijan has held a plethora of events, and collecting the best ideas & minds of Kolkata ever since",
        creator: "FETSU",
        images: ["https://srijanju.in/opengraph.webp"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${euclid.variable} ${elnath.variable} ${futura.variable} antialiased`}
            >
                <SessionProvider>
                    <SmoothScroll>
                        <MobileNavProvider>
                            <ConfirmationDialogContextProvider>
                                <NavBar />
                                {children}
                                <Footer />
                            </ConfirmationDialogContextProvider>
                        </MobileNavProvider>
                    </SmoothScroll>
                </SessionProvider>
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            backgroundColor: "#1c1c1c",
                            color: "white",
                            padding: "12px",
                            borderRadius: "6px",
                            minWidth: "300px",
                            textAlign: "left",
                            fontFamily: "Futura",
                            fontWeight: "bold",
                        },
                        success: {
                            iconTheme: {
                                primary: "#48ab60",
                                secondary: "white",
                            },
                        },
                    }}
                    containerStyle={{
                        right: 30,
                        bottom: 20,
                    }}
                />
            </body>
        </html>
    );
}
