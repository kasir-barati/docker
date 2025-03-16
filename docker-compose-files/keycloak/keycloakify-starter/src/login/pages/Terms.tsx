// ejected using 'npx eject-keycloak-page'
import { useRerenderOnStateChange } from 'evt/hooks';
import { evtTermMarkdown } from 'keycloakify/login/lib/useDownloadTerms';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { Markdown } from 'keycloakify/tools/Markdown';
import type { I18n } from '../i18n';
import type { KcContext } from '../kcContext';

export default function Terms(
    props: PageProps<
        Extract<KcContext, { pageId: 'terms.ftl' }>,
        I18n
    >,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } =
        props;
    const { msg, msgStr } = i18n;
    const { url } = kcContext;

    useRerenderOnStateChange(evtTermMarkdown);

    if (evtTermMarkdown.state === undefined) {
        return null;
    }

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayMessage={false}
            headerNode={msg('termsTitle')}
        >
            <div id="kc-terms-text">
                {evtTermMarkdown.state && (
                    <Markdown>{evtTermMarkdown.state}</Markdown>
                )}
            </div>
            <form
                className="form-actions"
                action={url.loginAction}
                method="POST"
            >
                <input
                    name="accept"
                    id="kc-accept"
                    type="submit"
                    value={msgStr('doAccept')}
                />
                <input
                    name="cancel"
                    id="kc-decline"
                    type="submit"
                    value={msgStr('doDecline')}
                />
            </form>
            <div className="clearfix" />
        </Template>
    );
}
