import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation | JobeeLanka Internal",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function SwaggerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

