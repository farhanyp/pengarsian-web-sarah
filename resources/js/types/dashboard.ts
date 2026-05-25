import type { LucideIcon } from 'lucide-react';

export interface MetricCard {
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    value: string;
    label: string;
    badge: string;
    badgeBg: string;
    badgeColor: string;
}

export interface RecentDoc {
    icon: LucideIcon;
    name: string;
    meta: string;
}

export interface TopStudent {
    name: string;
    nisn: string;
    major: string;
    score: number;
    status: 'Honor Roll' | 'Distinction' | 'Merit';
    avatarInitials: string;
    avatarGradient: string;
}
