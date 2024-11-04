import * as fs from "fs/promises";
import * as path from "path";
import { LocatorConfig } from "../types/element-info";

export class LocatorStorage {
  private locatorsPath: string;
  private locators: Record<string, LocatorConfig>;

  constructor() {
    this.locatorsPath = path.join(process.cwd(), "utils", "locators.json");
    this.locators = {};
  }

  async init() {
    try {
      const content = await fs.readFile(this.locatorsPath, "utf-8");
      this.locators = JSON.parse(content);
    } catch (error) {
      await this.save();
    }
  }

  async save() {
    await fs.writeFile(
      this.locatorsPath,
      JSON.stringify(this.locators, null, 2)
    );
  }

  get(key: string): LocatorConfig | undefined {
    return this.locators[key];
  }

  set(key: string, config: LocatorConfig) {
    this.locators[key] = config;
  }

  delete(key: string) {
    delete this.locators[key];
  }
}
