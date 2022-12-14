import React, { useState } from 'react'
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Text, Center, VStack, Box, Heading, Input, Button, useToast, InputRightAddon, InputGroup,
    Stack
} from 'native-base'
import { ScrollView, Image, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

import initFirebase from '../../firebase/init';
import { minLenghtValidation } from '../../utils/functions/formValidation';
import { FirebaseError } from 'firebase/app';
import pjson from '../../package.json';

type Props = NativeStackScreenProps<RootStackParamList, 'IniciarSesion'>

const IniciarSesion = (props: Props) => {

    const [correoElectronico, setCorreoElectronico] = useState<string>("");
    const [contrasena, setContrasena] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const auth = getAuth(initFirebase);
    const toast = useToast();
    type input = NativeSyntheticEvent<TextInputChangeEventData>;

    const iniciarSesion = () => {
        if (!minLenghtValidation(correoElectronico.trim(), 3)) {
            toast.show({
                description: "Ingrese un correo electrónico UTEQ (ejemplo@uteq.edu.mx)"
            });
            return;
        }

        //Iniciar carga
        setIsLoading(true);

        signInWithEmailAndPassword(auth, `${correoElectronico.trim()}@uteq.edu.mx`, contrasena.trim())
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
        <Box flex={1} bg={'white'}>
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
                        <VStack alignItems={'center'}>
                            <Heading textAlign={'center'} fontWeight={'light'}>
                                Bienvenido a
                            </Heading>
                            <Heading fontWeight={'normal'} size={'2xl'}>
                                <Text color={'cyan.500'}>A</Text><Text color={'darkBlue.800'}>UTEQ</Text>
                            </Heading>
                        </VStack>
                        <Heading size={'sm'} color={'darkBlue.800'}>Iniciar sesión</Heading>
                        <Center mb={5}>
                            <Stack alignItems="center" mb={3}>
                                <InputGroup w={{
                                    base: "100%"
                                }}>
                                    <Input w={{
                                        base: "52%",
                                        sm: "75%"
                                    }} placeholder="nombre.apellido / matrícula"
                                        variant={'rounded'}
                                        onChange={(e: input) => { setCorreoElectronico(e.nativeEvent.text) }} />
                                    <InputRightAddon children={"@uteq.edu.mx"} />
                                </InputGroup>
                            </Stack>
                            <Input px={3} mb={3} placeholder={'Contraseña'} width={'80%'} keyboardType='default' secureTextEntry variant={'rounded'}
                                onChange={(e: input) => { setContrasena(e.nativeEvent.text) }} />
                            <Button colorScheme={'darkBlue'} onPress={iniciarSesion} isLoading={isLoading}>
                                INGRESAR
                            </Button>
                        </Center>
                        <Box alignItems={'center'}>
                            <Text>¿Buscas un auto compartido?</Text>
                            <Button
                                variant={'link'}
                                colorScheme='lightBlue'
                                onPress={() => props.navigation.navigate('RegistrarsePasajero')}>
                                Regístrate
                            </Button>
                        </Box>
                        <Box alignItems={'center'}>
                            <Text>¿Quieres ser conductor?</Text>
                            <Button
                                variant={'link'}
                                colorScheme='lightBlue'
                                onPress={() => props.navigation.navigate('RegistrarseConductor')}>
                                Registra tu auto aquí y se un conductor UTEQ
                            </Button>
                        </Box>
                    </VStack>
                </Center>
                <Text mt={16} color={'gray.400'} fontSize={'xs'} textAlign={'center'} bottom={'0'}>
                    Versión {pjson.version} {'\n'}
                    Universidad Tecnológica de Querétaro. {'\n'}
                    Todos los derechos reservados
                </Text>
            </ScrollView>
        </Box>
    )
}

export default IniciarSesion