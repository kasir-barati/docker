import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Link,
    Stack,
    TextField,
} from '@mui/material';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useConstCallback } from 'keycloakify/tools/useConstCallback';
import { useState, type FormEventHandler } from 'react';
import type { I18n } from '../i18n';
import type { KcContext } from '../kcContext';

export default function Login(
    // a PageProps object that has some fields specific to the "login.ftl" page in Keycloak.
    props: PageProps<
        Extract<KcContext, { pageId: 'login.ftl' }>,
        I18n
    >,
) {
    // Extract some data from kcContext and i18n objects that are passed in through props
    const { kcContext, i18n, Template, doUseDefaultCss } = props;
    const {
        social,
        realm,
        url,
        usernameEditDisabled,
        login,
        auth,
        registrationDisabled,
    } = kcContext;
    const { msg, msgStr } = i18n;
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] =
        useState(false);
    const onSubmit = useConstCallback<
        FormEventHandler<HTMLFormElement>
    >((e) => {
        e.preventDefault();

        setIsLoginButtonDisabled(true);

        const formElement = e.target as HTMLFormElement;

        //NOTE: Even if we login with email Keycloak expect username and password in
        //the POST request.
        formElement
            .querySelector("input[name='email']")
            ?.setAttribute('name', 'username');

        formElement.submit();
    });

    return (
        <Template
            doUseDefaultCss={doUseDefaultCss}
            kcContext={kcContext}
            i18n={i18n}
            displayInfo={social.displayInfo}
            displayWide={
                realm.password && social.providers !== undefined
            }
            headerNode={msg('loginWelcomeMessage')}
            infoNode={
                realm.password &&
                realm.registrationAllowed &&
                !registrationDisabled && (
                    <Box id="kc-registration" marginY={1}>
                        {msg('noAccount')}&nbsp;
                        <Link
                            underline="none"
                            tabIndex={6}
                            href={url.registrationUrl}
                        >
                            {msg('doRegister')}
                        </Link>
                    </Box>
                )
            }
        >
            <Box id="kc-form" textAlign="center">
                <Box id="kc-form-wrapper">
                    {realm.password && (
                        <Box
                            component="form"
                            textAlign="left"
                            autoComplete="off"
                            id="kc-form-login"
                            onSubmit={onSubmit}
                            action={url.loginAction}
                            method="post"
                            sx={{
                                '& > *': { marginBottom: '1rem' },
                            }}
                        >
                            <FormControl
                                focused={true}
                                fullWidth={true}
                            >
                                {(() => {
                                    const label =
                                        !realm.loginWithEmailAllowed
                                            ? 'username'
                                            : realm.registrationEmailAsUsername
                                            ? 'email'
                                            : 'usernameOrEmail';

                                    const autoCompleteHelper: typeof label =
                                        label === 'usernameOrEmail'
                                            ? 'username'
                                            : label;

                                    return (
                                        <>
                                            <TextField
                                                label={msg(label)}
                                                variant="outlined"
                                                tabIndex={1}
                                                id={
                                                    autoCompleteHelper
                                                }
                                                //NOTE: This is used by Google Chrome auto fill so we use it to tell
                                                //the browser how to pre fill the form but before submit we put it back
                                                //to username because it is what keycloak expects.
                                                name={
                                                    autoCompleteHelper
                                                }
                                                defaultValue={
                                                    login.username ??
                                                    ''
                                                }
                                                {...(usernameEditDisabled
                                                    ? {
                                                          disabled:
                                                              true,
                                                      }
                                                    : {
                                                          autoFocus:
                                                              true,
                                                          autoComplete:
                                                              'off',
                                                      })}
                                            />
                                            <FormHelperText>
                                                Please enter
                                                your&nbsp;
                                                {msg(label)}.
                                            </FormHelperText>
                                        </>
                                    );
                                })()}
                            </FormControl>
                            <FormControl fullWidth={true}>
                                <TextField
                                    tabIndex={2}
                                    label={msg('password')}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                />
                                <FormHelperText>
                                    Please enter your&nbsp;
                                    {msg('password')}.
                                </FormHelperText>
                            </FormControl>
                            <FormControl fullWidth={true}>
                                <FormGroup id="kc-form-options">
                                    {realm.rememberMe &&
                                        !usernameEditDisabled && (
                                            <FormControlLabel
                                                label={msg(
                                                    'rememberMe',
                                                )}
                                                control={
                                                    <Checkbox
                                                        tabIndex={3}
                                                        id="rememberMe"
                                                        name="rememberMe"
                                                        checked={Boolean(
                                                            login.rememberMe,
                                                        )}
                                                    />
                                                }
                                            ></FormControlLabel>
                                        )}
                                </FormGroup>
                            </FormControl>
                            <FormControl
                                fullWidth={true}
                                sx={{ margin: '1rem auto' }}
                                id="kc-form-buttons"
                            >
                                <Stack direction="row" spacing={1}>
                                    <input
                                        type="hidden"
                                        id="id-hidden-input"
                                        name="credentialId"
                                        value={
                                            auth.selectedCredential
                                        }
                                    />
                                    <Button
                                        variant="contained"
                                        color="success"
                                        tabIndex={4}
                                        name="login"
                                        id="kc-login"
                                        type="submit"
                                        disabled={
                                            isLoginButtonDisabled
                                        }
                                    >
                                        {msgStr('doLogIn')}
                                    </Button>
                                    {realm.resetPasswordAllowed && (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            tabIndex={5}
                                            href={
                                                url.loginResetCredentialsUrl
                                            }
                                        >
                                            {msgStr(
                                                'doForgotPassword',
                                            )}
                                        </Button>
                                    )}
                                </Stack>
                            </FormControl>
                        </Box>
                    )}
                </Box>
                {realm.password && social.providers !== undefined && (
                    <Box id="kc-social-providers">
                        <ul>
                            {social.providers.map((p) => (
                                <li key={p.providerId}>
                                    <a
                                        href={p.loginUrl}
                                        id={`zocial-${p.alias}`}
                                    >
                                        <span>{p.displayName}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Box>
                )}
            </Box>
        </Template>
    );
}
