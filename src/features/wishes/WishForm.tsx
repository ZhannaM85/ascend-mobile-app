import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, HelperText, Text, TextInput } from 'react-native-paper';

export type WishFormValue = {
    title: string;
    description: string;
    commitmentTitle: string;
    durationDays: string;
    commitmentStartDateIso: string;
};

export type WishFormProps = {
    initialValue?: Partial<WishFormValue>;
    submitLabel: string;
    onSubmit: (value: WishFormValue) => void;
    onCancel?: () => void;
};

function isValidIsoDate(value: string): boolean {
    if (!value) {
        return true;
    }
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function WishForm(props: WishFormProps) {
    const initial = useMemo<WishFormValue>(
        () => ({
            title: props.initialValue?.title ?? '',
            description: props.initialValue?.description ?? '',
            commitmentTitle: props.initialValue?.commitmentTitle ?? '',
            durationDays: props.initialValue?.durationDays ?? '',
            commitmentStartDateIso: props.initialValue?.commitmentStartDateIso ?? '',
        }),
        [props.initialValue]
    );

    const [value, setValue] = useState<WishFormValue>(initial);
    const [touchedTitle, setTouchedTitle] = useState(false);

    const titleError = touchedTitle && value.title.trim().length === 0;
    const durationNumber = value.durationDays.trim() ? Number(value.durationDays) : undefined;
    const durationInvalid =
        value.durationDays.trim().length > 0 &&
        (!Number.isFinite(durationNumber) || durationNumber < 1 || durationNumber > 365);

    const startDateInvalid = !isValidIsoDate(value.commitmentStartDateIso.trim());

    const canSubmit =
        value.title.trim().length > 0 && !durationInvalid && !startDateInvalid;

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <TextInput
                    mode="outlined"
                    label="Wish title"
                    value={value.title}
                    onChangeText={(text) =>
                        setValue((prev) => ({
                            ...prev,
                            title: text,
                        }))
                    }
                    onBlur={() => setTouchedTitle(true)}
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    error={titleError}
                />
                <HelperText type="error" visible={titleError}>
                    Title is required.
                </HelperText>

                <TextInput
                    mode="outlined"
                    label="Description (optional)"
                    value={value.description}
                    onChangeText={(text) =>
                        setValue((prev) => ({
                            ...prev,
                            description: text,
                        }))
                    }
                    multiline
                    numberOfLines={3}
                />

                <Divider style={styles.divider} />

                <Text variant="titleMedium">Commitment</Text>
                <Text variant="bodySmall" style={styles.muted}>
                    Optional: define what you’ll do and for how long.
                </Text>

                <View style={styles.gap} />

                <TextInput
                    mode="outlined"
                    label="Commitment title (optional)"
                    value={value.commitmentTitle}
                    onChangeText={(text) =>
                        setValue((prev) => ({
                            ...prev,
                            commitmentTitle: text,
                        }))
                    }
                    autoCapitalize="sentences"
                />

                <TextInput
                    mode="outlined"
                    label="Duration (days)"
                    value={value.durationDays}
                    onChangeText={(text) =>
                        setValue((prev) => ({
                            ...prev,
                            durationDays: text.replace(/[^\d]/g, ''),
                        }))
                    }
                    keyboardType="number-pad"
                    error={durationInvalid}
                />
                <HelperText type="error" visible={durationInvalid}>
                    Duration must be between 1 and 365.
                </HelperText>

                <TextInput
                    mode="outlined"
                    label="Start date (YYYY-MM-DD)"
                    value={value.commitmentStartDateIso}
                    onChangeText={(text) =>
                        setValue((prev) => ({
                            ...prev,
                            commitmentStartDateIso: text,
                        }))
                    }
                    placeholder="2026-03-17"
                    autoCapitalize="none"
                    error={startDateInvalid}
                />
                <HelperText type="error" visible={startDateInvalid}>
                    Use YYYY-MM-DD format.
                </HelperText>

                <View style={styles.actions}>
                    {props.onCancel ? (
                        <Button mode="text" onPress={props.onCancel}>
                            Cancel
                        </Button>
                    ) : null}
                    <Button
                        mode="contained"
                        onPress={() => props.onSubmit(value)}
                        disabled={!canSubmit}
                    >
                        {props.submitLabel}
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 12,
    },
    divider: {
        marginVertical: 8,
    },
    muted: {
        opacity: 0.7,
    },
    gap: {
        height: 4,
    },
    actions: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8,
    },
});

