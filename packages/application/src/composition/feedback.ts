import type { SetupContext } from "@vue/composition-api";

const showFeedback = (
    context: SetupContext,
    message: string,
    cssClass: string,
    variant: string
): void =>
    context.root.$bvToast.toast(message, {
        variant: variant,
        noCloseButton: true,
        solid: true,
        toastClass: cssClass,
    });

export const showInfo = (
    context: SetupContext,
    message: string,
    cssClass: string
): void => showFeedback(context, message, cssClass, "info");

export const showSuccess = (
    context: SetupContext,
    message: string,
    cssClass: string
): void => showFeedback(context, message, cssClass, "success");

export const showWarning = (
    context: SetupContext,
    message: string,
    cssClass: string
): void => showFeedback(context, message, cssClass, "warning");

export const showError = (
    context: SetupContext,
    message: string,
    cssClass: string
): void => showFeedback(context, message, cssClass, "danger");
