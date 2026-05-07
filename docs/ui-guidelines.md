# UI Guidelines

This document describes the core UI guidelines for the To Do App.

## Component Library

- **Material UI (MUI)** components are required throughout the app.
- Do not use raw HTML elements (e.g., `<button>`, `<input>`) where an equivalent MUI component exists.
- Use MUI's component props and variants before adding custom CSS overrides.

## Color Palette

- The app must use a **blue color palette** as its primary theme.
- Use MUI's theme system to define primary and secondary colors. Do not hardcode color values in component styles.
- Example base color: `primary.main` should be a shade of blue (e.g., `#1976d2` or equivalent).

## Button Styles

- All buttons must use a **rounded style** (`border-radius` should be pill-shaped or sufficiently rounded).
- Apply consistent padding and sizing across all button instances.
- Use MUI `Button` with `variant="contained"` for primary actions and `variant="outlined"` for secondary actions.

## Accessibility

- The app must meet **high contrast** accessibility requirements (WCAG AA minimum, AAA preferred).
- Text and interactive elements must have sufficient color contrast against their backgrounds.
- All interactive elements must be keyboard-navigable and have visible focus indicators.
- Use semantic HTML and ARIA attributes where appropriate to support screen readers.
