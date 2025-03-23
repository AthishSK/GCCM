import { writable } from 'svelte/store';

export const user = writable(null);
export const isAuthenticated = writable(false);
export const userRole = writable(null);

export async function checkAuth() {
  try {
    const response = await fetch('http://localhost:3001/auth/me', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const userData = await response.json();
      user.set(userData);
      isAuthenticated.set(true);
      userRole.set(userData.role);
    } else {
      user.set(null);
      isAuthenticated.set(false);
      userRole.set(null);
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    user.set(null);
    isAuthenticated.set(false);
    userRole.set(null);
  }
}

export function logout() {
  fetch('http://localhost:3001/auth/logout', {
    credentials: 'include'
  }).then(() => {
    user.set(null);
    isAuthenticated.set(false);
    userRole.set(null);
  });
} 