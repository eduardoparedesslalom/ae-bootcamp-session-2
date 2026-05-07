const { expect } = require('@playwright/test');

class TodoPage {
  constructor(page) {
    this.page = page;
    this.newItemInput = page.getByPlaceholder('Enter item name');
    this.addButton = page.getByRole('button', { name: /add item/i });
    this.itemsList = page.getByRole('list');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForItemsLoaded() {
    await expect(this.page.getByRole('progressbar')).not.toBeVisible({ timeout: 10000 });
  }

  async addItem(name) {
    await this.newItemInput.fill(name);
    await this.addButton.click();
    await this.page.waitForResponse((res) => res.url().includes('/api/items') && res.request().method() === 'POST');
  }

  async getItemByName(name) {
    return this.page.getByRole('listitem').filter({ hasText: name });
  }

  async deleteItem(name) {
    const item = await this.getItemByName(name);
    await item.getByRole('button', { name: new RegExp(`delete ${name}`, 'i') }).click();
    await this.page.waitForResponse((res) => res.url().includes('/api/items') && res.request().method() === 'DELETE');
  }

  async startEditItem(name) {
    const item = await this.getItemByName(name);
    await item.getByRole('button', { name: new RegExp(`edit ${name}`, 'i') }).click();
  }

  async saveEdit(newName, currentName) {
    await this.page.getByRole('textbox').filter({ hasValue: currentName }).fill(newName);
    await this.page.getByRole('button', { name: /save/i }).click();
    await this.page.waitForResponse((res) => res.url().includes('/api/items') && res.request().method() === 'PUT');
  }

  async cancelEdit() {
    await this.page.getByRole('button', { name: /cancel/i }).click();
  }

  async getDragHandle(name) {
    const item = await this.getItemByName(name);
    return item.getByRole('button', { name: new RegExp(`drag ${name}`, 'i') });
  }

  async getItemNames() {
    const items = await this.page.getByRole('listitem').all();
    const names = [];
    for (const item of items) {
      const text = await item.getByRole('button', { name: /drag/i }).getAttribute('aria-label');
      if (text) names.push(text.replace(/^drag /i, ''));
    }
    return names;
  }
}

module.exports = { TodoPage };
