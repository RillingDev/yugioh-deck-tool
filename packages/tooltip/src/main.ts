import "reflect-metadata";
import { bindTooltipApi } from "./api";
import "./styles/tooltip.scss";

document.addEventListener("DOMContentLoaded", () => bindTooltipApi());

export { getTooltipApi } from "./api";
export type { TooltipInstance } from "./api";
