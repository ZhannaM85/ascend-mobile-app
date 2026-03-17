import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

import type { RootStackParamList } from '../navigation/types';

export type AboutScreenProps = NativeStackScreenProps<
    RootStackParamList,
    'About'
>;

export function AboutScreen({ navigation }: AboutScreenProps) {
    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="About" />
            </Appbar.Header>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
            >
                <Text variant="headlineSmall" style={styles.title}>
                    Ascend
                </Text>
                <Text variant="bodyMedium" style={styles.muted}>
                    Turn wishes into reality through daily commitment.
                </Text>
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
    content: {
        padding: 16,
    },
    title: {
        marginBottom: 8,
    },
    muted: {
        opacity: 0.8,
    },
});
