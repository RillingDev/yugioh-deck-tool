import type { BvToast } from "bootstrap-vue";
import { getCurrentInstance } from "vue";

// https://github.com/bootstrap-vue/bootstrap-vue/issues/7005#issuecomment-1245836595
export const useToast = (): BvToast => {
	const app = getCurrentInstance();

	if (!app) {
		throw new TypeError("Could not find app.");
	}
	// @ts-ignore FIXME after vue 3 migration
	return app.proxy.$root.$bvToast;
};

const showToast = (
	$bvToast: BvToast,
	message: string,
	cssClass: string,
	variant: Variant,
): void => {
	$bvToast.toast(message, {
		variant: variant,
		noCloseButton: true,
		solid: true,
		toastClass: cssClass,
	});
};
enum Variant {
	INFO = "info",
	SUCCESS = "success",
	WARNING = "warning",
	DANGER = "danger",
}

export const showInfo = (
	$bvToast: BvToast,
	message: string,
	cssClass: string,
): void => showToast($bvToast, message, cssClass, Variant.INFO);

export const showSuccess = (
	$bvToast: BvToast,
	message: string,
	cssClass: string,
): void => showToast($bvToast, message, cssClass, Variant.SUCCESS);

export const showWarning = (
	$bvToast: BvToast,
	message: string,
	cssClass: string,
): void => showToast($bvToast, message, cssClass, Variant.WARNING);

export const showError = (
	$bvToast: BvToast,
	message: string,
	cssClass: string,
): void => showToast($bvToast, message, cssClass, Variant.DANGER);
