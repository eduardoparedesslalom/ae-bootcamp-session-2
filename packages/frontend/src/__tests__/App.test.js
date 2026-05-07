import React, { act } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const defaultItems = [
  { id: 1, name: 'Test Item 1', created_at: '2023-01-01T00:00:00.000Z' },
  { id: 2, name: 'Test Item 2', created_at: '2023-01-02T00:00:00.000Z' },
];

// Mock server to intercept API requests
const server = setupServer(
  rest.get('/api/items', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(defaultItems));
  }),

  rest.post('/api/items', (req, res, ctx) => {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Item name is required' }));
    }
    return res(ctx.status(201), ctx.json({ id: 3, name, created_at: new Date().toISOString() }));
  }),

  rest.put('/api/items/:id', (req, res, ctx) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Item name is required' }));
    }
    const original = defaultItems.find((i) => i.id === parseInt(id));
    if (!original) {
      return res(ctx.status(404), ctx.json({ error: 'Item not found' }));
    }
    return res(ctx.status(200), ctx.json({ ...original, name: name.trim() }));
  }),

  rest.delete('/api/items/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(ctx.status(200), ctx.json({ message: 'Item deleted successfully', id: parseInt(id) }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderApp = async () => {
  await act(async () => {
    render(<App />);
  });
};

describe('App Component', () => {
  test('renders the header', async () => {
    await renderApp();
    expect(screen.getByText('To Do App')).toBeInTheDocument();
    expect(screen.getByText('Keep track of your tasks')).toBeInTheDocument();
  });

  test('shows a loading spinner then displays items', async () => {
    await renderApp();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
  });

  test('adds a new item', async () => {
    const user = userEvent.setup();
    await renderApp();

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const input = screen.getByPlaceholderText('Enter item name');
    await user.type(input, 'New Test Item');

    const submitButton = screen.getByRole('button', { name: /add item/i });
    await act(async () => { await user.click(submitButton); });

    await waitFor(() => {
      expect(screen.getByText('New Test Item')).toBeInTheDocument();
    });
  });

  test('handles API error on fetch', async () => {
    server.use(
      rest.get('/api/items', (req, res, ctx) => res(ctx.status(500)))
    );

    await renderApp();

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no items exist', async () => {
    server.use(
      rest.get('/api/items', (req, res, ctx) => res(ctx.status(200), ctx.json([])))
    );

    await renderApp();

    await waitFor(() => {
      expect(screen.getByText('No items found. Add some!')).toBeInTheDocument();
    });
  });

  test('clicking Edit shows an edit text field pre-filled with the item name', async () => {
    const user = userEvent.setup();
    await renderApp();

    await waitFor(() => expect(screen.getByText('Test Item 1')).toBeInTheDocument());

    const editButton = screen.getByRole('button', { name: /edit test item 1/i });
    await act(async () => { await user.click(editButton); });

    const editInput = screen.getByDisplayValue('Test Item 1');
    expect(editInput).toBeInTheDocument();
  });

  test('saving an edit updates the item name in the list', async () => {
    const user = userEvent.setup();
    await renderApp();

    await waitFor(() => expect(screen.getByText('Test Item 1')).toBeInTheDocument());

    const editButton = screen.getByRole('button', { name: /edit test item 1/i });
    await act(async () => { await user.click(editButton); });

    const editInput = screen.getByDisplayValue('Test Item 1');
    await user.clear(editInput);
    await user.type(editInput, 'Updated Name');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await act(async () => { await user.click(saveButton); });

    await waitFor(() => {
      expect(screen.getByText('Updated Name')).toBeInTheDocument();
    });
  });

  test('cancelling an edit leaves the item name unchanged', async () => {
    const user = userEvent.setup();
    await renderApp();

    await waitFor(() => expect(screen.getByText('Test Item 1')).toBeInTheDocument());

    const editButton = screen.getByRole('button', { name: /edit test item 1/i });
    await act(async () => { await user.click(editButton); });

    const editInput = screen.getByDisplayValue('Test Item 1');
    await user.clear(editInput);
    await user.type(editInput, 'Changed Name');

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await act(async () => { await user.click(cancelButton); });

    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Changed Name')).not.toBeInTheDocument();
  });

  test('each item has a drag handle', async () => {
    await renderApp();

    await waitFor(() => expect(screen.getByText('Test Item 1')).toBeInTheDocument());

    const dragHandles = screen.getAllByRole('button', { name: /drag/i });
    expect(dragHandles.length).toBe(defaultItems.length);
  });
});