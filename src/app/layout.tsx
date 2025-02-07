import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/containers/common/ToastContainer";
import ModalContainer from "@/containers/common/ModalContainer";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body className="font-pretendard">
        {children}
        <ToastContainer />
        <ModalContainer />
      </body>
    </html>
  );
}
