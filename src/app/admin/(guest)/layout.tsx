import type { ReactNode } from "react";

export default function AdminGuestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4 py-12">
      {children}
    </div>
  );
}
