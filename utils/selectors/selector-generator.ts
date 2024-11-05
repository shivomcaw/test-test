import { ElementHandle } from "@playwright/test";

export class SelectorGenerator {
  static async generateSelector(
    element: ElementHandle<HTMLElement>
  ): Promise<string> {
    const elementInfo = await element.evaluate((el) => ({
      tagName: el.tagName.toLowerCase(),
      isHeading: ["h1", "h2", "h3", "h4", "h5", "h6"].includes(
        el.tagName.toLowerCase()
      ),
      role: el.getAttribute("role"),
      text: el.textContent?.trim(),
      id: el.id,
      classes: Array.from(el.classList),
      testId: el.getAttribute("data-testid"),
    }));

    if (elementInfo.testId) {
      return `getByTestId('${elementInfo.testId}')`;
    }

    if (elementInfo.isHeading) {
      return `getByRole('heading', { name: '${elementInfo.text}' })`;
    }

    if (elementInfo.role && elementInfo.text) {
      return `getByRole('${elementInfo.role}', { name: '${elementInfo.text}' })`;
    }

    if (elementInfo.text) {
      if (["p", "span", "div"].includes(elementInfo.tagName)) {
        return `getByText('${elementInfo.text}')`;
      }
    }

    if (elementInfo.id) {
      return `locator('#${elementInfo.id}')`;
    }

    return `locator('${elementInfo.tagName}:has-text("${elementInfo.text}")')`;
  }
}
