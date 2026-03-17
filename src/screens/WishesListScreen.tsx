import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Button, List, Text } from 'react-native-paper';

import type { RootStackParamList } from '../navigation/types';
import type { Wish } from '../features/wishes/types';
import { formatStreakSummary } from '../features/wishes/commitmentUtils';

export type WishesListScreenProps = NativeStackScreenProps<RootStackParamList, 'Wishes'> & {
    wishes: Wish[];
};

export function WishesListScreen({ navigation, wishes }: WishesListScreenProps) {
    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Wishes" />
                <Appbar.Action
                    icon="plus"
                    accessibilityLabel="Create wish"
                    onPress={() => navigation.navigate('CreateWish')}
                />
            </Appbar.Header>

            {wishes.length === 0 ? (
                <View style={styles.empty}>
                    <Text variant="titleMedium">No wishes yet</Text>
                    <Text variant="bodyMedium" style={styles.muted}>
                        Create your first wish to get started.
                    </Text>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('CreateWish')}
                        style={styles.cta}
                    >
                        Create wish
                    </Button>
                </View>
            ) : (
                <FlatList
                    data={wishes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const descParts: string[] = [];
                        if (item.description) descParts.push(item.description);
                        if (item.commitment) {
                            descParts.push(formatStreakSummary(item.commitment));
                        }
                        const description = descParts.join(' · ');
                        return (
                            <List.Item
                                title={item.title}
                                description={description || undefined}
                                left={(props) => (
                                    <List.Icon {...props} icon="star-outline" />
                                )}
                                right={(props) => (
                                    <List.Icon {...props} icon="chevron-right" />
                                )}
                                onPress={() =>
                                    navigation.navigate('WishDetails', {
                                        id: item.id,
                                    })
                                }
                                accessibilityRole="button"
                            />
                        );
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    empty: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        gap: 8,
    },
    muted: {
        opacity: 0.75,
    },
    cta: {
        marginTop: 8,
        alignSelf: 'flex-start',
    },
});

