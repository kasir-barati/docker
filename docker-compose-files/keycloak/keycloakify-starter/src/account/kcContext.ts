import { getKcContext } from 'keycloakify/account';

export const { kcContext } = getKcContext();

export type KcContext = NonNullable<typeof kcContext>;
