import { getCurrentInstance } from "vue";

// https://github.com/bootstrap-vue/bootstrap-vue/issues/7005#issuecomment-1245836595
export const useToast = () => {
	// TODO
};

const showToast = (
	$unknown: unknown,
	message: string,
	cssClass: string,
	variant: Variant,
): void => {
	// TODO
};
enum Variant {
	INFO = "info",
	SUCCESS = "success",
	WARNING = "warning",
	DANGER = "danger",
}

export const showInfo = (
	$unknown: unknown,
	message: string,
	cssClass: string,
): void => showToast($unknown, message, cssClass, Variant.INFO);

export const showSuccess = (
	$unknown: unknown,
	message: string,
	cssClass: string,
): void => showToast($unknown, message, cssClass, Variant.SUCCESS);

export const showWarning = (
	$unknown: unknown,
	message: string,
	cssClass: string,
): void => showToast($unknown, message, cssClass, Variant.WARNING);

export const showError = (
	$unknown: unknown,
	message: string,
	cssClass: string,
): void => showToast($unknown, message, cssClass, Variant.DANGER);
