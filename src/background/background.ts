import './browserAction';
import './install-update-events';
import './loadBroadcast';
import './request-provider';
import './setBadgeMessageCount';

/**
 * Отслеживание ошибок в фоновом процессе
 */
if (process.env.NODE_ENV !== 'development') {
    Promise.all([
        import('@sentry/browser'),
    ]).then(([Sentry]) => {

        Sentry.init({
            dsn: process.env.VUE_APP_SENTRY_DSN,
        });

        // @ts-ignore
        self.Sentry = Sentry;
    });
}
