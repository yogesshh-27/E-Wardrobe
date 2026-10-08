/**
 * WARDROBE AI - Strict Input Validation Schemas (Zod)
 * Validates request bodies, query params, IDs, and file metadata.
 */

import { z } from 'zod';

// UUID format validation for IDs
export const UUIDSchema = z.string().uuid('Invalid resource identifier format');

// Auth validation
export const GoogleLoginSchema = z.object({
  idToken: z.string().min(10, 'Google ID token required').max(4096),
});

export const PhoneLoginSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{6,14}$/, 'E.164 phone format required (e.g. +1234567890)'),
  verificationCode: z.string().length(6, 'Verification code must be 6 digits').optional(),
});

// Profile & Style Preferences
export const ProfileUpdateSchema = z.object({
  gender: z.string().max(64).optional(),
  avatarImageKey: z.string().max(512).optional(),
  hairDetails: z.record(z.string(), z.any()).optional(),
  measurements: z.record(z.string(), z.any()).optional(),
  onboardingCompleted: z.boolean().optional(),
});

export const StylePreferenceSchema = z.object({
  primaryStyle: z.string().min(2).max(64),
  styleWeights: z.record(z.string(), z.number().min(0).max(1)).optional(),
  fitPreferences: z.array(z.string().max(32)).max(10).optional(),
  colorDislikes: z.array(z.string().max(32)).max(20).optional(),
  aesthetics: z.array(z.string().max(64)).max(10).optional(),
});

// Secure Direct-to-Storage Upload Request
export const UploadUrlRequestSchema = z.object({
  filename: z.string().min(1).max(255).regex(/^[a-zA-Z0-9_\-.]+$/, 'Filename contains disallowed characters'),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    message: 'Only image/jpeg, image/png, and image/webp are allowed',
  }),
  fileSizeBytes: z.number().int().positive().max(10 * 1024 * 1024, 'File size must not exceed 10MB'),
  folderId: z.string().uuid().optional(),
});

// Wardrobe Item Attribute Confirmation
export const ItemAttributeConfirmSchema = z.object({
  category: z.enum(['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories', 'Traditional', 'Custom']),
  subcategory: z.string().max(64).optional(),
  primaryColor: z.string().min(2).max(64),
  accentColors: z.array(z.string().max(64)).max(5).optional(),
  pattern: z.string().max(64).optional(),
  style: z.string().max(64).optional(),
  fit: z.string().max(64).optional(),
  material: z.string().max(64).optional(),
  season: z.array(z.string().max(32)).max(5).optional(),
  occasions: z.array(z.string().max(64)).max(10).optional(),
  formalityLevel: z.number().int().min(1).max(10).optional(),
});

// Wardrobe Folder Management
export const FolderCreateSchema = z.object({
  name: z.string().min(1).max(64).trim(),
  icon: z.string().max(32).default('Folder'),
});

export const FolderUpdateSchema = z.object({
  name: z.string().min(1).max(64).trim().optional(),
  icon: z.string().max(32).optional(),
});

// Paginated Query Schema
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  folderId: z.string().uuid().optional(),
  category: z.string().max(64).optional(),
  search: z.string().max(100).optional(),
});

// Travel Planner Request Schema (Primary USP)
export const TravelPlanRequestSchema = z.object({
  destination: z.string().min(2).max(128).trim(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD format required'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD format required'),
  dailyItinerary: z.array(
    z.object({
      day: z.number().int().positive(),
      activity: z.string().min(2).max(255),
      occasion: z.string().max(128).optional(),
    })
  ).min(1).max(30),
  activities: z.array(z.string().max(64)).max(20).optional(),
  occasionRequirements: z.array(z.string().max(128)).max(10).optional(),
  weather: z.object({
    temperatureCelsius: z.number().min(-40).max(55).optional(),
    condition: z.string().max(64).optional(),
  }).optional(),
});

// Occasion Stylist Request Schema
export const OccasionStyleRequestSchema = z.object({
  occasion: z.string().min(2).max(128).trim(),
  vibe: z.string().max(128).optional(),
  formality: z.enum(['ultra-casual', 'casual', 'smart-casual', 'business', 'formal', 'black-tie']).default('smart-casual'),
  indoorOutdoor: z.enum(['indoor', 'outdoor', 'mixed']).default('indoor'),
  weatherNote: z.string().max(128).optional(),
});

// Recommendation Feedback Schema
export const RecommendationFeedbackSchema = z.object({
  action: z.enum(['liked', 'disliked', 'saved', 'skipped', 'purchased']),
  userComment: z.string().max(500).optional(),
});
