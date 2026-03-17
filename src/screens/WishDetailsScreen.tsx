import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, ProgressBar, Text, useTheme } from 'react-native-paper';

import type { RootStackParamList } from '../navigation/types';
import type { Wish } from '../features/wishes/types';
import {
    computeCommitmentProgress,
    getStartOfDayMs,
    isSameCalendarDay,
} from '../features/wishes/commitmentUtils';

export type WishDetailsScreenProps = NativeStackScreenProps<
    RootStackParamList,
    'WishDetails'
> & {
    wish?: Wish;
    onCheckIn: (wishId: string) => { completed: boolean };
};

function formatStartDate(startDateIso?: string): string {
    if (!startDateIso) return '';
    const d = new Date(startDateIso);
    return d.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function WishDetailsScreen({
    navigation,
    route,
    wish,
    onCheckIn,
}: WishDetailsScreenProps) {
    const { id } = route.params;
    const theme = useTheme();

    if (!wish) {
        return (
            <View style={styles.container}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Wish details" />
                </Appbar.Header>
                <View style={styles.content}>
                    <Text variant="bodyLarge">Wish not found.</Text>
                </View>
            </View>
        );
    }

    const commitment = wish.commitment;
    const progress = commitment
        ? computeCommitmentProgress(commitment)
        : null;

    const todayStart = getStartOfDayMs(Date.now());
    const alreadyCheckedToday =
        commitment?.checkIns?.some((d) => isSameCalendarDay(d, todayStart)) ??
        false;

    const commitmentNotYetStarted =
        commitment?.startDateIso &&
        todayStart < getStartOfDayMs(new Date(commitment.startDateIso).getTime());

    const canCheckIn =
        commitment &&
        !progress?.completed &&
        !commitmentNotYetStarted &&
        !alreadyCheckedToday;

    const handleCheckIn = () => {
        if (canCheckIn) {
            const result = onCheckIn(wish.id);
            if (result.completed) {
                // Could show a completion modal/banner here
            }
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={wish.title} />
                <Appbar.Action
                    icon="pencil"
                    onPress={() => navigation.navigate('EditWish', { id })}
                    accessibilityLabel="Edit wish"
                />
            </Appbar.Header>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
            >
                {wish.imageUri ? (
                    <View style={styles.imageContainer}>
                        <Text variant="bodySmall" style={styles.imagePlaceholder}>
                            Image: {wish.imageUri}
                        </Text>
                    </View>
                ) : null}

                <Text variant="headlineMedium" style={styles.title}>
                    ✨ {wish.title}
                </Text>

                {wish.description ? (
                    <Text variant="bodyMedium" style={styles.description}>
                        {wish.description}
                    </Text>
                ) : null}

                {commitment ? (
                    <View style={styles.commitmentSection}>
                        <Text variant="labelMedium" style={styles.label}>
                            COMMITMENT
                        </Text>
                        <Text variant="titleLarge" style={styles.commitmentTitle}>
                            ✨ {commitment.title}
                        </Text>

                        <View style={styles.progressRow}>
                            <ProgressBar
                                progress={
                                    progress
                                        ? Math.min(
                                              1,
                                              progress.streak /
                                                  commitment.durationDays
                                          )
                                        : 0
                                }
                                color={theme.colors.primary}
                                style={styles.progressBar}
                            />
                        </View>

                        <View style={styles.streakRow}>
                            <Text variant="bodyMedium">
                                🔥 {progress?.streak ?? 0} days
                            </Text>
                        </View>

                        <Text variant="bodySmall" style={styles.muted}>
                            Duration: {commitment.durationDays} days · Started{' '}
                            {formatStartDate(commitment.startDateIso)}
                        </Text>

                        {progress?.completed ? (
                            <View style={styles.statusBadge}>
                                <Text variant="titleMedium" style={styles.finished}>
                                    Finished
                                </Text>
                            </View>
                        ) : (
                            <Text variant="titleMedium" style={styles.statusText}>
                                Day {progress?.currentDay ?? 1} of{' '}
                                {commitment.durationDays}
                            </Text>
                        )}

                        {commitmentNotYetStarted ? (
                            <View style={styles.notStarted}>
                                <Text variant="bodyMedium">
                                    Commitment starts on{' '}
                                    {formatStartDate(commitment.startDateIso)}.
                                    Check in from that day.
                                </Text>
                            </View>
                        ) : progress?.completed ? (
                            <View style={styles.completedBanner}>
                                <Text variant="titleMedium">
                                    🎉 You completed your {commitment.durationDays}
                                    -day commitment!
                                </Text>
                            </View>
                        ) : (
                            <Button
                                mode="contained"
                                onPress={handleCheckIn}
                                disabled={!canCheckIn || alreadyCheckedToday}
                                style={styles.checkInButton}
                            >
                                {alreadyCheckedToday
                                    ? "Today's check-in done ✓"
                                    : 'Check in for today'}
                            </Button>
                        )}
                    </View>
                ) : (
                    <View style={styles.noCommitment}>
                        <Text variant="bodyMedium" style={styles.muted}>
                            No commitment for this wish. Edit the wish to add
                            one.
                        </Text>
                    </View>
                )}

                <Button
                    mode="outlined"
                    onPress={() => navigation.navigate('EditWish', { id })}
                    style={styles.editButton}
                >
                    Edit wish
                </Button>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    content: {
        padding: 16,
    },
    imageContainer: {
        height: 160,
        backgroundColor: '#eef2ff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholder: {
        opacity: 0.7,
    },
    title: {
        marginBottom: 4,
    },
    description: {
        opacity: 0.8,
        marginBottom: 8,
    },
    commitmentSection: {
        padding: 16,
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        gap: 8,
    },
    label: {
        opacity: 0.7,
        letterSpacing: 1,
    },
    commitmentTitle: {
        marginBottom: 4,
    },
    progressRow: {
        marginVertical: 8,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
    },
    streakRow: {
        marginBottom: 4,
    },
    muted: {
        opacity: 0.7,
    },
    statusBadge: {
        marginTop: 8,
    },
    finished: {
        color: '#059669',
        fontWeight: '600',
    },
    statusText: {
        marginTop: 4,
    },
    notStarted: {
        padding: 12,
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        marginTop: 8,
    },
    completedBanner: {
        padding: 16,
        backgroundColor: '#d1fae5',
        borderRadius: 12,
        marginTop: 12,
    },
    checkInButton: {
        marginTop: 12,
    },
    noCommitment: {
        padding: 16,
        backgroundColor: '#f9fafb',
        borderRadius: 12,
    },
    editButton: {
        marginTop: 8,
    },
});
