import { test, expect, type Page } from "@playwright/test";
import { LocatorManager } from "../utils/locator-manager";

class TodoPage {
  private locatorManager: LocatorManager;

  constructor(private page: Page) {
    this.locatorManager = new LocatorManager(page);
  }

  async navigate() {
    await this.page.goto("https://demo.playwright.dev/todomvc");
  }

  async addTodo(text: string) {
    const input = await this.locatorManager.getLocator(
      "What needs to be done?"
    );
    await input.fill(text);
    await input.press("Enter");
  }

  async getTodoItem(text: string) {
    return this.locatorManager.getLocator(text, { interactive: false });
  }

  async toggleTodo(text: string) {
    const todo = await this.getTodoItem(text);
    const checkbox = todo.locator('input[type="checkbox"]');
    await checkbox.click();
  }

  async editTodo(oldText: string, newText: string) {
    const todo = await this.getTodoItem(oldText);
    await todo.dblclick();
    const input = await this.locatorManager.getLocator(".editing input.edit");
    await input.fill(newText);
    await input.press("Enter");
  }

  async getItemsCount() {
    const counter = await this.locatorManager.getLocator("item left", {
      interactive: false,
    });
    const text = (await counter.textContent()) || "0";
    return parseInt(text);
  }

  async filterBy(filter: "All" | "Active" | "Completed") {
    const filterLink = await this.locatorManager.getLocator(filter);
    await filterLink.click();
  }
}

test.describe("Todo MVC Application", () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigate();
  });

  test.describe("New Todo Operations", () => {
    test("can add single todo item", async () => {
      // Act
      await todoPage.addTodo("buy some cheese");

      // Assert
      const todo = await todoPage.getTodoItem("buy some cheese");
      await expect(todo).toBeVisible();
      await expect(await todoPage.getItemsCount()).toBe(1);
    });

    test("can add multiple todo items", async () => {
      // Act
      const items = [
        "buy some cheese",
        "feed the cat",
        "book a doctors appointment",
      ];
      for (const item of items) {
        await todoPage.addTodo(item);
      }

      // Assert
      for (const item of items) {
        const todo = await todoPage.getTodoItem(item);
        await expect(todo).toBeVisible();
      }
      await expect(await todoPage.getItemsCount()).toBe(3);
    });
  });

  test.describe("Todo Item Management", () => {
    test("can mark items as complete", async () => {
      // Arrange
      await todoPage.addTodo("buy some cheese");

      // Act
      await todoPage.toggleTodo("buy some cheese");

      // Assert
      const todo = await todoPage.getTodoItem("buy some cheese");
      await expect(todo).toHaveClass(/completed/);
    });

    test("can edit todo items", async () => {
      // Arrange
      await todoPage.addTodo("buy some cheese");

      // Act
      await todoPage.editTodo("buy some cheese", "buy some milk");

      // Assert
      const newTodo = await todoPage.getTodoItem("buy some milk");
      await expect(newTodo).toBeVisible();
      const oldTodo = await todoPage.getTodoItem("buy some cheese");
      await expect(oldTodo).not.toBeVisible();
    });
  });

  test.describe("Filtering", () => {
    test("filters show correct items", async () => {
      // Arrange
      await todoPage.addTodo("active task");
      await todoPage.addTodo("completed task");
      await todoPage.toggleTodo("completed task");

      // Act & Assert - Active filter
      await todoPage.filterBy("Active");
      await expect(await todoPage.getTodoItem("active task")).toBeVisible();
      await expect(
        await todoPage.getTodoItem("completed task")
      ).not.toBeVisible();

      // Act & Assert - Completed filter
      await todoPage.filterBy("Completed");
      await expect(await todoPage.getTodoItem("completed task")).toBeVisible();
      await expect(await todoPage.getTodoItem("active task")).not.toBeVisible();

      // Act & Assert - All filter
      await todoPage.filterBy("All");
      await expect(await todoPage.getTodoItem("active task")).toBeVisible();
      await expect(await todoPage.getTodoItem("completed task")).toBeVisible();
    });
  });
});
