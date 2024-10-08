"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// components
import FooterSmall from "../components/FooterSmall";

export default function Auth({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth/login"); 
  }, [router]);

  return (
    <>
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-gray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage: "url(/img/register_bg_2.png)",
            }}>
            {children}
          </div>
          <FooterSmall absolute/>
        </section>
      </main>
    </>
  );
}
