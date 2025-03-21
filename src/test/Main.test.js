import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Main from '../components/Main.svelte';

describe('Main Component', () => {
    it('renders the welcome message when no repository is selected', () => {
        render(Main);
        expect(screen.getByText('Welcome to Git Repository Manager')).toBeInTheDocument();
        expect(screen.getByText('Select a repository from the dropdown to get started')).toBeInTheDocument();
    });

    it('renders the repository selector', () => {
        render(Main);
        expect(screen.getByText('Select Repository')).toBeInTheDocument();
    });
}); 