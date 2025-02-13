import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/containers/common/ToastContainer";
import ModalContainer from "@/containers/common/ModalContainer";
import RootProvider from "@/contexts/RootProvider.context";
import { getMetadata } from "@/utils/getMetadata";

export const metadata: Metadata = getMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-pretendard">
        <RootProvider>
          {children}
          <ToastContainer />
          <ModalContainer />
        </RootProvider>
      </body>
    </html>
  );
}
