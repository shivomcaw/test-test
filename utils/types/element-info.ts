import { ElementHandle } from "@playwright/test";

export interface ElementInfo {
  element: ElementHandle<HTMLElement>;
  text: string;
  selector: string;
}

export interface LocatorConfig {
  selector: string;
}

export interface LocatorOptions {
  interactive?: boolean;
}
