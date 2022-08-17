import React from 'react'
import { View, Text, Center, VStack, Heading, Box, Input } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Registrarse() {
    return (
        <SafeAreaView>
            <Center>
                <VStack space={5} alignItems="center">
                    <Box>
                        <Heading textAlign={'center'}>
                            Registrarse
                        </Heading>
                        <Text alignItems="center" color={'info.900'}>Todos los campo son requeridos.</Text>
                    </Box>
                    <Box alignItems={'center'}>
                        <Input px={3} mb={3} placeholder={'Nombres'} width={'80%'} keyboardType='default' variant={'rounded'} />
                        <Input px={3} mb={3} placeholder={'Apellidos'} width={'80%'} keyboardType='default' variant={'rounded'} />
                        <Input px={3} mb={3} placeholder={'Correo electrónico'} width={'80%'} keyboardType='email-address' variant={'rounded'} />
                        <Input px={3} mb={3} placeholder={'Teléfono celular'} width={'80%'} keyboardType='phone-pad' variant={'rounded'} />
                        <Input px={3} mb={3} placeholder={'Contraseña'} width={'80%'} keyboardType='default' variant={'rounded'} secureTextEntry />
                        <Input px={3} mb={3} placeholder={'Confirmar contraseña'} width={'80%'} keyboardType='default' variant={'rounded'} secureTextEntry />
                    </Box>
                </VStack>
            </Center>
        </SafeAreaView>
    )
}