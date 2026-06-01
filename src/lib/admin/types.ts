// Shapes mirror the backend Prisma models (NewsDigest_BackEnd/prisma/schema.prisma).

export type ArticleStatus = "PENDING" | "APPROVED" | "REJECTED";
export type DigestStatus = "DRAFT" | "APPROVED" | "SENT";

export interface AdminArticle {
  id: string;
  originalId: string;
  title: string;
  category: string;
  imageUrl?: string | null;
  sourceUrl?: string | null;
  fullContent: string;
  aiSummary?: string | null;
  editedSummary?: string | null;
  aiScore?: number | null;
  pubDate: string;
  status: ArticleStatus;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDigest {
  id: string;
  title: string;
  intro?: string | null;
  dateFor: string;
  status: DigestStatus;
  htmlWeb?: string;
  htmlEmail?: string;
  approvedAt?: string | null;
  sentAt?: string | null;
  publishedAt?: string | null;
  recipientCount: number;
  articles?: { id: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  country?: string | null;
  role: string;
  isSubscriber: boolean;
  isBannedUser: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface Analytics {
  totalUsers: number;
  activeSubscribers: number;
  totalRevenue: number;
  roleCounts: { role: string; _count: { role: number } }[];
  countries: { country: string | null; _count: { country: number } }[];
  monthlyUsers: { month: string; newUsers: number }[];
  monthlyRoleCounts: {
    month: string;
    USER: number;
    PREMIUM_USER: number;
    ENTERPRISE_USER: number;
  }[];
  subscriptions: { stripePriceId: string; _count: { stripePriceId: number } }[];
}

export interface AdminAuthUser {
  id: string;
  email: string;
  role: string;
}
