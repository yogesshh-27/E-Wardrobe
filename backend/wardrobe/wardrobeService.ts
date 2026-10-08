/**
 * WARDROBE AI - Wardrobe Items Service
 * Handles bounded paginated queries, ownership checks, and item CRUD.
 */

import { assertResourceOwnership } from '../security/authorization';
import { ExtractedWardrobeAttributes } from '../ai/geminiService';
import { generateSemanticEmbedding } from '../ai/vectorEmbeddings';

export interface WardrobeItemRecord {
  id: string;
  userId: string;
  folderId?: string;
  imageStorageKey: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  status: 'pending' | 'processing' | 'analyzed' | 'confirmed';
  attributes?: ExtractedWardrobeAttributes;
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
}

// In-memory demo store populated with chic initial pieces
const itemsStore: WardrobeItemRecord[] = [
  {
    id: 'itm_001',
    userId: 'usr_demo_wardrobe_001',
    folderId: 'fld_1',
    imageStorageKey: 'users/usr_demo_wardrobe_001/wardrobe/shirt_001.webp',
    originalFilename: 'white_oxford_shirt.webp',
    mimeType: 'image/webp',
    fileSizeBytes: 245000,
    status: 'confirmed',
    attributes: {
      category: 'Tops',
      subcategory: 'Oversized Oxford Shirt',
      primaryColor: 'White',
      accentColors: ['Pearl'],
      pattern: 'Solid',
      style: 'Minimalist Contemporary',
      fit: 'Oversized',
      material: 'Organic Cotton',
      season: ['Spring', 'Summer', 'Fall'],
      occasions: ['Smart Casual', 'Work', 'Travel'],
      formalityLevel: 6,
      confidence: 0.98,
      versatilityScore: 10,
      pairingNotes: 'Staple piece pairing with straight trousers or layered under coats.',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'itm_002',
    userId: 'usr_demo_wardrobe_001',
    folderId: 'fld_2',
    imageStorageKey: 'users/usr_demo_wardrobe_001/wardrobe/pants_001.webp',
    originalFilename: 'pleated_trousers.webp',
    mimeType: 'image/webp',
    fileSizeBytes: 310000,
    status: 'confirmed',
    attributes: {
      category: 'Bottoms',
      subcategory: 'Tailored Wide-Leg Trousers',
      primaryColor: 'Charcoal',
      accentColors: [],
      pattern: 'Solid',
      style: 'Quiet Luxury',
      fit: 'Relaxed',
      material: 'Wool Blend',
      season: ['All Season'],
      occasions: ['Office', 'Dinner', 'Gallery'],
      formalityLevel: 7,
      confidence: 0.96,
      versatilityScore: 9,
      pairingNotes: 'Flattering drape works with low sneakers or dress shoes.',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getPaginatedWardrobeItems(
  userId: string,
  params: { page: number; limit: number; folderId?: string; category?: string; search?: string }
): Promise<{ items: WardrobeItemRecord[]; total: number; page: number; totalPages: number }> {
  let userItems = itemsStore.filter((i) => i.userId === userId);

  if (params.folderId) {
    userItems = userItems.filter((i) => i.folderId === params.folderId);
  }
  if (params.category) {
    userItems = userItems.filter((i) => i.attributes?.category === params.category);
  }
  if (params.search) {
    const s = params.search.toLowerCase();
    userItems = userItems.filter(
      (i) =>
        i.originalFilename.toLowerCase().includes(s) ||
        i.attributes?.subcategory.toLowerCase().includes(s) ||
        i.attributes?.primaryColor.toLowerCase().includes(s)
    );
  }

  const total = userItems.length;
  const page = Math.max(1, params.page);
  const limit = Math.min(50, Math.max(1, params.limit));
  const offset = (page - 1) * limit;
  const pagedItems = userItems.slice(offset, offset + limit);

  return {
    items: pagedItems,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getWardrobeItemById(userId: string, itemId: string): Promise<WardrobeItemRecord> {
  const item = itemsStore.find((i) => i.id === itemId);
  if (!item) throw new Error('Wardrobe item not found');
  assertResourceOwnership(userId, item.userId);
  return item;
}

export async function createWardrobeItem(
  userId: string,
  data: {
    folderId?: string;
    imageStorageKey: string;
    originalFilename: string;
    mimeType: string;
    fileSizeBytes: number;
    attributes?: ExtractedWardrobeAttributes;
  }
): Promise<WardrobeItemRecord> {
  const embedding = data.attributes
    ? generateSemanticEmbedding(
        data.attributes.subcategory,
        data.attributes.category,
        data.attributes.style,
        [data.attributes.primaryColor, ...data.attributes.accentColors]
      )
    : undefined;

  const newItem: WardrobeItemRecord = {
    id: `itm_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    userId,
    folderId: data.folderId,
    imageStorageKey: data.imageStorageKey,
    originalFilename: data.originalFilename,
    mimeType: data.mimeType,
    fileSizeBytes: data.fileSizeBytes,
    status: data.attributes ? 'analyzed' : 'processing',
    attributes: data.attributes,
    embedding,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  itemsStore.unshift(newItem);
  return newItem;
}

export async function deleteWardrobeItem(userId: string, itemId: string): Promise<boolean> {
  const index = itemsStore.findIndex((i) => i.id === itemId);
  if (index === -1) throw new Error('Wardrobe item not found');
  assertResourceOwnership(userId, itemsStore[index].userId);

  itemsStore.splice(index, 1);
  return true;
}
