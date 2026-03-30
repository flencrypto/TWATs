/** Returns the NextAuth secret, preferring the v5 `AUTH_SECRET` env var. Throws if neither is set. */
export function getAuthSecret(): string {
  const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
  if (!authSecret) {
    throw new Error(
      'Missing AUTH_SECRET or NEXTAUTH_SECRET environment variable. Please set one to a strong, random value.'
    )
  }
  return authSecret
}
