// ejected using 'npx eject-keycloak-page'
import { Box, Button, Stack } from '@mui/material';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useState } from 'react';
import type { I18n } from '../i18n';
import type { KcContext } from '../kcContext';
import { UserProfileFormFields } from './shared/UserProfileFormFields';

export default function RegisterUserProfile(
    props: PageProps<
        Extract<KcContext, { pageId: 'register-user-profile.ftl' }>,
        I18n
    >,
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } =
        props;
    const {
        url,
        messagesPerField,
        recaptchaRequired,
        recaptchaSiteKey,
    } = kcContext;

    const { msg, msgStr } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayMessage={messagesPerField.exists('global')}
            displayRequiredFields={true}
            headerNode={msg('registerTitle')}
        >
            <Box
                component="form"
                id="kc-register-form"
                action={url.registrationAction}
                method="post"
            >
                <UserProfileFormFields
                    kcContext={kcContext}
                    onIsFormSubmittableValueChange={
                        setIsFormSubmittable
                    }
                    i18n={i18n}
                />
                {recaptchaRequired && (
                    <Box>
                        <Box>
                            <Box
                                data-size="compact"
                                data-sitekey={recaptchaSiteKey}
                            />
                        </Box>
                    </Box>
                )}
                <Box marginY={3}>
                    <Stack direction="row" spacing={2}>
                        <Box id="kc-form-options">
                            <Button
                                variant="outlined"
                                color="primary"
                                href={url.loginUrl}
                            >
                                {msg('backToLogin')}
                            </Button>
                        </Box>

                        <Box id="kc-form-buttons">
                            <Button
                                variant="contained"
                                color="success"
                                type="submit"
                                disabled={!isFormSubmittable}
                            >
                                {msgStr('doRegister')}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Template>
    );
}
