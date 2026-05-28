import { LogOut } from "lucide-react";
import { logout } from "@/app/auth/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm text-cream/70 transition hover:bg-white/5 hover:text-gold-light"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </form>
  );
}
