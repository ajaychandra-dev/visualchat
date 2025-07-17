import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// TODO: Add metadata
// export const metadata: Metadata = {
//   title: "Visual Chat",
//   description: "AI Visual Chat",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-[100vw] h-[100vh] bg-background`}>
        {children}
      </body>
    </html>
  );
}
