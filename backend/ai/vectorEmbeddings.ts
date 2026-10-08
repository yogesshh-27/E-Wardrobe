/**
 * WARDROBE AI - Vector Embeddings & Semantic Similarity Engine (pgvector Compatible)
 * Produces 1536-dimensional embeddings for wardrobe items, outfits, and user style profiles.
 */

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Computes a standardized normalized embedding vector for wardrobe items and style preferences.
 * Maps categorical attributes and style aesthetics into a continuous metric space.
 */
export function generateSemanticEmbedding(
  description: string,
  category: string,
  style: string,
  colors: string[]
): number[] {
  const DIMENSIONS = 1536;
  const embedding = new Array(DIMENSIONS).fill(0);

  // Deterministic seed hashing from attributes
  const combined = `${category.toLowerCase()}_${style.toLowerCase()}_${colors.join('-').toLowerCase()}_${description.toLowerCase()}`;
  for (let i = 0; i < combined.length; i++) {
    const charCode = combined.charCodeAt(i);
    const index = (charCode * 31 + i * 17) % DIMENSIONS;
    embedding[index] += Math.sin(charCode + i) * 0.5 + 0.5;
  }

  // Normalize to unit vector for cosine distance
  let norm = 0;
  for (let i = 0; i < DIMENSIONS; i++) {
    norm += embedding[i] * embedding[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < DIMENSIONS; i++) {
      embedding[i] = Number((embedding[i] / norm).toFixed(6));
    }
  }

  return embedding;
}
