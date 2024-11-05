# Playwright Test Template

## Overview
This document provides instructions for writing Playwright tests using the `LocatorManager` pattern for element access, following best practices and promoting reusable components.

## Test Structure

### 1. Import Statements
```typescript
import { test, expect } from '@playwright/test';
import { LocatorManager } from '../utils/locator-manager';
```

### 2. Page Object Model
```typescript
class BasePage {
  protected locatorManager: LocatorManager;

  constructor(page: Page) {
    this.locatorManager = new LocatorManager(page);
  }
}

class ExamplePage extends BasePage {
  async navigate() {
    await this.page.goto('https://example.com');
  }

  async clickButton(text: string) {
    const button = await this.locatorManager.getLocator(text);
    await button.click();
  }

  async getHeading(text: string) {
    return this.locatorManager.getLocator(text, { interactive: false });
  }
}
```

### 3. Test Data
```typescript
interface TestData {
  readonly buttonText: string;
  readonly expectedHeading: string;
}

const TEST_DATA: TestData = {
  buttonText: 'Get started',
  expectedHeading: 'Installation'
} as const;
```

### 4. Test Cases
```typescript
test.describe('Feature Name', () => {
  let page: ExamplePage;

  test.beforeEach(async ({ page }) => {
    page = new ExamplePage(page);
    await page.navigate();
  });

  /**
   * INSERT TEST CASES HERE
   * Example structure following your pattern:
   */
  test('should navigate to installation page when clicking get started', async () => {
    // Arrange
    // No additional arrangement needed as setup is handled in beforeEach

    // Act
    await page.clickButton(TEST_DATA.buttonText);

    // Assert
    const heading = await page.getHeading(TEST_DATA.expectedHeading);
    await expect(heading).toBeVisible();
  });
});
```

## Best Practices

### 1. Element Location Using LocatorManager
```typescript
// Interactive elements (buttons, links, inputs)
const button = await locatorManager.getLocator("Submit");
const link = await locatorManager.getLocator("Learn more");

// Non-interactive elements (headings, text, labels)
const heading = await locatorManager.getLocator("Welcome", { interactive: false });
const message = await locatorManager.getLocator("Success", { interactive: false });
```

### 2. Waiting Strategies
```typescript
async function waitForElement(text: string, options = { interactive: true }) {
  const element = await locatorManager.getLocator(text, options);
  await element.waitFor({ state: 'visible' });
  return element;
}
```

### 3. Common Actions
```typescript
class TestActions {
  constructor(private locatorManager: LocatorManager) {}

  async clickAndVerify(buttonText: string, expectedHeadingText: string) {
    const button = await this.locatorManager.getLocator(buttonText);
    await button.click();

    const heading = await this.locatorManager.getLocator(expectedHeadingText, {
      interactive: false,
    });
    await expect(heading).toBeVisible();
  }
}
```

## Example Implementation

```typescript
test.describe('Navigation Tests', () => {
  let locatorManager: LocatorManager;
  let actions: TestActions;

  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
    locatorManager = new LocatorManager(page);
    actions = new TestActions(locatorManager);
  });

  test('navigation to installation page', async () => {
    await actions.clickAndVerify('Get started', 'Installation');
  });

  test('navigation to API section', async () => {
    // Get interactive element
    const apiLink = await locatorManager.getLocator('API');
    await apiLink.click();

    // Verify non-interactive element
    const apiHeading = await locatorManager.getLocator('API Reference', {
      interactive: false,
    });
    await expect(apiHeading).toBeVisible();
  });
});
```

## Test Organization Guidelines

1. Use `LocatorManager` consistently for all element access
2. Distinguish between interactive and non-interactive elements using the `interactive` option
3. Group related interactions into `TestActions` classes
4. Keep page objects focused on page-specific functionality
5. Use descriptive test names that reflect the business value
6. Follow the Arrange-Act-Assert pattern

### Error Handling Example
```typescript
async function safeClick(text: string) {
  try {
    const element = await locatorManager.getLocator(text);
    await element.click();
  } catch (error) {
    throw new Error(`Failed to click element with text "${text}": ${error.message}`);
  }
}
```

### Assertion Patterns
```typescript
// Visibility assertions
await expect(
  locatorManager.getLocator('Success Message', { interactive: false })
).toBeVisible();

// Text content assertions
const element = await locatorManager.getLocator('Status', { interactive: false });
await expect(element).toHaveText('Complete');

// State assertions
const button = await locatorManager.getLocator('Submit');
await expect(button).toBeEnabled();
```

---

**Note**: Replace example URLs, class names, and text values with your actual implementation details. Add test cases following the structure and best practices outlined above.