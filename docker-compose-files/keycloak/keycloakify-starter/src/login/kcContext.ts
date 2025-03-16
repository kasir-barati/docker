import { getKcContext } from 'keycloakify/login';

export type KcContextExtension = {
    pageId: 'register-user-profile.ftl';
    /*
        You're theme isn't the source of truth of how your realm and client is configured.
        On the contrary it's to your theme to adapt to how Keycloak is configured.

        Let's say you only want to alow peoples with @mit.edu.com email addresses, you would add a regexp to the email attribute in your Keycloak admin and this email ill be passed over to your theme so we can have realtime frontend validation.
        If you hardcode the regex in your theme the validation would only be client side but an attacker could very well send an handcrafted POST with whatever email and Keycloak would be OK with it.

        User attributes enables you to have only one source of truth: the Keycloak configuration.

        You are of course free to configure your attribute using the JSON editor.
        This can be easily dumped and restored.
     */
    register: {
        formData: { location: string; occupation: string };
    };
};

/**
    The KcContext type is a generic type that can take an extension parameter to add additional properties to the context object.

    KcContext represents the runtime configuration for the Keycloak server, which is passed to the Keycloak login page and used to customize the login experience.

    The kcContext object is a part of the Keycloak JavaScript adapter, and it is created by calling getKcContext() method provided by keycloakify. It contains various properties and methods that allow the customization of the login page, such as the ability to customize the look and feel, add custom JavaScript code, and customize the behavior of the login page.

    In summary, KcContext is a runtime configuration object that provides customization options for the Keycloak login page.
 */
export const { kcContext } = getKcContext<KcContextExtension>();

export type KcContext = NonNullable<typeof kcContext>;
