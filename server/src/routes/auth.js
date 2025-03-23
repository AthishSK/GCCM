import express from 'express';
import passport from 'passport';
import { getDatabase } from '../database.js';

const router = express.Router();

// GitLab OAuth routes
router.get('/gitlab',
  passport.authenticate('gitlab', { scope: ['read_user', 'read_api'] })
);

router.get('/gitlab/callback',
  passport.authenticate('gitlab', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const db = getDatabase();
      const profile = req.user;

      // Check if user exists
      let user = await db.get(
        'SELECT * FROM users WHERE gitlab_id = ?',
        profile.id
      );

      if (!user) {
        // Create new user with default role
        const result = await db.run(
          'INSERT INTO users (gitlab_id, username, email) VALUES (?, ?, ?)',
          [profile.id, profile.username, profile.emails[0].value]
        );
        user = {
          id: result.lastID,
          gitlab_id: profile.id,
          username: profile.username,
          email: profile.emails[0].value,
          role: 'developer'
        };
      }

      // Set user role in session
      req.session.userRole = user.role;

      // Redirect to frontend with success
      res.redirect('http://localhost:5173/auth/success');
    } catch (error) {
      console.error('Error in GitLab callback:', error);
      res.redirect('http://localhost:5173/auth/error');
    }
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173');
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.emails[0].value,
    role: req.session.userRole
  });
});

export const authRoutes = router; 