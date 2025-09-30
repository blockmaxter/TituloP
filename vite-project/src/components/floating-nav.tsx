import { Button } from "@/components/ui/button";
import { LayoutDashboard, List, BarChart3 } from "lucide-react";

interface FloatingNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function FloatingNav({ activeSection, onSectionChange }: FloatingNavProps) {
  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ciclo-vida', label: 'Ciclo de Vida', icon: List },
    { id: 'analitica', label: 'Analítica', icon: BarChart3 },
  ];

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-2">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={activeSection === section.id ? "default" : "outline"}
          size="sm"
          onClick={() => onSectionChange(section.id)}
          className="w-12 h-12 p-0 rounded-full shadow-lg"
          title={section.label}
        >
          <section.icon className="h-5 w-5" />
        </Button>
      ))}
    </div>
  );
}