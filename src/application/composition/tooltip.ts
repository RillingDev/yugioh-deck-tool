import { getTooltipApi } from "@/tooltip/lib";

/**
 * Tooltip API wrapped for better usage with composition API.
 *
 * If tooltip is not (yet) initialized, functions are noop.
 */
export const useTooltip: () => {
	enableTooltip: () => void;
	disableTooltip: () => void;
} = () => {
	return {
		/**
		 * @see TooltipInstance#disable
		 */
		disableTooltip: () => getTooltipApi()?.disable(),
		/**
		 * @see TooltipInstance#enable
		 */
		enableTooltip: () => getTooltipApi()?.enable(),
	};
};
