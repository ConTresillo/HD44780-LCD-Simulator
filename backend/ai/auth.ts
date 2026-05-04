import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import http from 'http';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-ai-secret-key-2026';

export const AIAuth = {
  /**
   * Validates password and generates an HTTP-only cookie with a JWT token.
   */
  handleLoginRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { password } = JSON.parse(body);
        const requiredPassword = process.env.AI_PASSWORD;

        if (requiredPassword && password !== requiredPassword) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized' }));
          return;
        }

        // Generate Token
        const token = jwt.sign({ role: 'ai_admin' }, JWT_SECRET, { expiresIn: '4h' });

        // Set HTTP-only Cookie
        const setCookieHeader = cookie.serialize('ai_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax', // Changed from strict to lax for cross-origin local dev
          maxAge: 60 * 60 * 4, // 4 hours
          path: '/'
        });

        console.log(`[AUTH] Issued new session for AI. Token prefix: ${token.substring(0, 10)}`);

        res.writeHead(200, {
          'Set-Cookie': setCookieHeader,
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ success: true }));

      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Bad Request' }));
      }
    });
  },

  /**
   * Middleware to verify token from WebSocket handshake request.
   */
  verifyWebSocketAuth(req: http.IncomingMessage): boolean {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const token = cookies.ai_session;
      
      if (!token) {
        console.warn('[AUTH] No ai_session cookie found in WS handshake headers.');
        return false;
      }

      jwt.verify(token, JWT_SECRET);
      console.log('[AUTH] WS Handshake Authenticated successfully.');
      return true;
    } catch (err: any) {
      console.error('[AUTH] WS Handshake Authentication failed:', err.message);
      return false;
    }
  }
};
