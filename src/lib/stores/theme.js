import { writable } from 'svelte/store';

// Create the theme store with a default value
export const theme = writable('dark');

// Simple theme toggle function
export function toggleTheme() {
    theme.update(currentTheme => {
        return currentTheme === 'dark' ? 'light' : 'dark';
    });
}

// Initialize theme only in browser
if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme') || 'dark';
    theme.set(storedTheme);
    document.documentElement.classList.add(storedTheme);
} 