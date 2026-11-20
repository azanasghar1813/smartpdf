import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, DbUser } from '../services/dbService';
import { authService } from '../services/authService';

function sanitizeUser(user: DbUser): Omit<DbUser, 'passwordHash'> {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = db.getUserByEmail(cleanEmail);

    if (user && user.passwordHash && password) {
      const isValid = await authService.verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials provided.' });
      }
    } else if (!user) {
      // Auto-provision demo account with hashed password
      const passwordHash = password ? await authService.hashPassword(password) : undefined;
      user = {
        id: `usr_${uuidv4().slice(0, 8)}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: cleanEmail.includes('admin') ? 'admin' : 'user',
        tier: 'free',
        usageToday: 0,
        totalProcessed: 0,
        passwordHash,
        createdAt: new Date().toISOString(),
      };
      db.upsertUser(user);
    } else if (user && !user.passwordHash && password) {
      // Backfill password hash for legacy users
      const passwordHash = await authService.hashPassword(password);
      user.passwordHash = passwordHash;
      db.upsertUser(user);
    }

    const token = authService.generateJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
      tier: user.tier,
    });

    return res.json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('[AuthController] Login error:', err);
    return res.status(500).json({ error: 'Authentication service encountered an error.' });
  }
}

export async function registerUser(req: Request, res: Response) {
  try {
    const { email, name, password, role = 'user' } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = db.getUserByEmail(cleanEmail);

    if (existing) {
      const token = authService.generateJwt({
        userId: existing.id,
        email: existing.email,
        role: existing.role,
        tier: existing.tier,
      });
      return res.json({
        success: true,
        token,
        user: sanitizeUser(existing),
      });
    }

    const passwordHash = password ? await authService.hashPassword(password) : undefined;

    const newUser: DbUser = {
      id: `usr_${uuidv4().slice(0, 8)}`,
      email: cleanEmail,
      name,
      role: cleanEmail.includes('admin') || role === 'admin' ? 'admin' : 'user',
      tier: 'free',
      usageToday: 0,
      totalProcessed: 0,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    db.upsertUser(newUser);

    const token = authService.generateJwt({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      tier: newUser.tier,
    });

    return res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(newUser),
    });
  } catch (err) {
    console.error('[AuthController] Registration error:', err);
    return res.status(500).json({ error: 'Failed to complete registration.' });
  }
}

export function getCurrentUser(req: Request, res: Response) {
  const tokenUser = (req as any).user;
  const email = tokenUser?.email || (req.query.email as string) || 'demo@simplepdf.com';
  const user = db.getUserByEmail(email);

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  res.json(sanitizeUser(user));
}

export function getAllUsers(req: Request, res: Response) {
  const users = db.getAllUsers().map(sanitizeUser);
  res.json({
    usersCount: users.length,
    users,
  });
}
