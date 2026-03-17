import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';

import type { RootStackParamList } from '../navigation/types';
import { WishForm, type WishFormValue } from '../features/wishes/WishForm';

export type CreateWishScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateWish'> & {
    createWish: (value: WishFormValue) => void;
};

export function CreateWishScreen({ navigation, createWish }: CreateWishScreenProps) {
    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Create wish" />
            </Appbar.Header>

            <WishForm
                submitLabel="Create"
                onCancel={() => navigation.goBack()}
                onSubmit={(value) => {
                    createWish(value);
                    navigation.goBack();
                }}
            />
        </View>
    );
}

