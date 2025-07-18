declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    strokeWidth?: string | number
    absoluteStrokeWidth?: boolean
    className?: string
  }
  
  export type LucideIcon = FC<LucideProps>
  
  // Common icons used in the security tools
  export const Shield: LucideIcon
  export const Lock: LucideIcon
  export const Unlock: LucideIcon
  export const Key: LucideIcon
  export const Eye: LucideIcon
  export const EyeOff: LucideIcon
  export const AlertTriangle: LucideIcon
  export const CheckCircle: LucideIcon
  export const XCircle: LucideIcon
  export const UserCheck: LucideIcon
  export const Settings: LucideIcon
  export const Clock: LucideIcon
  export const MapPin: LucideIcon
  export const Smartphone: LucideIcon
  export const Monitor: LucideIcon
  export const Wifi: LucideIcon
  export const Activity: LucideIcon
  export const TrendingUp: LucideIcon
  export const TrendingDown: LucideIcon
  export const BarChart3: LucideIcon
  export const Users: LucideIcon
  export const Database: LucideIcon
  export const Server: LucideIcon
  export const Globe: LucideIcon
  export const Fingerprint: LucideIcon
  export const CreditCard: LucideIcon
  export const Camera: LucideIcon
  export const Search: LucideIcon
  export const Filter: LucideIcon
  export const Download: LucideIcon
  export const RefreshCw: LucideIcon
  export const Play: LucideIcon
  export const Pause: LucideIcon
  export const RotateCcw: LucideIcon
  export const FileText: LucideIcon
  export const Calendar: LucideIcon
  export const Timer: LucideIcon
  export const AlertCircle: LucideIcon
  export const Info: LucideIcon
  export const Bell: LucideIcon
  export const BellRing: LucideIcon
  export const Zap: LucideIcon
  export const Bug: LucideIcon
  export const Target: LucideIcon
  export const Radio: LucideIcon
  export const HardDrive: LucideIcon
  export const Code: LucideIcon
  
  // Game and UI icons
  export const Star: LucideIcon
  export const Trophy: LucideIcon
  export const Heart: LucideIcon
  export const Award: LucideIcon
  export const Medal: LucideIcon
  export const Brain: LucideIcon
  export const Lightbulb: LucideIcon
  export const BookOpen: LucideIcon
  export const Book: LucideIcon
  export const Users: LucideIcon
  export const User: LucideIcon
  export const Network: LucideIcon
  export const Cpu: LucideIcon
  export const DollarSign: LucideIcon
  export const Sparkles: LucideIcon
  export const Flame: LucideIcon
  export const Rocket: LucideIcon
  export const Skull: LucideIcon
  
  // Navigation and interaction icons
  export const X: LucideIcon
  export const ArrowLeft: LucideIcon
  export const ArrowRight: LucideIcon
  export const Home: LucideIcon
  export const Send: LucideIcon
  export const MessageCircle: LucideIcon
  export const Bot: LucideIcon
  export const ExternalLink: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronUp: LucideIcon
  export const ChevronDownIcon: LucideIcon
  export const ChevronUpIcon: LucideIcon
  
  // Gaming specific icons
  export const Gamepad2: LucideIcon
  export const Play: LucideIcon
  export const Pause: LucideIcon
  export const RotateCcw: LucideIcon
  
  // Security and encryption icons
  export const Hash: LucideIcon
  export const Binary: LucideIcon
  export const Calculator: LucideIcon
  export const ShieldIcon: LucideIcon
  export const LockIcon: LucideIcon
  export const EyeIcon: LucideIcon
  export const LightbulbIcon: LucideIcon
  export const BookOpenIcon: LucideIcon
  export const BrainIcon: LucideIcon
  export const ZapIcon: LucideIcon
  
  // Communication icons
  export const Mail: LucideIcon
  export const Router: LucideIcon
  export const Cable: LucideIcon
  
  // User management icons
  export const UserX: LucideIcon
  export const Edit3: LucideIcon
  export const FileX: LucideIcon
  export const Crown: LucideIcon
  
  // Add more icons as needed
  const lucideReact: {
    [key: string]: LucideIcon
  }
  
  export default lucideReact
}
