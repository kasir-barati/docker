import { FormHelperText, useFormControl } from '@mui/material';
import React, { PropsWithChildren } from 'react';

export function MyFormHelperText({
    errorMessage,
    defaultMessage,
}: PropsWithChildren<{
    errorMessage: string;
    defaultMessage: string;
}>) {
    const { error } = useFormControl() || {};

    const helperText = React.useMemo(() => {
        if (error) {
            return errorMessage;
        }

        return defaultMessage;
    }, [error]);

    return <FormHelperText>{helperText}</FormHelperText>;
}
