
import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
  fallback?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className,
  color,
  fallback = "CircleAlert",
  onClick,
}) => {
  const LucideIcon = (LucideIcons as Record<string, React.ElementType>)[name] || 
                     (LucideIcons as Record<string, React.ElementType>)[fallback];

  if (!LucideIcon) {
    console.warn(`Icon ${name} not found and fallback ${fallback} also not found`);
    return null;
  }

  return (
    <LucideIcon 
      size={size} 
      className={cn("", className)} 
      color={color}
      onClick={onClick}
    />
  );
};

export default Icon;
