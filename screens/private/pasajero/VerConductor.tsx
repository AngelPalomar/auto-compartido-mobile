import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc, getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import {
    Avatar, Center, Heading, ScrollView, Spinner, VStack, Text, Box, Stack,
    Button,
    useToast
} from 'native-base';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import IUsuario from '../../../interfaces/usuario.interface';
import initFirebase from '../../../firebase/init';
import Alerta from '../../../components/alerta/Alerta';
import ISolicitud from '../../../interfaces/solicitud.interface';
import { getAuth } from 'firebase/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'VerConductor'>;

export default function VerConductor(props: Props) {
    const { params } = props.route;
    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);
    const docRef = doc(db, "usuarios", params.idDoc as string);
    const [conductor, setConductor] = useState<Partial<IUsuario>>({});

    const pasajeroRef = collection(db, "usuarios");
    const q = query(pasajeroRef, where("idAuth", "==", auth.currentUser?.uid));
    const [pasajero, setPasajero] = useState<Partial<IUsuario>>({});

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRequesting, setIsRequesting] = useState<boolean>(false);
    const toast = useToast();

    useEffect(() => {
        getConductorDoc();
    }, []);

    const getConductorDoc = () => {
        const docSnap = getDoc(docRef);
        docSnap.then(doc => {
            if (doc.exists()) {
                setConductor(doc.data());

                //Obtiene el pasajero
                getDocs(q).then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        setPasajero(doc.data() as IUsuario);
                        setIsLoading(false);
                    })
                }).catch(err => {
                    console.error(err);
                    setIsLoading(false);
                })

            } else {
                console.error("No such document!");
                setIsLoading(false);
            }
        })
    }

    const solicitarViaje = () => {
        setIsRequesting(true);
        const solicitud: ISolicitud = {
            idAuthConductor: conductor.idAuth as string,
            pasajero: {
                nombres: pasajero.nombres,
                apellidos: pasajero.apellidos,
                telefono: pasajero.telefono
            },
            fechaHora: new Date().toDateString(),
            status: 'pendiente'
        }

        addDoc(collection(db, 'solicitudes'), solicitud).then(() => {
            toast.show({
                description: "Viaje solicitado."
            })
            setIsRequesting(false);
        });
    }

    if (isLoading) {
        return (
            <SafeAreaView>
                <Center>
                    <Spinner size={'lg'} mt={4} />
                </Center>
            </SafeAreaView>
        );
    }

    return (
        <ScrollView>
            <VStack my={4} px={4}>
                <Center>
                    <Center mb={5}>
                        <Avatar size={'xl'} mb={2} />
                        <Heading fontWeight={'light'}>
                            {`${conductor.nombres?.trim()} ${conductor.apellidos?.trim()}`}
                        </Heading>
                        <Text color={'gray.500'}>
                            Teléfono: {conductor.telefono}
                        </Text>
                    </Center>
                    <Button colorScheme={'cyan'} width={'48'} onPress={solicitarViaje} isLoading={isRequesting}>
                        SOLICITAR VIAJE
                    </Button>
                    <Box my={5}>
                        {
                            conductor.asegurado ?
                                <Alerta
                                    status='success'
                                    title='Conductor asegurado'
                                    description='El conductor a manisfestado tener un seguro.' /> :
                                <Alerta
                                    status='error'
                                    title='Conductor NO asegurado'
                                    description='El conductor a manisfestado NO tener un seguro.' />
                        }
                    </Box>
                </Center>
                <Box mb={4}>
                    <Heading size={'md'} mb={2} fontWeight={'hairline'} color={'gray.500'}>
                        Información del vehículo
                    </Heading>
                    <Stack direction={'column'} space={2} shadow={"3"}>
                        <Box bg={'white'} rounded="sm" p={4}>
                            <Heading size={'sm'}>
                                Modelo y marca
                            </Heading>
                            <Text>
                                {conductor.vehiculo?.modelo}
                            </Text>
                        </Box>
                        <Box bg={'white'} rounded="sm" p={4}>
                            <Heading size={'sm'}>
                                No. de placa / matrícula
                            </Heading>
                            <Text color={'blue.500'}>
                                {conductor.vehiculo?.numeroPlaca}
                            </Text>
                        </Box>
                        <Box bg={'white'} rounded="sm" p={4}>
                            <Heading size={'sm'}>
                                Color
                            </Heading>
                            <Text>
                                {conductor.vehiculo?.color}
                            </Text>
                        </Box>
                        <Box bg={'white'} rounded="sm" p={4}>
                            <Heading size={'sm'}>
                                Tipo
                            </Heading>
                            <Text>
                                {conductor.vehiculo?.tipoVehiculo.toUpperCase()}
                            </Text>
                        </Box>
                    </Stack>
                </Box>
                <Box mb={4}>
                    <Heading size={'md'} mb={2} fontWeight={'hairline'} color={'gray.500'}>
                        Ruta actual
                    </Heading>
                </Box>
            </VStack>
        </ScrollView>
    )
}