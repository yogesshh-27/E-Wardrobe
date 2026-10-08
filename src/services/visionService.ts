import { ClothingCategory, VisionAnalysisResult } from '@/types';
import { IVisionService } from './interfaces';

const MOCK_CATEGORIES: ClothingCategory[] = [
  'Shirts',
  'T-Shirts',
  'Tops',
  'Trousers',
  'Jeans',
  'Blazers',
  'Kurtas',
  'Sarees',
  'Dresses',
  'Jackets',
  'Sweaters',
  'Sneakers',
  'Shoes',
  'Sandals',
  'Accessories',
  'Bags',
];

const MOCK_COLORS = [
  'White',
  'Black',
  'Charcoal Grey',
  'Navy Blue',
  'Beige',
  'Camel',
  'Olive Green',
  'Emerald Green',
  'Burgundy',
  'Sky Blue',
  'Cream',
  'Tan Brown',
];

const MOCK_PATTERNS = ['Solid', 'Stripes', 'Checks', 'Floral', 'Minimal patterns', 'Textured'];

const MOCK_STYLES = [
  'Minimalist / Classic',
  'Smart Casual',
  'Old Money / Elegant',
  'Traditional / Ethnic',
  'Streetwear',
  'Casual',
  'Bohemian',
];

const MOCK_MATERIALS = [
  '100% Breathable Cotton',
  'Silk Chanderi',
  'Pure Linen Blend',
  'Merino Wool',
  'Rigid Selvedge Denim',
  'Cashmere Blend',
  'Full Grain Nappa Leather',
];

export class VisionService implements IVisionService {
  async analyze(imageFileOrUrl: string | File): Promise<VisionAnalysisResult> {
    // Artificial slight delay to simulate high-tech neural network image inference
    await new Promise((resolve) => setTimeout(resolve, 1400));

    let filename = '';
    if (typeof imageFileOrUrl !== 'string' && imageFileOrUrl?.name) {
      filename = imageFileOrUrl.name.toLowerCase();
    }

    // Heuristics based on filename if available
    let category: ClothingCategory = 'Shirts';
    let name = 'Tailored Cotton Garment';
    let color = 'White';
    let formality: VisionAnalysisResult['formality'] = 'Smart Casual';
    let occasion = ['Casual Outing', 'Dinner'];

    if (filename.includes('pant') || filename.includes('trouser')) {
      category = 'Trousers';
      name = 'Tailored Pleated Trousers';
      color = 'Grey';
      formality = 'Formal';
      occasion = ['Office', 'Business Meeting', 'Dinner'];
    } else if (filename.includes('jean') || filename.includes('denim')) {
      category = 'Jeans';
      name = 'Classic Relaxed Denim';
      color = 'Navy Blue';
      formality = 'Casual';
      occasion = ['Casual Outing', 'College Event', 'Sightseeing'];
    } else if (filename.includes('kurta') || filename.includes('ethnic')) {
      category = 'Kurtas';
      name = 'Embroidered Festive Kurta';
      color = 'Olive Green';
      formality = 'Festive';
      occasion = ['Festival', 'Puja', 'Family Function', 'Wedding'];
    } else if (filename.includes('saree')) {
      category = 'Sarees';
      name = 'Woven Zari Silk Saree';
      color = 'Emerald Green';
      formality = 'Festive';
      occasion = ['Wedding', 'Festival', 'Puja'];
    } else if (filename.includes('blazer') || filename.includes('suit')) {
      category = 'Blazers';
      name = 'Structured Tailored Blazer';
      color = 'Charcoal Grey';
      formality = 'Formal';
      occasion = ['Office', 'Business Meeting', 'Dinner'];
    } else if (filename.includes('dress')) {
      category = 'Dresses';
      name = 'Flowy Midi Wrap Dress';
      color = 'Sky Blue';
      formality = 'Smart Casual';
      occasion = ['Date', 'Dinner', 'Brunch'];
    } else if (filename.includes('shoe') || filename.includes('sneaker')) {
      category = 'Sneakers';
      name = 'Low-Top Minimalist Sneakers';
      color = 'White';
      formality = 'Casual';
      occasion = ['Casual Outing', 'Travel'];
    } else if (filename.includes('tshirt') || filename.includes('tee')) {
      category = 'T-Shirts';
      name = 'Boxy Heavyweight Tee';
      color = 'Black';
      formality = 'Casual';
      occasion = ['Casual Outing', 'College Event'];
    } else {
      // Pick random varied realistic traits
      const randCat = MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)];
      category = randCat;
      color = MOCK_COLORS[Math.floor(Math.random() * MOCK_COLORS.length)];
      name = `${color} ${randCat.slice(0, -1) || randCat}`;
    }

    const pattern = MOCK_PATTERNS[Math.floor(Math.random() * MOCK_PATTERNS.length)];
    const style = MOCK_STYLES[Math.floor(Math.random() * MOCK_STYLES.length)];
    const material = MOCK_MATERIALS[Math.floor(Math.random() * MOCK_MATERIALS.length)];
    const fits = ['Fitted', 'Relaxed', 'Slim', 'Oversized'];
    const fit = fits[Math.floor(Math.random() * fits.length)];
    const seasons = [['Spring', 'Summer'], ['Autumn', 'Winter'], ['All Season']];
    const season = seasons[Math.floor(Math.random() * seasons.length)];

    return {
      category,
      name,
      color,
      pattern,
      style,
      material,
      occasion,
      season,
      formality,
      fit,
      confidence: Math.round(92 + Math.random() * 6),
    };
  }
}

export const visionService = new VisionService();
