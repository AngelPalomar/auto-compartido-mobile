import React from 'react'
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Center, VStack, Box, Heading, Input, Button } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, Image } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'IniciarSesion'>

const IniciarSesion = (props: Props) => {
    return (
        <ScrollView>
            <Center>
                <Image
                    source={{ uri: 'http://dtai.uteq.edu.mx/~crupal192/imagenes/iniciar-sesion-header.jpg' }}
                    style={{
                        width: '100%',
                        height: 180,
                        borderBottomLeftRadius: 18,
                        borderBottomRightRadius: 18,
                        marginBottom: 16
                    }}
                />
                <VStack space={5} alignItems="center">
                    <Heading textAlign={'center'}>
                        Bienvenido a Auto Compartido UTEQ
                    </Heading>
                    <Heading size={'sm'} color={'darkBlue.800'}>Iniciar sesión</Heading>
                    <Box alignItems={'center'} mb={5}>
                        <Input px={3} mb={3} placeholder={'Correo electrónico'} width={'80%'} keyboardType='email-address' variant={'rounded'} />
                        <Input px={3} mb={3} placeholder={'Contraseña'} width={'80%'} keyboardType='default' secureTextEntry variant={'rounded'} />
                        <Button colorScheme={'darkBlue'} onPress={() => props.navigation.navigate('Inicio')}>
                            INGRESAR
                        </Button>
                    </Box>
                    <Box alignItems={'center'}>
                        <Text>¿Buscas un auto compartido?</Text>
                        <Button
                            variant={'link'}
                            colorScheme='darkBlue'
                            onPress={() => props.navigation.navigate('RegistrarsePasajero')}>
                            Regístrate
                        </Button>
                    </Box>
                    <Box alignItems={'center'}>
                        <Text>¿Quieres ser conductor?</Text>
                        <Button
                            variant={'link'}
                            colorScheme='cyan'
                            onPress={() => props.navigation.navigate('RegistrarseConductor')}>
                            Registra tu auto aquí y se un conductor UTEQ
                        </Button>
                    </Box>
                </VStack>
            </Center>
        </ScrollView>
    )
}

export default IniciarSesion