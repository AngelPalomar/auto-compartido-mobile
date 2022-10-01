import React, { useEffect } from "react";
import { LogBox } from 'react-native'
import {
  Text,
  HStack,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme
} from "native-base";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import IniciarSesion from "./screens/public/IniciarSesion";
import RegistrarsePasajero from "./screens/public/registro/RegistrarsePasajero";
import RegistrarseConductor from "./screens/public/registro/RegistrarseConductor";
import RegistrarVehiculo from "./screens/public/registro/RegistrarVehiculo";
import RegistrarLicencia from "./screens/public/registro/RegistrarLicencia";
import Inicio from "./screens/private/inicio/Inicio";
import VerConductor from "./screens/private/pasajero/VerConductor";
import CrearRuta from "./screens/private/conductor/CrearRuta";

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "light",
};

// extend the theme
export const theme = extendTheme({ config });
type MyThemeType = typeof theme;
declare module "native-base" {
  interface ICustomTheme extends MyThemeType { }
}

//create navigation stack routing
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs([
      'Setting a timer',
      'AsyncStorage has been extracted from react-native core'
    ]);
  }, []);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="IniciarSesion" component={IniciarSesion} options={{
            headerShown: false
          }} />
          <Stack.Screen name="RegistrarsePasajero" component={RegistrarsePasajero} options={{
            title: 'Crear una cuenta de pasajero',
            headerStyle: {
              backgroundColor: theme.colors.darkBlue[800]
            },
            headerTintColor: '#FFFFFF'
          }} />
          <Stack.Screen name="RegistrarseConductor" component={RegistrarseConductor} options={{
            title: 'Crear una cuenta como conductor',
            headerStyle: {
              backgroundColor: theme.colors.darkBlue[800]
            },
            headerTintColor: '#FFFFFF'
          }} />
          <Stack.Screen name="RegistrarVehiculo" component={RegistrarVehiculo} options={{
            title: 'Datos de tu vehiculo',
            headerStyle: {
              backgroundColor: theme.colors.darkBlue[800]
            },
            headerTintColor: '#FFFFFF'
          }} />
          <Stack.Screen name="RegistrarLicencia" component={RegistrarLicencia} options={{
            title: 'Datos de tu licencia',
            headerStyle: {
              backgroundColor: theme.colors.darkBlue[800]
            },
            headerTintColor: '#FFFFFF'
          }} />
          <Stack.Screen name="Inicio" component={Inicio} options={{
            headerShown: false
          }} />
          <Stack.Screen name="VerConductor" component={VerConductor} options={{
            title: '',
            headerStyle: {
              backgroundColor: theme.colors.darkBlue[800]
            },
            headerTintColor: '#FFFFFF'
          }} />
          <Stack.Screen name="CrearRuta" component={CrearRuta} options={{
            title: 'Crear una nueva ruta',
            headerStyle: {
              backgroundColor: theme.colors.darkBlue[800]
            },
            headerTintColor: '#FFFFFF'
          }} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

// Color Switch Component
function ToggleDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack space={2} alignItems="center">
      <Text>Dark</Text>
      <Switch
        isChecked={colorMode === "light"}
        onToggle={toggleColorMode}
        aria-label={
          colorMode === "light" ? "switch to dark mode" : "switch to light mode"
        }
      />
      <Text>Light</Text>
    </HStack>
  );
}
