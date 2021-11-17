import cogoToast from 'cogo-toast';

export class Notification {
    public static success = (message: string) => {
        cogoToast.success(message);
    };
}
