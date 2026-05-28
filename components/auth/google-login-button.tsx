import { signInWithGoogle } from "@/app/auth/oauth/actions";

export function GoogleLoginButton({ label = "Continue with Google" }: { label?: string }) {
  return (
    <form action={signInWithGoogle}>
      <button
        type="submit"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/15 px-5 text-sm font-semibold text-cream transition hover:border-gold/45 hover:bg-white/5"
      >
        {label}
      </button>
    </form>
  );
}
