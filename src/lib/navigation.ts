import { LayoutDashboard, FileText, type LucideIcon } from 'lucide-react'
import type { Role } from './auth-helpers'

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  roles: Role[]
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'user_reviewer', 'user_applicant'],
  },
  {
    href: '/antraege',
    label: 'Anträge',
    icon: FileText,
    roles: ['admin', 'user_reviewer', 'user_applicant'],
  },
]
