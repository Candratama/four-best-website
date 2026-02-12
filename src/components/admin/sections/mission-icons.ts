import {
  Handshake,
  Users,
  Laptop,
  Heart,
  Target,
  Star,
  Shield,
  Lightbulb,
  TrendingUp,
  Building2,
  Home,
  Award,
  Briefcase,
  Globe,
  Rocket,
  Zap,
  CheckCircle,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";

export const missionIconMap: Record<string, LucideIcon> = {
  handshake: Handshake,
  users: Users,
  laptop: Laptop,
  heart: Heart,
  target: Target,
  star: Star,
  shield: Shield,
  lightbulb: Lightbulb,
  "trending-up": TrendingUp,
  building: Building2,
  home: Home,
  award: Award,
  briefcase: Briefcase,
  globe: Globe,
  rocket: Rocket,
  zap: Zap,
  "check-circle": CheckCircle,
  "thumbs-up": ThumbsUp,
};

export const defaultIconCycle = ["handshake", "users", "laptop", "heart"];

export function getMissionIcon(icon: string | null, index: number): LucideIcon {
  if (icon && missionIconMap[icon]) return missionIconMap[icon];
  return missionIconMap[defaultIconCycle[index % defaultIconCycle.length]];
}

export const iconPickerOptions: { key: string; label: string; Icon: LucideIcon }[] = [
  { key: "handshake", label: "Handshake", Icon: Handshake },
  { key: "users", label: "Users", Icon: Users },
  { key: "laptop", label: "Laptop", Icon: Laptop },
  { key: "heart", label: "Heart", Icon: Heart },
  { key: "target", label: "Target", Icon: Target },
  { key: "star", label: "Star", Icon: Star },
  { key: "shield", label: "Shield", Icon: Shield },
  { key: "lightbulb", label: "Lightbulb", Icon: Lightbulb },
  { key: "trending-up", label: "Trending Up", Icon: TrendingUp },
  { key: "building", label: "Building", Icon: Building2 },
  { key: "home", label: "Home", Icon: Home },
  { key: "award", label: "Award", Icon: Award },
  { key: "briefcase", label: "Briefcase", Icon: Briefcase },
  { key: "globe", label: "Globe", Icon: Globe },
  { key: "rocket", label: "Rocket", Icon: Rocket },
  { key: "zap", label: "Zap", Icon: Zap },
  { key: "check-circle", label: "Check", Icon: CheckCircle },
  { key: "thumbs-up", label: "Thumbs Up", Icon: ThumbsUp },
];
