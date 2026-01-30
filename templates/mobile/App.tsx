// import { StatusBar } from 'expo-status-bar';
import { View, SafeAreaView } from 'react-native';
import { useNavigationStore } from './src/store/navigation';
import { wsManager } from './src/services/ws';
import { useEffect } from 'react';

// Components
import { StatusIndicator } from './src/components/StatusIndicator';

// Screens
import Home from './src/screens/Home';
import UserList from './src/screens/UserList';
import UserForm from './src/screens/UserForm';
import ProductList from './src/screens/ProductList';
import Chat from './src/screens/Chat';
import AIChat from './src/screens/AIChat';
import Settings from './src/screens/Settings';

import { LiquidTokens } from '@float-v/lite';

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const { currentScreen } = useNavigationStore();

  useEffect(() => {
    // Initialize WebSocket connection (tries to connect if server available)
    wsManager.connect();

    return () => {
      wsManager.disconnect();
    };
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <Home />;
      case 'Users':
        return <UserList />;
      case 'UserForm':
        return <UserForm />;
      case 'Products':
        return <ProductList />;
      case 'Chat':
        return <Chat />;
      case 'AIChat':
        return <AIChat />;
      case 'Settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: LiquidTokens.colors.background, paddingTop: 40 }}>
        {/* <StatusBar style="dark" /> */}
        <StatusIndicator />
        <View style={{ flex: 1 }}>
          {renderScreen()}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
