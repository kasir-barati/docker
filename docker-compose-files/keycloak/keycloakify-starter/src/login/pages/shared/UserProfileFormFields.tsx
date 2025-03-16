import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import type { Attribute } from 'keycloakify/login/kcContext/KcContext';
import { useFormValidation } from 'keycloakify/login/lib/useFormValidation';
import { Fragment, useEffect } from 'react';
import { Exclude } from '../../../components/Exclude';
import { MyFormHelperText } from '../../../components/MyFormHelperText';
import type { I18n } from '../../i18n';

export type UserProfileFormFieldsProps = {
    kcContext: Parameters<typeof useFormValidation>[0]['kcContext'];
    i18n: I18n;
    onIsFormSubmittableValueChange: (
        isFormSubmittable: boolean,
    ) => void;
    BeforeField?: (props: {
        attribute: Attribute;
    }) => JSX.Element | null;
    AfterField?: (props: {
        attribute: Attribute;
    }) => JSX.Element | null;
};

export function UserProfileFormFields(
    props: UserProfileFormFieldsProps,
) {
    const {
        kcContext,
        onIsFormSubmittableValueChange,
        i18n,
        BeforeField,
        AfterField,
    } = props;
    const { advancedMsg, advancedMsgStr } = i18n;
    const {
        formValidationState: {
            fieldStateByAttributeName,
            isFormSubmittable,
        },
        formValidationDispatch,
        attributesWithPassword,
    } = useFormValidation({
        kcContext,
        i18n,
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

    let currentGroup = '';

    return (
        <>
            {attributesWithPassword.map((attribute, i) => {
                const {
                    group = '',
                    groupDisplayHeader = '',
                    groupDisplayDescription = '',
                } = attribute;

                const { value, displayableErrors } =
                    fieldStateByAttributeName[attribute.name];

                return (
                    <Fragment key={i}>
                        <Exclude
                            condition={
                                group !== currentGroup &&
                                (currentGroup = group) !== ''
                            }
                        >
                            <Box>
                                <Box>
                                    <label id={`header-${group}`}>
                                        {advancedMsg(
                                            groupDisplayHeader,
                                        ) || currentGroup}
                                    </label>
                                </Box>
                                <Exclude
                                    condition={
                                        groupDisplayDescription === ''
                                    }
                                >
                                    <Box>
                                        <label
                                            id={`description-${group}`}
                                        >
                                            {advancedMsg(
                                                groupDisplayDescription,
                                            )}
                                        </label>
                                    </Box>
                                </Exclude>
                            </Box>
                        </Exclude>

                        {BeforeField && (
                            <BeforeField attribute={attribute} />
                        )}

                        <Box marginY={3}>
                            <FormControl
                                error={displayableErrors.length !== 0}
                                fullWidth={true}
                            >
                                {(() => {
                                    const { options } =
                                        attribute.validators;
                                    const displayName =
                                        advancedMsgStr(
                                            attribute.displayName ??
                                                '',
                                        );

                                    if (options !== undefined) {
                                        const labelId = `select-${attribute.name}-label`;
                                        return (
                                            <>
                                                <InputLabel
                                                    id={labelId}
                                                >
                                                    {displayName}
                                                </InputLabel>
                                                <Select
                                                    required={
                                                        attribute.required
                                                    }
                                                    labelId={labelId}
                                                    id={
                                                        attribute.name
                                                    }
                                                    name={
                                                        attribute.name
                                                    }
                                                    value={value}
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        formValidationDispatch(
                                                            {
                                                                action: 'update value',
                                                                name: attribute.name,
                                                                newValue:
                                                                    event
                                                                        .target
                                                                        .value,
                                                            },
                                                        )
                                                    }
                                                    onBlur={() =>
                                                        formValidationDispatch(
                                                            {
                                                                action: 'focus lost',
                                                                name: attribute.name,
                                                            },
                                                        )
                                                    }
                                                >
                                                    {options.options.map(
                                                        (option) => (
                                                            <MenuItem
                                                                key={
                                                                    option
                                                                }
                                                                value={
                                                                    option
                                                                }
                                                            >
                                                                {
                                                                    option
                                                                }
                                                            </MenuItem>
                                                        ),
                                                    )}
                                                </Select>
                                            </>
                                        );
                                    }

                                    return (
                                        <TextField
                                            label={displayName}
                                            variant="outlined"
                                            type={(() => {
                                                switch (
                                                    attribute.name
                                                ) {
                                                    case 'email':
                                                        return 'email';
                                                    case 'password-confirm':
                                                    case 'password':
                                                        return 'password';
                                                    default:
                                                        return 'text';
                                                }
                                            })()}
                                            id={attribute.name}
                                            name={attribute.name}
                                            value={value}
                                            required={
                                                attribute.required
                                            }
                                            onChange={(event) =>
                                                formValidationDispatch(
                                                    {
                                                        action: 'update value',
                                                        name: attribute.name,
                                                        newValue:
                                                            event
                                                                .target
                                                                .value,
                                                    },
                                                )
                                            }
                                            onBlur={() =>
                                                formValidationDispatch(
                                                    {
                                                        action: 'focus lost',
                                                        name: attribute.name,
                                                    },
                                                )
                                            }
                                            aria-invalid={
                                                displayableErrors.length !==
                                                0
                                            }
                                            disabled={
                                                attribute.readOnly
                                            }
                                            autoComplete={
                                                attribute.autocomplete
                                            }
                                        />
                                    );
                                })()}

                                <Exclude
                                    condition={
                                        displayableErrors.length === 0
                                    }
                                >
                                    <MyFormHelperText
                                        errorMessage={
                                            displayableErrors[0]
                                                ?.errorMessageStr
                                        }
                                        defaultMessage=""
                                    />
                                </Exclude>
                            </FormControl>
                        </Box>
                        {AfterField && (
                            <AfterField attribute={attribute} />
                        )}
                    </Fragment>
                );
            })}
        </>
    );
}
