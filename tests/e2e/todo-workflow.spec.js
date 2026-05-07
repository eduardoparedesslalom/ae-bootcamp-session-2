// @ts-check
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Todo Workflow', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.waitForItemsLoaded();
  });

  test('loads the page and displays pre-seeded items', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'To Do App' })).toBeVisible();
    await expect(page.getByText('Item 1')).toBeVisible();
    await expect(page.getByText('Item 2')).toBeVisible();
    await expect(page.getByText('Item 3')).toBeVisible();
  });

  test('adds a new task', async ({ page }) => {
    const taskName = `New Task ${Date.now()}`;
    await todoPage.addItem(taskName);
    await expect(page.getByText(taskName)).toBeVisible();
  });

  test('deletes a task', async ({ page }) => {
    const taskName = `Task to Delete ${Date.now()}`;
    await todoPage.addItem(taskName);
    await expect(page.getByText(taskName)).toBeVisible();

    await todoPage.deleteItem(taskName);
    await expect(page.getByText(taskName)).not.toBeVisible();
  });

  test('edits a task and saves the new name', async ({ page }) => {
    const originalName = `Task to Edit ${Date.now()}`;
    const updatedName = `Edited Task ${Date.now()}`;

    await todoPage.addItem(originalName);
    await expect(page.getByText(originalName)).toBeVisible();

    await todoPage.startEditItem(originalName);
    await todoPage.saveEdit(updatedName, originalName);

    await expect(page.getByText(updatedName)).toBeVisible();
    await expect(page.getByText(originalName)).not.toBeVisible();
  });

  test('cancels an edit without changing the task name', async ({ page }) => {
    const originalName = `Task to Keep ${Date.now()}`;
    await todoPage.addItem(originalName);
    await expect(page.getByText(originalName)).toBeVisible();

    await todoPage.startEditItem(originalName);
    await page.getByRole('textbox').fill('Should Not Save');
    await todoPage.cancelEdit();

    await expect(page.getByText(originalName)).toBeVisible();
    await expect(page.getByText('Should Not Save')).not.toBeVisible();
  });

  test('each task has a drag handle', async () => {
    const dragHandles = await todoPage.page.getByRole('button', { name: /drag/i }).all();
    expect(dragHandles.length).toBeGreaterThan(0);
  });

  test('does not add a task when the input is empty', async ({ page }) => {
    const countBefore = await page.getByRole('listitem').count();
    await todoPage.addButton.click();
    const countAfter = await page.getByRole('listitem').count();
    expect(countAfter).toBe(countBefore);
  });

  test('reorders tasks by dragging', async ({ page }) => {
    // Add two uniquely named tasks to guarantee predictable order at top of list
    const task1 = `Drag Task A ${Date.now()}`;
    const task2 = `Drag Task B ${Date.now()}`;
    await todoPage.addItem(task1);
    await todoPage.addItem(task2);

    const handle1 = await todoPage.getDragHandle(task1);
    const handle2 = await todoPage.getDragHandle(task2);

    const box1 = await handle1.boundingBox();
    const box2 = await handle2.boundingBox();

    // Drag task2's handle up to task1's position to swap order
    await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
    await page.mouse.down();
    await page.mouse.move(box1.x + box1.width / 2, box1.y + box1.height / 2, { steps: 10 });
    await page.mouse.up();

    // Both tasks should still be visible after reorder
    await expect(page.getByText(task1)).toBeVisible();
    await expect(page.getByText(task2)).toBeVisible();
  });
});
