declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    strokeWidth?: string | number
    absoluteStrokeWidth?: boolean
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
  
  // Add more icons as needed
  const lucideReact: {
    [key: string]: LucideIcon
  }
  
  export default lucideReact
}
