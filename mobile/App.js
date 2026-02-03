import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { keepAliveService } from './src/core/services/keepAliveService';

export default function App() {
  // 🔥 Iniciar keep-alive al montar la aplicación
  useEffect(() => {
    keepAliveService.start();
    
    return () => {
      keepAliveService.stop();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

