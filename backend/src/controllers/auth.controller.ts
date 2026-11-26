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
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = db.getUserByEmail(cleanEmail);

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials provided.' });
    }

    const isValid = await authService.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials provided.' });
    }

    const token = authService.generateJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
      tier: user.tier,
    });

    res.cookie('simplepdf_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
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
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = db.getUserByEmail(cleanEmail);

    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await authService.hashPassword(password);

    const newUser: DbUser = {
      id: `usr_${uuidv4().slice(0, 8)}`,
      email: cleanEmail,
      name,
      role: 'user',
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
  if (!tokenUser || !tokenUser.email) {
    return res.status(401).json({ error: 'Unauthorized: Valid authentication token required.' });
  }

  const user = db.getUserByEmail(tokenUser.email);
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
