import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Perfil from '../perfil/Perfil';
import MenuPrincipal from '../menu_principal/MenuPrincipal';

const Tab = createBottomTabNavigator<RootStackParamList>();

const Inicio = () => {
    return (
        <NavigationContainer independent>
            <Tab.Navigator>
                <Tab.Screen name='MenuPrincipal' component={MenuPrincipal} options={{
                    title: 'Menú'
                }} />
                <Tab.Screen name='Perfil' component={Perfil} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default Inicio