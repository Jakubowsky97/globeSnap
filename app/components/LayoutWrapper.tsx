// components/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Menu from "./menu";

export default function LayoutWrapper({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  const pathname = usePathname();

  return (
    <>
      {/* Renderuj Menu tylko wtedy, gdy użytkownik jest na stronie głównej ("/") */}
      {pathname === "/" && <Menu />}
      {children}
    </>
  );
}
