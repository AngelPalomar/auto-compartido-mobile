import React, { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Center, VStack, Heading, Box, Input, Button, useToast, Stack, InputGroup, InputRightAddon } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    ScrollView, Image, NativeSyntheticEvent,
    TextInputChangeEventData
} from 'react-native'
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

//DB y I
import initFirebase from "../../../firebase/init";
import IUsuario from "../../../interfaces/usuario.interface";
import IAuth from "../../../interfaces/auth.interface";
import { minLenghtValidation } from '../../../utils/functions/formValidation';

//Nav
type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarsePasajero'>

export default function Registrarse(props: Props) {
    const [autenticacion, setAutenticacion] = useState<IAuth>({
        correoElectronico: '',
        confirmaContrasena: '',
        contrasena: ''
    });
    const [pasajero, setPasajero] = useState<IUsuario>({
        activo: true,
        asegurado: false,
        rol: 'pasajero',
        fotoLicencia: null,
        apellidos: '',
        matricula: null,
        idAuth: '',
        nombres: '',
        telefono: '',
        vehiculo: null,
        verificado: false
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();
    type input = NativeSyntheticEvent<TextInputChangeEventData>;
    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);

    const crearPasajero = async () => {
        const psj: IUsuario = pasajero;
        const usr: IAuth = autenticacion;

        //Validaciones
        if (!minLenghtValidation(psj.nombres, 3)) {
            toast.show({
                description: "Ingrese su nombre."
            });
            return;
        }

        if (!minLenghtValidation(psj.apellidos, 3)) {
            toast.show({
                description: "Ingrese sus apellidos."
            });
            return;
        }

        if (!minLenghtValidation(psj.telefono, 10)) {
            toast.show({
                description: "Ingrese un n??mero telef??nico de 10 d??gitos."
            });
            return;
        }

        if (!minLenghtValidation(usr.correoElectronico, 3)) {
            toast.show({
                description: "Ingrese un correo v??lido (ejemplo@uteq.edu.mx)."
            });
            return;
        }

        if (!minLenghtValidation(usr.contrasena, 8)) {
            toast.show({
                description: "Ingrese una contrase??a de al menos 8 caracteres."
            });
            return;
        }

        if (usr.contrasena !== usr.confirmaContrasena) {
            toast.show({
                description: "Las contrase??as deben ser iguales."
            });
            return;
        }

        //Inicia carga
        setIsLoading(true);

        //Crea el usuario
        createUserWithEmailAndPassword(auth, `${usr.correoElectronico.trim()}@uteq.edu.mx`, usr.contrasena.trim())
            .then(async (userCredential) => {
                psj.idAuth = userCredential.user.uid

                //Crea el doc de usuario
                addDoc(collection(db, 'usuarios'), psj);

                //Manda al inicio
                props.navigation.navigate('Inicio');

                setIsLoading(false);
            }).catch(e => {
                toast.show({
                    description: "Error al crear tu usuario, intenta de nuevo. Error: " + e
                });
                setIsLoading(false);
            })
    }

    return (
        <Box flex={1} bg={'white'}>
            <ScrollView>
                <Center mb={10} mt={6}>
                    <VStack space={5} alignItems="center">
                        <Box>
                            <Heading textAlign={'center'}>
                                Registrarse
                            </Heading>
                            <Text alignItems="center" color={'darkBlue.800'}>Todos los campo son requeridos.</Text>
                        </Box>
                        <Box alignItems={'center'}>
                            <Input px={3} mb={3} placeholder={'Nombres'} width={'80%'} keyboardType='default' variant={'rounded'}
                                onChange={(e: input): void => setPasajero({ ...pasajero, nombres: e.nativeEvent.text })} />
                            <Input px={3} mb={3} placeholder={'Apellidos'} width={'80%'} keyboardType='default' variant={'rounded'}
                                onChange={(e: input): void => setPasajero({ ...pasajero, apellidos: e.nativeEvent.text })} />
                            <Stack alignItems="center" px={3} mb={3}>
                                <InputGroup w={{
                                    base: "80%",
                                    md: "285"
                                }}>
                                    <Input w={{
                                        base: "70%",
                                        md: "100%"
                                    }} placeholder="nombre.apellido / matr??cula"
                                        variant={'rounded'}
                                        onChange={(e: input) => { setAutenticacion({ ...autenticacion, correoElectronico: e.nativeEvent.text }) }} />
                                    <InputRightAddon children={"@uteq.edu.mx"} />
                                </InputGroup>
                            </Stack>
                            <Input px={3} mb={3} placeholder={'Tel??fono celular'} width={'80%'} keyboardType='phone-pad' variant={'rounded'}
                                onChange={(e: input): void => setPasajero({ ...pasajero, telefono: e.nativeEvent.text })} />
                            <Input px={3} mb={3} placeholder={'Contrase??a'} width={'80%'} keyboardType='default' variant={'rounded'} secureTextEntry
                                onChange={(e: input): void => setAutenticacion({ ...autenticacion, contrasena: e.nativeEvent.text })} />
                            <Input px={3} mb={3} placeholder={'Confirmar contrase??a'} width={'80%'} keyboardType='default' variant={'rounded'} secureTextEntry
                                onChange={(e: input): void => setAutenticacion({ ...autenticacion, confirmaContrasena: e.nativeEvent.text })} />
                            <Text mb={2} color={'darkBlue.800'}>
                                ??Eres un alumno de la UTEQ? Ingresa tu matr??cula
                            </Text>
                            <Input px={3} mb={5} placeholder={'Matr??cula'} width={'80%'} keyboardType='number-pad' variant={'rounded'}
                                onChange={(e: input): void => setPasajero({ ...pasajero, matricula: e.nativeEvent.text })} />
                            <Button colorScheme={'lightBlue'} onPress={crearPasajero} isLoading={isLoading}>
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
        </Box>
    )
}