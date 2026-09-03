import { AdminLoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: "Sign in — Command Center",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className="texture-cream flex min-h-screen items-center justify-center">
      <AdminLoginForm />
    </main>
  );
}