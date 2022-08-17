import React from 'react'
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Center, VStack, Box, Image, Heading, Input, Button } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = NativeStackScreenProps<RootStackParamList, 'IniciarSesion'>

const IniciarSesion = (props: Props) => {
    return (
        <SafeAreaView>
            <Center>
                <VStack space={5} alignItems="center">
                    <Image
                        source={{ uri: 'http://dtai.uteq.edu.mx/~crupal192/imagenes/iniciar-sesion-header.jpg' }}
                        alt='Portada'
                        size={'96'}
                        height={'32'}
                        m={0} />
                    <Heading textAlign={'center'}>
                        Bienvenido a Auto Compartido UTEQ
                    </Heading>
                    <Heading size={'sm'} color={'info.900'}>Iniciar sesión</Heading>
                    <Box alignItems={'center'} mb={5}>
                        <Input px={3} mb={3} placeholder={'Correo electrónico'} width={'80%'} keyboardType='email-address' variant={'rounded'} />
                        <Input px={3} mb={3} placeholder={'Contraseña'} width={'80%'} keyboardType='default' secureTextEntry variant={'rounded'} />
                        <Button colorScheme={'info'}>
                            INGRESAR
                        </Button>
                    </Box>
                    <Box>
                        <Text>¿No tienes una cuenta?</Text>
                        <Button
                            variant={'link'}
                            colorScheme='info'
                            onPress={() => props.navigation.navigate('Registrarse')}>
                            Regístrate
                        </Button>
                    </Box>
                </VStack>
            </Center>
        </SafeAreaView >
    )
}

export default IniciarSesion