import LoginPage from "../pages/login";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const isAuthenticated = Boolean(localStorage.getItem("firebaseUser"));

  if (!isAuthenticated) {
    return <LoginPage />;
  }
  return <>{children}</>;
}
