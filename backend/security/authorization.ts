/**
 * WARDROBE AI - Server-Side Authorization & IDOR/BOLA Protection
 * Enforces ownership boundary: authenticated_user_id == resource.owner_id
 */

export class AuthorizationError extends Error {
  public statusCode = 403;
  constructor(message = 'Access forbidden: You do not have permission to access or modify this resource.') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class AuthenticationError extends Error {
  public statusCode = 401;
  constructor(message = 'Authentication required: Invalid or missing authentication credentials.') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Asserts that the authenticated user owns the resource.
 * Throws AuthorizationError (403) on mismatch.
 */
export function assertResourceOwnership(authenticatedUserId: string, resourceOwnerId: string): void {
  if (!authenticatedUserId || !resourceOwnerId) {
    throw new AuthorizationError('Missing subject or resource identifier for ownership verification.');
  }

  // Exact comparison preventing IDOR
  if (authenticatedUserId !== resourceOwnerId) {
    throw new AuthorizationError('Forbidden: Resource belongs to another user.');
  }
}

/**
 * Validates ownership returning boolean without throwing.
 */
export function isResourceOwner(authenticatedUserId: string, resourceOwnerId: string): boolean {
  if (!authenticatedUserId || !resourceOwnerId) return false;
  return authenticatedUserId === resourceOwnerId;
}
