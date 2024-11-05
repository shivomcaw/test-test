import { Page, Locator } from "@playwright/test";
import { ElementFinder } from "./element-finder/element-finder";
import { LocatorStorage } from "./storage/locator-storage";
import { ElementInfo, LocatorOptions } from "./types/element-info";
import { findMostSimilarElementHandle } from "./cosine-similarity";

export class LocatorManager {
  private page: Page;
  private elementFinder: ElementFinder;
  private storage: LocatorStorage;

  constructor(page: Page) {
    this.page = page;
    this.elementFinder = new ElementFinder(page);
    this.storage = new LocatorStorage();
  }

  private async findBestMatch(query: string, elements: ElementInfo[]) {
    return (await findMostSimilarElementHandle(query, elements)).element
      .selector;
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
