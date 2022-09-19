import React, { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    Text, Center, VStack, Box, Heading, Button, Icon,
    Radio, useToast, Image
} from 'native-base'
import initFirebase from '../../../firebase/init';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

//Iconos
import { SimpleLineIcons } from '@expo/vector-icons';

//Permisos
import * as ImagePicker from 'expo-image-picker';

//Interfaces
import IUsuario from '../../../interfaces/usuario.interface';
import IAuth from '../../../interfaces/auth.interface';

//Nav
type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarLicencia'>

const RegistrarLicencia = (props: Props) => {
    const { params } = props.route;
    const storage = getStorage(initFirebase);
    const auth = getAuth(initFirebase);
    const db = getFirestore(initFirebase);

    const [conductor, setConductor] = useState<IUsuario>({
        activo: true,
        apellidos: params.apellidos,
        asegurado: false,
        fotoLicencia: '',
        idAuth: '',
        matricula: params.matricula,
        nombres: params.nombres,
        rol: 'conductor',
        telefono: params.telefono,
        vehiculo: {
            color: params.color,
            modelo: params.modelo,
            numeroPlaca: params.numeroPlaca,
            tipoVehiculo: params.tipoVehiculo
        }
    });
    const [autenticacion, setAutenticacion] = useState<IAuth>({
        confirmaContrasena: params.confirmarContrasena,
        contrasena: params.contrasena,
        correoElectronico: params.correoElectronico
    });
    const [imagen, setImagen] = useState<string | null>(null);
    const [archivo, setArchivo] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();

    const subirFotoLicencia = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status === "granted") {
            const imgGaleria: any = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [16, 10],
                quality: 1
            });


            if (typeof imgGaleria !== "undefined") {
                setImagen(imgGaleria.uri as string);

                const blob = await (await fetch(imgGaleria.uri)).blob();
                setArchivo(new File(
                    [blob],
                    "img-" + `${imgGaleria.uri}`,
                    { type: 'image/jpeg' }
                ));
            } else {
                setImagen(null);
                toast.show({
                    description: "Selecciona una foto."
                });
            }
        } else {
            toast.show({
                description: "Necesitamos acceso a tu galería para cargar tu imágen de la licencia."
            });
        }
    }

    const crearConductor = () => {
        const condtr: IUsuario = conductor;
        const ath: IAuth = autenticacion;
        if (!imagen) {
            toast.show({
                description: "Suba una foto de su licencia."
            });
            return;
        }

        //carga
        setIsLoading(true);

        //Crea la cuenta en auth
        createUserWithEmailAndPassword(
            auth,
            ath.correoElectronico,
            ath.contrasena).then(createdUser => {
                //Sube la foto de la licencia al firestorage
                const storageRef = ref(storage, `licencias/${createdUser.user.uid}`);

                uploadBytes(storageRef, archivo as File).then(snapshot => {
                    condtr.fotoLicencia = snapshot.ref.toString();
                    condtr.idAuth = createdUser.user.uid;

                    //Guarda el documento a la base de datos
                    addDoc(collection(db, 'usuarios'), condtr);

                    props.navigation.navigate('Inicio');
                }).catch(e => {
                    console.error(e);
                    setIsLoading(false);
                })

            }).catch(e => {
                setIsLoading(false);
                toast.show({
                    description: "Ocurrió un error: " + e
                })
            });
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <Center>
                    <VStack space={5} alignItems="center">
                        <Box>
                            <Heading textAlign={'center'}>
                                Ser conductor UTEQ
                            </Heading>
                            <Text alignItems="center" color={'cyan.800'}>
                                Todos los campo son requeridos.
                            </Text>
                        </Box>
                        <Box alignItems={'center'}>
                            <Text mb={2}>Datos de tu licencia</Text>
                            <Box alignItems={'center'}>
                                <Text mb={2} color={'cyan.800'}>
                                    Sube una foto de tu licencia de conducir
                                </Text>
                                <Box
                                    width={300}
                                    height={250}
                                    borderStyle={'dotted'}
                                    borderColor={'cyan.500'}
                                    borderWidth={3}
                                    justifyContent={'center'}
                                    p={6}
                                    borderRadius={12}
                                    textAlign={'center'}
                                    mb={3}>
                                    <Center>
                                        {
                                            imagen && (
                                                <Image mb={"5"} src={imagen} size="3/4" alt='imagenLicencia.png' />
                                            )
                                        }
                                        <Button
                                            onPress={subirFotoLicencia}
                                            leftIcon={<Icon as={<SimpleLineIcons />} name={'camera'} color={'white'} />} >
                                            ABRIR GALERÍA
                                        </Button>
                                    </Center>
                                </Box>
                                <Icon as={<SimpleLineIcons />} name={'info'} color={'info.500'} size={4} />
                                <Text mb={2} color={'cyan.800'} textAlign={'center'}>¿Estás asegurado?</Text>
                                <Text mb={2} textAlign={'center'}>Esta información se le mostrará a los pasajero interesados</Text>
                                <Box mb={4}>
                                    <Radio.Group name='aseguradoGroup' accessibilityLabel={'¿Estás asegurado?'} value={conductor.asegurado ? 'si' : 'no'}
                                        onChange={(value: string) => {
                                            if (value === 'si')
                                                setConductor({ ...conductor, asegurado: true });
                                            else
                                                setConductor({ ...conductor, asegurado: false });
                                        }}>
                                        <Radio value={'si'} my={2}>
                                            Sí, estoy asegurado.
                                        </Radio>
                                        <Radio value={'no'} my={2}>
                                            No, no estoy asegurado.
                                        </Radio>
                                    </Radio.Group>
                                </Box>
                                <Button isLoading={isLoading} onPress={crearConductor} colorScheme={'cyan'} mb={10}>
                                    CREA CUENTA AHORA
                                </Button>
                            </Box>
                        </Box>
                    </VStack>
                </Center>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RegistrarLicencia