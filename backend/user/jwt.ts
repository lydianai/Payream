// TODO: Replace with a strong, securely-stored secret. For production, use a proper secret management solution.
const jwtSecret = "your-super-secret-jwt-key-that-is-long-and-random";

export async function generateJWT(payload: { sub: string; email: string; name: string }): Promise<string> {
  // Simple JWT generation - in production, use a proper JWT library
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const jwtPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(jwtPayload));
  
  // In production, implement proper HMAC-SHA256 signing
  const signature = btoa(`${encodedHeader}.${encodedPayload}.${jwtSecret}`);
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
