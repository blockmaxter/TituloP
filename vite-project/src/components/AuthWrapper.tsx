export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  // Permitir acceso como visitante
  return <>{children}</>;
}
