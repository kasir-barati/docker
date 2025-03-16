import Fallback from 'keycloakify/login';
import { lazy, Suspense } from 'react';
import { useI18n } from './i18n';
import './KcApp.css';
import type { KcContext } from './kcContext';

const Template = lazy(() => import('./Template'));
const DefaultTemplate = lazy(
    () => import('keycloakify/login/Template'),
);
const Login = lazy(() => import('./pages/Login'));
const RegisterUserProfile = lazy(
    () => import('./pages/RegisterUserProfile'),
);
const Terms = lazy(() => import('./pages/Terms'));
const Info = lazy(() => import('keycloakify/login/pages/Info'));

// renders different pages of a Keycloak theme depending on the kcContext prop passed to it.
export default function App(props: { kcContext: KcContext }) {
    const { kcContext } = props;
    const i18n = useI18n({ kcContext });

    if (i18n === null) {
        //NOTE: Locales not yet downloaded, we could as well display a loading progress but it's usually a matter of milliseconds.
        return null;
    }

    /*
     * Examples assuming i18n.currentLanguageTag === "en":
     * i18n.msg("access-denied") === <span>Access denied</span>
     * i18n.msg("foo") === <span>foo in English</span>
     */

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case 'login.ftl':
                        return (
                            <>
                                <Login
                                    kcContext={kcContext}
                                    i18n={i18n}
                                    Template={Template}
                                    doUseDefaultCss={false}
                                />
                            </>
                        );
                    case 'register-user-profile.ftl':
                        return (
                            <>
                                <RegisterUserProfile
                                    kcContext={kcContext}
                                    i18n={i18n}
                                    Template={Template}
                                    doUseDefaultCss={false}
                                />
                            </>
                        );
                    case 'terms.ftl':
                        return (
                            <Terms
                                kcContext={kcContext}
                                i18n={i18n}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    // We choose to use the default Template for the Info page and to download the theme resources.
                    case 'info.ftl':
                        return (
                            <Info
                                kcContext={kcContext}
                                i18n={i18n}
                                Template={DefaultTemplate}
                                doUseDefaultCss={false}
                            />
                        );
                    default:
                        // In the context of keycloakify, the Fallback component is used to render a generic error message when a user navigates to an unknown or unsupported Keycloak login page. It's also used as a fallback component when the Keycloak server is down or unreachable.
                        return (
                            <Fallback
                                kcContext={kcContext}
                                i18n={i18n}
                                Template={DefaultTemplate}
                                doUseDefaultCss={false}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}
