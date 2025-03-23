import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session.userRole !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Get all users (admin only)
router.get('/', isAdmin, async (req, res) => {
  try {
    const db = getDatabase();
    const users = await db.all('SELECT id, username, email, role FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role (admin only)
router.patch('/:id/role', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'maintainer', 'developer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const db = getDatabase();
    await db.run('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    
    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Get user by ID (admin only)
router.get('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const user = await db.get('SELECT id, username, email, role FROM users WHERE id = ?', id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export const userRoutes = router; 