import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App.jsx';

describe('TaskMaster App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the header and productivity overview', () => {
    render(<App />);
    expect(screen.getByText('TaskMaster')).toBeInTheDocument();
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('allows adding a new task with title and priority', () => {
    render(<App />);

    const titleInput = screen.getByPlaceholderText('What needs to be accomplished?');
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    fireEvent.change(titleInput, { target: { value: 'Test Vitest Task' } });
    expect(addButton).not.toBeDisabled();

    fireEvent.click(addButton);

    expect(screen.getByText('Test Vitest Task')).toBeInTheDocument();
  });

  it('opens and closes the customizations settings modal', () => {
    render(<App />);

    const customizeBtn = screen.getByRole('button', { name: /Open settings/i });
    fireEvent.click(customizeBtn);

    expect(screen.getByText('App Customizations & Preferences')).toBeInTheDocument();
    expect(screen.getByText('Accent Color')).toBeInTheDocument();

    const doneBtn = screen.getByRole('button', { name: /Done/i });
    fireEvent.click(doneBtn);

    expect(screen.queryByText('App Customizations & Preferences')).not.toBeInTheDocument();
  });
});

