import { SetupContext } from "@vue/composition-api";

const showFeedback = (
    context: SetupContext,
    message: string,
    cssClass: string,
    level: string
): void =>
    context.root.$bvToast.toast(message, {
        variant: level,
        noCloseButton: true,
        solid: true,
        toastClass: cssClass,
    });

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

export const showSuccess = (
    context: SetupContext,
    message: string,
    cssClass: string
): void => showFeedback(context, message, cssClass, "success");
