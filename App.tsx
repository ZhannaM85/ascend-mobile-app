import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

import { RootNavigator } from './src/navigation/RootNavigator';
import { theme } from './src/theme/theme';
import { useWishesStore } from './src/features/wishes/wishesStore';

export default function App() {
    const wishesStore = useWishesStore();

    return (
        <PaperProvider theme={theme}>
            <StatusBar style="auto" />
            <RootNavigator wishesStore={wishesStore} />
        </PaperProvider>
    );
}