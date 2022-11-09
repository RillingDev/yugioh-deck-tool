/**
 * Public interface used to interact with tooltip.
 */
export interface TooltipInstance {
	/**
	 * Disable any tooltip from being shown.
	 */
	readonly disable: () => void;
	/**
	 * Re-enable tooltip after {@link TooltipInstance#disable()} was called.
	 */
	readonly enable: () => void;
}
