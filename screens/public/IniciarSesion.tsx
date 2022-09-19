import React, { useState } from 'react'
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Center, VStack, Box, Heading, Input, Button, useToast } from 'native-base'
import { ScrollView, Image, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

import initFirebase from '../../firebase/init';
import { emailValidation } from '../../utils/functions/formValidation';
import { FirebaseError } from 'firebase/app';

type Props = NativeStackScreenProps<RootStackParamList, 'IniciarSesion'>

const IniciarSesion = (props: Props) => {

    const [correoElectronico, setCorreoElectronico] = useState<string>("");
    const [contrasena, setContrasena] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const auth = getAuth(initFirebase);
    const toast = useToast();
    type input = NativeSyntheticEvent<TextInputChangeEventData>;

    const iniciarSesion = () => {
        if (!emailValidation(correoElectronico)) {
            toast.show({
                description: "Ingrese un correo electrónico UTEQ (ejemplo@uteq.edu.mx)"
            });
            return;
        }

        //Iniciar carga
        setIsLoading(true);

        signInWithEmailAndPassword(auth, correoElectronico.trim(), contrasena.trim())
            .then((userCredential) => {
                toast.show({
                    description: "Bienvenido " + userCredential.user.email
                });

                props.navigation.navigate("Inicio");

                setIsLoading(false);
            }).catch((e: FirebaseError) => {
                toast.show({
                    description: "Ocurrió un error: " + e.message
                });
                setIsLoading(false);
            });
    }

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
                        <Input px={3} mb={3} placeholder={'Correo electrónico'} width={'80%'} keyboardType='email-address' variant={'rounded'}
                            onChange={(e: input) => { setCorreoElectronico(e.nativeEvent.text) }} />
                        <Input px={3} mb={3} placeholder={'Contraseña'} width={'80%'} keyboardType='default' secureTextEntry variant={'rounded'}
                            onChange={(e: input) => { setContrasena(e.nativeEvent.text) }} />
                        <Button colorScheme={'darkBlue'} onPress={iniciarSesion} isLoading={isLoading}>
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