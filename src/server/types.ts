import type { D1Database, Fetcher } from '@cloudflare/workers-types';

export interface BackendEnv {
  DB: D1Database;
  ASSETS?: Fetcher;
  APP_ENV?: string;
  APP_SECRET?: string;
  ALLOWED_ORIGINS?: string;
  ADMIN_AUTH_MODE?: string;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD_HASH?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ACCESS_ALLOWED_EMAILS?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  INTERNAL_IPS?: string;
}
export interface AdminIdentity { email: string; csrf: string; mode: 'password' | 'access' }
export interface Visit {
  id: string; visitor_id: string; started_at: number; last_seen: number; entry_page: string;
  source: string; channel: string; referrer_host: string; country: string; device: string;
  language: string; is_internal: number; is_bot: number;
}
export type RecordData = Record<string, unknown>;
export const products = ['CBB60', 'CBB61', 'CBB65', 'CD60'] as const;
export const inquiryProducts = [...products, 'unknown'] as const;
export const statuses = ['pending', 'following', 'completed', 'spam'] as const;
export const publicEvents = new Set(['page_view', 'product_view', 'spec_expand', 'image_view', 'download_click', 'inquiry_click', 'whatsapp_click', 'email_click', 'form_start', 'form_failure']);
