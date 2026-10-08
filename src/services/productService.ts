import { ClothingCategory, ProductItem } from '@/types';
import { IProductService } from './interfaces';
import { MOCK_PRODUCTS } from '@/data/mockProducts';

export class ProductService implements IProductService {
  async getRecommendationsForMissingCategory(
    category: ClothingCategory | string,
    _style?: string,
    _color?: string
  ): Promise<ProductItem[]> {
    // Artificial slight delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const normalizedCat = category.toLowerCase();
    const matched = MOCK_PRODUCTS.filter((p) => {
      const pCat = p.category.toLowerCase();
      return (
        pCat.includes(normalizedCat) ||
        normalizedCat.includes(pCat) ||
        (normalizedCat.includes('shoe') && pCat.includes('footwear')) ||
        (normalizedCat.includes('pant') && pCat.includes('trouser'))
      );
    });

    if (matched.length > 0) {
      return matched;
    }

    // Fallback: return top 3 products
    return MOCK_PRODUCTS.slice(0, 3);
  }

  async getTrendingProducts(stylePreferences?: string[]): Promise<ProductItem[]> {
    if (!stylePreferences || stylePreferences.length === 0) {
      return MOCK_PRODUCTS;
    }
    // Return all mock products with slight shuffle or priority
    return [...MOCK_PRODUCTS].sort(() => 0.5 - Math.random());
  }

  buildAffiliateSearchUrl(query: string, platform: ProductItem['platform']): string {
    const encoded = encodeURIComponent(query.trim());
    switch (platform) {
      case 'Amazon':
        return `https://www.amazon.in/s?k=${encoded}&tag=ewardrobe-21`;
      case 'Flipkart':
        return `https://www.flipkart.com/search?q=${encoded}&affid=ewardrobe`;
      case 'Meesho':
        return `https://www.meesho.com/search?q=${encoded}`;
      case 'Ajio':
        return `https://www.ajio.com/search/?text=${encoded}`;
      case 'Myntra':
      default:
        return `https://www.myntra.com/${encoded.toLowerCase()}?rawQuery=${encoded}&utm_source=ewardrobe`;
    }
  }
}

export const productService = new ProductService();
