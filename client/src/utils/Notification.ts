import cogoToast, { CTReturn } from 'cogo-toast';

export class Notification {
    public static lifespan: number = 4;

    public static success = (message: string) => {
        cogoToast.success(message, { hideAfter: this.lifespan });
    };
    public static error = (message: string) => {
        cogoToast.error(message, { hideAfter: this.lifespan });
    };
    public static info = (message: string) => {
        cogoToast.info(message, { hideAfter: this.lifespan });
    };
    public static warn = (message: string) => {
        cogoToast.warn(message, { hideAfter: this.lifespan });
    };
    public static loading = (loadingMessage: string): CTReturn => {
        return cogoToast.loading(loadingMessage, { hideAfter: 0 });
    };
}
