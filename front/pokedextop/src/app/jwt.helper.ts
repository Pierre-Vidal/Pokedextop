// Simple JWT mock generator (client-side only, not secure)
export class JwtHelper {
  static generateToken(userId: number, username: string): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      userId: userId,
      username: username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24h expiration
    };

    const base64Header = btoa(JSON.stringify(header));
    const base64Payload = btoa(JSON.stringify(payload));
    const signature = btoa(`mock-signature-${userId}-${username}`);

    return `${base64Header}.${base64Payload}.${signature}`;
  }

  static decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }

    return Date.now() >= payload.exp * 1000;
  }
}
