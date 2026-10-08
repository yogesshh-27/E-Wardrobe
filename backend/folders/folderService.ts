/**
 * WARDROBE AI - Custom Wardrobe Folders Service
 * Gender-neutral organization with full create, rename, and delete capabilities.
 */

import { assertResourceOwnership } from '../security/authorization';

export interface WardrobeFolder {
  id: string;
  userId: string;
  name: string;
  slug: string;
  icon: string;
  createdAt: string;
}

// Default in-memory stores for demonstration/resilience
const foldersStore: WardrobeFolder[] = [
  { id: 'fld_1', userId: 'usr_demo_wardrobe_001', name: 'Tops & Shirts', slug: 'tops-shirts', icon: 'Shirt', createdAt: new Date().toISOString() },
  { id: 'fld_2', userId: 'usr_demo_wardrobe_001', name: 'Trousers & Jeans', slug: 'trousers-jeans', icon: 'Scissors', createdAt: new Date().toISOString() },
  { id: 'fld_3', userId: 'usr_demo_wardrobe_001', name: 'Outerwear & Coats', slug: 'outerwear-coats', icon: 'Layers', createdAt: new Date().toISOString() },
  { id: 'fld_4', userId: 'usr_demo_wardrobe_001', name: 'Footwear', slug: 'footwear', icon: 'Footprints', createdAt: new Date().toISOString() },
  { id: 'fld_5', userId: 'usr_demo_wardrobe_001', name: 'Accessories & Bags', slug: 'accessories-bags', icon: 'Sparkles', createdAt: new Date().toISOString() },
  { id: 'fld_6', userId: 'usr_demo_wardrobe_001', name: 'Traditional & Formal', slug: 'traditional-formal', icon: 'Bookmark', createdAt: new Date().toISOString() },
];

export async function getUserFolders(userId: string): Promise<WardrobeFolder[]> {
  return foldersStore.filter((f) => f.userId === userId);
}

export async function createFolder(userId: string, name: string, icon = 'Folder'): Promise<WardrobeFolder> {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const folder: WardrobeFolder = {
    id: `fld_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    userId,
    name,
    slug,
    icon,
    createdAt: new Date().toISOString(),
  };
  foldersStore.push(folder);
  return folder;
}

export async function updateFolder(
  userId: string,
  folderId: string,
  updates: { name?: string; icon?: string }
): Promise<WardrobeFolder> {
  const folder = foldersStore.find((f) => f.id === folderId);
  if (!folder) throw new Error('Folder not found');
  assertResourceOwnership(userId, folder.userId);

  if (updates.name) {
    folder.name = updates.name;
    folder.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  if (updates.icon) {
    folder.icon = updates.icon;
  }
  return folder;
}

export async function deleteFolder(userId: string, folderId: string): Promise<boolean> {
  const index = foldersStore.findIndex((f) => f.id === folderId);
  if (index === -1) throw new Error('Folder not found');
  assertResourceOwnership(userId, foldersStore[index].userId);

  foldersStore.splice(index, 1);
  return true;
}
