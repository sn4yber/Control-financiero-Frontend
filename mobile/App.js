import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
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
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
