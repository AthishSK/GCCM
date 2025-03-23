# GitLab Role-Based Access Control (GCCM)

A professional web application built with SvelteKit that implements GitLab authentication and role-based access control in a private network environment. The application provides different UI interfaces based on user roles (Admin, Maintainer, and Developer).

## Features

### Authentication
- GitLab OAuth2 integration in private network
- Secure session management
- Automatic role assignment
- Protected routes based on user roles

### Role-Based Access
- **Admin**
  - View and manage all users
  - Assign and modify user roles
  - Access to all system features
  - User management dashboard

- **Maintainer**
  - Repository management capabilities
  - Merge request review interface
  - Project oversight tools
  - Team management features

- **Developer**
  - View assigned tasks
  - Create and manage merge requests
  - Access to development tools
  - Personal dashboard

### Technical Stack
- **Frontend**: SvelteKit with TailwindCSS
- **Backend**: Node.js with Express
- **Database**: SQLite
- **Authentication**: GitLab OAuth2
- **Styling**: TailwindCSS with Forms and Typography plugins

## Prerequisites

- Node.js (v14 or higher)
- Access to GitLab instance (private network - http://80.1.0.250:100)
- GitLab administrator access (for OAuth application setup)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gccm
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

4. Create environment files:
   
   Create a `.env` file in the root directory:
   ```env
   GITLAB_CLIENT_ID=your_gitlab_client_id
   GITLAB_CLIENT_SECRET=your_gitlab_client_secret
   SESSION_SECRET=your_session_secret
   PORT=3001
   ```

## GitLab Configuration

1. Access your GitLab instance (http://80.1.0.250:100)
2. Log in as an administrator
3. Navigate to Admin Area > Applications
4. Create a new application:
   - Name: GCCM
   - Redirect URI: http://localhost:3001/auth/gitlab/callback
   - Scopes: 
     - read_user
     - read_api
5. Copy the provided Client ID and Client Secret to your `.env` file

## Development Setup

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   npm run dev
   ```

3. Access the application at http://localhost:5173

## Production Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Build the backend:
   ```bash
   cd server
   npm run build
   ```

3. Start the production servers:
   ```bash
   # Start backend
   cd server
   npm start

   # Serve frontend build
   npm run preview
   ```

## Project Structure

```
gccm/
├── src/                    # Frontend source code
│   ├── lib/               # Shared components and utilities
│   │   ├── stores/        # Svelte stores (auth, user)
│   │   └── components/    # Reusable components
│   ├── routes/            # SvelteKit routes
│   └── app.css           # Global styles
├── server/                # Backend source code
│   ├── src/              # Server source files
│   │   ├── routes/       # API routes
│   │   └── database.js   # Database configuration
│   └── package.json      # Backend dependencies
├── static/                # Static assets
├── package.json          # Frontend dependencies
├── svelte.config.js      # SvelteKit configuration
├── tailwind.config.js    # TailwindCSS configuration
└── vite.config.js        # Vite configuration
```

## Security Considerations

- All API endpoints are protected with authentication
- Session management uses secure HTTP-only cookies
- OAuth2 implementation follows security best practices
- Environment variables for sensitive configuration
- Role-based access control at both frontend and backend
- Private network isolation

## Troubleshooting

### Common Issues

1. **Styling Issues in Production**
   - Ensure TailwindCSS is properly built
   - Run `npm run build` before deployment
   - Check if all CSS plugins are installed

2. **Authentication Failures**
   - Verify GitLab OAuth credentials
   - Check network connectivity to GitLab instance
   - Ensure correct redirect URI configuration

3. **Role-Based Access Issues**
   - Verify user role assignment in database
   - Check role middleware configuration
   - Clear browser cache and cookies

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact the development team or create an issue in the repository.

## Acknowledgments

- SvelteKit team for the excellent framework
- TailwindCSS team for the styling framework
- GitLab team for OAuth2 implementation
