# Coding Guidelines

This document describes the coding style and quality principles for the To Do App. All contributors should follow these guidelines to keep the codebase consistent and maintainable.

## General Formatting

- Use **2 spaces** for indentation (no tabs).
- Keep lines under **100 characters** where practical.
- Use **single quotes** for strings in JavaScript, except when the string contains a single quote character.
- Always add a **trailing newline** at the end of every file.
- Remove **trailing whitespace** before committing.
- Use **semicolons** at the end of statements.

## Import Organization

Organize imports in the following order, with a blank line separating each group:

1. **Node.js built-in modules** (e.g., `path`, `fs`)
2. **Third-party packages** (e.g., `react`, `express`, `axios`)
3. **Internal modules / local files** (e.g., `./utils`, `../components/Button`)

Within each group, sort imports alphabetically. Avoid unused imports — remove them before committing.

## Linter Usage

- **ESLint** is the required linter for both frontend and backend code.
- All code must pass linting with zero errors before merging.
- Warnings should be addressed where possible; do not suppress them without justification.
- Do not disable ESLint rules inline (`// eslint-disable`) unless absolutely necessary, and always include a comment explaining why.

## Naming Conventions

- Use **camelCase** for variables and functions (e.g., `fetchItems`, `newItemName`).
- Use **PascalCase** for React components and classes (e.g., `TodoItem`, `App`).
- Use **UPPER_SNAKE_CASE** for constants (e.g., `MAX_RETRIES`, `API_BASE_URL`).
- File names should match the primary export they contain (e.g., `TodoItem.js` for the `TodoItem` component).

## DRY Principle (Don't Repeat Yourself)

- Avoid duplicating logic. If the same code appears in more than one place, extract it into a shared function, hook, or utility module.
- Reuse MUI theme tokens and shared styles rather than hardcoding values in multiple places.
- Common API call patterns should be abstracted into helper functions or custom React hooks.

## Component and Function Design

- Keep functions and components **small and focused** — each should do one thing well.
- Prefer **pure functions** where possible (no side effects, same output for same input).
- React components should be **functional components** using hooks; avoid class components.
- Avoid deeply nested logic — extract complex conditions into well-named variables or helper functions.

## Error Handling

- Always handle errors in `async`/`await` calls using `try/catch`.
- Surface meaningful error messages to the user rather than swallowing errors silently.
- Log errors to the console on the backend for observability.

## Comments and Documentation

- Write **self-documenting code** — clear naming reduces the need for comments.
- Add comments only when the *why* behind a decision is not obvious from the code itself.
- Keep comments up to date; outdated comments are worse than no comments.
