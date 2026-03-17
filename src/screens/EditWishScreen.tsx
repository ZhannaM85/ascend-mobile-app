import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

import type { RootStackParamList } from '../navigation/types';
import type { Wish } from '../features/wishes/types';
import { WishForm, type WishFormValue } from '../features/wishes/WishForm';

export type EditWishScreenProps = NativeStackScreenProps<RootStackParamList, 'EditWish'> & {
    wish?: Wish;
    updateWish: (id: string, value: WishFormValue) => void;
};

function toFormValue(wish: Wish): Partial<WishFormValue> {
    return {
        title: wish.title,
        description: wish.description ?? '',
        commitmentTitle: wish.commitment?.title ?? '',
        durationDays: wish.commitment?.durationDays ? String(wish.commitment.durationDays) : '',
        commitmentStartDateIso: wish.commitment?.startDateIso ?? '',
    };
}

export function EditWishScreen({ navigation, route, wish, updateWish }: EditWishScreenProps) {
    const { id } = route.params;

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Edit wish" />
            </Appbar.Header>

            {wish ? (
                <WishForm
                    submitLabel="Save"
                    initialValue={toFormValue(wish)}
                    onCancel={() => navigation.goBack()}
                    onSubmit={(value) => {
                        updateWish(id, value);
                        navigation.goBack();
                    }}
                />
            ) : (
                <View style={{ padding: 16 }}>
                    <Text>Wish not found.</Text>
                </View>
            )}
        </View>
    );
}

