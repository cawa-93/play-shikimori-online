import {push as message} from '@/helpers';
import {ShikimoriProvider} from '@/helpers/API/ShikimoriProvider';
import {PermissionError} from '@/helpers/errors/PermissionError.class';

export async function loadRuntimeMessages(minTimestamp: number, broadcastType = 'broadcast', maxLoadedMessages = 10) {
    const commentWithMessages = [];
    let page = 1;
    let lastCommentTimestamp = Date.now();
    try {
        while (minTimestamp <= lastCommentTimestamp && commentWithMessages.length < maxLoadedMessages) {
            const comments =
                await ShikimoriProvider
                    .fetch<shikimori.Comment[]>(
                        // tslint:disable-next-line:max-line-length
                        `/api/comments/?desc=1&commentable_id=285393&commentable_type=Topic&limit=100&page=${page++}`,
                        {errorMessage: 'Невозможно загрузить уведомления'},
                    );

            if (!comments.length) {
                break;
            }

            lastCommentTimestamp = new Date(comments[comments.length - 1].created_at).getTime();

            commentWithMessages.push(
                ...comments
                    .filter((comment: any) =>
                        comment.user.id === 143570
                        && new RegExp(`\\[div=runtime-message-${broadcastType} hidden\\]`, 'mi').test(comment.body)
                        && new Date(comment.created_at).getTime() >= minTimestamp,
                    ),
            );

        }
    } catch (e) {
        // @ts-ignore
        if (!e instanceof PermissionError) {
            console.error(e);
        }
    }

    if (commentWithMessages.length) {
        for (const comment of commentWithMessages) {
            if (!comment || !comment.body) {
                continue;
            }
            try {
                const runtimeMessage = JSON.parse(
                    // @ts-ignore
                    comment.body
                        .replace(/\n+/gim, '<br>')
                        .match(
                            new RegExp(
                                `\\[div=runtime-message-${broadcastType} hidden\\](.+?)\\[\\/div\\]`,
                                'im',
                            ),
                        )[1],
                    )
                ;

                runtimeMessage.id = comment.id;

                if (!runtimeMessage.link) {
                    runtimeMessage.link = `https://shikimori.one/comments/${comment.id}`;
                }

                if (!runtimeMessage.html) {
                    const rows = [];

                    if (runtimeMessage.text) {
                        rows.push(runtimeMessage.text);
                    }
                    if (runtimeMessage.linkText) {
                        rows.push(
                            `<b>
                                <a class="white--text" href="${runtimeMessage.link}">
                                    ${runtimeMessage.linkText}
                                </a>
                            </b>`,
                        );
                    }

                    runtimeMessage.html = rows.join('<br>');
                }

                message(runtimeMessage);
            } catch (e) {
                console.error(`Can't show broadcast message`, {error: e, comment});
                // Sentry.captureException(e);
            }
        }
    }
}
