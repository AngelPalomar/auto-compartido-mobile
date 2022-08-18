import React from 'react'
import { View, Text, Center, VStack, Heading, Box, Input, Button } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, Image } from 'react-native'

export default function Registrarse() {
    return (
        <SafeAreaView>
            <ScrollView>
                <Center mb={10}>
                    <VStack space={5} alignItems="center">
                        <Box>
                            <Heading textAlign={'center'}>
                                Registrarse
                            </Heading>
                            <Text alignItems="center" color={'darkBlue.800'}>Todos los campo son requeridos.</Text>
                        </Box>
                        <Box alignItems={'center'}>
                            <Input px={3} mb={3} placeholder={'Nombres'} width={'80%'} keyboardType='default' variant={'rounded'} />
                            <Input px={3} mb={3} placeholder={'Apellidos'} width={'80%'} keyboardType='default' variant={'rounded'} />
                            <Input px={3} mb={3} placeholder={'Correo electrónico'} width={'80%'} keyboardType='email-address' variant={'rounded'} />
                            <Input px={3} mb={3} placeholder={'Teléfono celular'} width={'80%'} keyboardType='phone-pad' variant={'rounded'} />
                            <Input px={3} mb={3} placeholder={'Contraseña'} width={'80%'} keyboardType='default' variant={'rounded'} secureTextEntry />
                            <Input px={3} mb={3} placeholder={'Confirmar contraseña'} width={'80%'} keyboardType='default' variant={'rounded'} secureTextEntry />
                            <Text mb={2} color={'darkBlue.800'}>
                                ¿Eres un alumno de la UTEQ? Ingresa tu matrícula
                            </Text>
                            <Input px={3} mb={5} placeholder={'Matrícula'} width={'80%'} keyboardType='number-pad' variant={'rounded'} />
                            <Button colorScheme={'darkBlue'}>
                                CREAR CUENTA
                            </Button>
                        </Box>
                    </VStack>
                </Center>
                <Image
                    source={{ uri: 'http://dtai.uteq.edu.mx/~crupal192/imagenes/regis-pasajero.jpg' }}
                    style={{
                        width: '100%',
                        height: 260,
                        borderTopLeftRadius: 18,
                        borderTopRightRadius: 18
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    )
}