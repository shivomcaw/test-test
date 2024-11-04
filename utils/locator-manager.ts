import { Page, Locator } from "@playwright/test";
import { ElementFinder } from "./element-finder/element-finder";
import { LocatorStorage } from "./storage/locator-storage";
import { LocatorOptions } from "./types/element-info";

export class LocatorManager {
  private page: Page;
  private elementFinder: ElementFinder;
  private storage: LocatorStorage;

  constructor(page: Page) {
    this.page = page;
    this.elementFinder = new ElementFinder(page);
    this.storage = new LocatorStorage();
  }

  private async findBestMatch(
    query: string,
    elements: Array<{ text: string; selector: string }>
  ) {
    // TODO: Replace with actual similarity matching using transformers
    const match = elements.find(
      ({ text }) =>
        text.toLowerCase() === query.toLowerCase() ||
        text.toLowerCase().includes(query.toLowerCase())
    );

    if (!match) {
      throw new Error(`No matching element found for: ${query}`);
    }

    return match.selector;
  }

  async getLocator(
    textContent: string,
    options: LocatorOptions = { interactive: true }
  ): Promise<Locator> {
    await this.storage.init();

    const key = textContent.toLowerCase();
    let locatorConfig = this.storage.get(key);

    if (!locatorConfig) {
      const elements = options.interactive
        ? await this.elementFinder.findInteractiveElements()
        : await this.elementFinder.findNonInteractiveElements();

      const bestSelector = await this.findBestMatch(textContent, elements);

      locatorConfig = { selector: bestSelector };
      this.storage.set(key, locatorConfig);
      await this.storage.save();
    }

    try {
      const locator = eval(`this.page.${locatorConfig.selector}`);
      const isVisible = await locator.isVisible();

      if (!isVisible) {
        this.storage.delete(key);
        return this.getLocator(textContent, options);
      }

      return locator;
    } catch (error) {
      this.storage.delete(key);
      return this.getLocator(textContent, options);
    }
  }
}
