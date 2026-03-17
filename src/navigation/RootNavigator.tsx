import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './types';
import type { WishesStore } from '../features/wishes/wishesStore';
import { WishesListScreen } from '../screens/WishesListScreen';
import { CreateWishScreen } from '../screens/CreateWishScreen';
import { WishDetailsScreen } from '../screens/WishDetailsScreen';
import { EditWishScreen } from '../screens/EditWishScreen';
import { AboutScreen } from '../screens/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootNavigatorProps = {
    wishesStore: WishesStore;
};

export function RootNavigator({ wishesStore }: RootNavigatorProps) {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Wishes">
                    {(props) => <WishesListScreen {...props} wishes={wishesStore.wishes} />}
                </Stack.Screen>
                <Stack.Screen name="WishDetails">
                    {(props) => (
                        <WishDetailsScreen
                            {...props}
                            wish={wishesStore.getById(props.route.params.id)}
                            onCheckIn={wishesStore.checkIn}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="CreateWish">
                    {(props) => (
                        <CreateWishScreen
                            {...props}
                            createWish={(value) => {
                                wishesStore.createWish({
                                    title: value.title,
                                    description: value.description,
                                    commitmentTitle: value.commitmentTitle || undefined,
                                    durationDays: value.durationDays ? Number(value.durationDays) : undefined,
                                    commitmentStartDateIso: value.commitmentStartDateIso || undefined,
                                });
                            }}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="About">
                    {(props) => <AboutScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="EditWish">
                    {(props) => (
                        <EditWishScreen
                            {...props}
                            wish={wishesStore.getById(props.route.params.id)}
                            updateWish={(id, value) => {
                                wishesStore.updateWish(id, {
                                    title: value.title,
                                    description: value.description,
                                    commitmentTitle: value.commitmentTitle || undefined,
                                    durationDays: value.durationDays ? Number(value.durationDays) : undefined,
                                    commitmentStartDateIso: value.commitmentStartDateIso || undefined,
                                });
                            }}
                        />
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

