import { Page, ElementHandle } from "@playwright/test";
import { ElementInfo } from "../types/element-info";
import { SelectorGenerator } from "../selectors/selector-generator";

export class ElementFinder {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async findInteractiveElements(): Promise<ElementInfo[]> {
    const elements = await this.page.$$(`
            a, 
            button, 
            input, 
            [role="button"], 
            [role="link"],
            [role="tab"],
            [role="menuitem"]
        `);

    return this.getElementDetails(elements as ElementInfo["element"][]);
  }

  async findNonInteractiveElements(): Promise<ElementInfo[]> {
    const elements = await this.page.$$(`
            h1, h2, h3, h4, h5, h6,
            p,
            span,
            div:not(:empty),
            [role="heading"],
            [role="article"],
            [role="contentinfo"],
            label,
            li
        `);

    return this.getElementDetails(elements as ElementInfo["element"][]);
  }

  private async getElementDetails(
    elements: ElementHandle<HTMLElement>[]
  ): Promise<ElementInfo[]> {
    const elementDetails = await Promise.all(
      elements.map(async (element) => {
        const textContent = (await element.textContent()) || "";
        const ariaLabel = (await element.getAttribute("aria-label")) || "";
        const value = (await element.getAttribute("value")) || "";
        const placeholder = (await element.getAttribute("placeholder")) || "";

        const text = [textContent, ariaLabel, value, placeholder]
          .filter(Boolean)
          .join(" ")
          .trim();

        const selector = await SelectorGenerator.generateSelector(element);

        return { element, text: textContent, selector };
      })
    );

    return await Promise.all(
      elementDetails.filter(async ({ element, text }) => {
        if (!text) return false;
        const isVisible = await element.isVisible();
        return isVisible;
      })
    );
  }
}
