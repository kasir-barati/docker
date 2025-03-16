import { PropsWithChildren } from 'react';

export function Exclude({
    condition,
    children,
}: PropsWithChildren<{ condition: boolean }>) {
    return condition ? <></> : <>{children}</>;
}
