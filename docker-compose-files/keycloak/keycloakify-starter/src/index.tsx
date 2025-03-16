import { CssBaseline } from '@mui/material';
import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import reportWebVitals from 'reportWebVitals';
import { kcContext as kcAccountThemeContext } from './account/kcContext';
import { kcContext as kcLoginThemeContext } from './login/kcContext';

// lazy-loaded components
const KcLoginThemeApp = lazy(() => import('./login/KcApp'));
const KcAccountThemeApp = lazy(() => import('./account/KcApp'));

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CssBaseline />
        {/* Suspense manages the loading of the lazy-loaded components. */}
        <Suspense>
            {(() => {
                if (kcLoginThemeContext !== undefined) {
                    return (
                        <KcLoginThemeApp
                            kcContext={kcLoginThemeContext}
                        />
                    );
                }

                if (kcAccountThemeContext !== undefined) {
                    return (
                        <KcAccountThemeApp
                            kcContext={kcAccountThemeContext}
                        />
                    );
                }

                throw new Error(
                    'This app is a Keycloak theme' +
                        "It isn't meant to be deployed outside of Keycloak",
                );
            })()}
        </Suspense>
    </StrictMode>,
);

// report performance metrics for the app.
reportWebVitals();
