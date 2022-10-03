import { AntDesign } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { collection, DocumentData, getDocs, getFirestore, onSnapshot, Query, query, where } from 'firebase/firestore';
import { Box, Button, Center, Heading, HStack, Icon, ScrollView, Spinner, Text, theme, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import initFirebase from '../../../firebase/init';
import IRuta from '../../../interfaces/ruta.interface';
import IUsuario from '../../../interfaces/usuario.interface';

export default function Viajes() {
    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);

    const usuariosRef = collection(db, 'usuarios');
    const qUsuario = query(usuariosRef, where("idAuth", "==", auth.currentUser?.uid));
    const [usuario, setUsuario] = useState<IUsuario | null>(null);

    const [rutaActual, setRutaActual] = useState<Partial<IRuta> | null>(null);
    const rutasRef = collection(db, "rutas");

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getUsuarioDoc();
    }, [])

    useEffect(() => {
        if (usuario) {
            getRutaActual();
        }
    }, [usuario])

    const getUsuarioDoc = () => {
        getDocs(qUsuario).then(querySnapshot => {
            querySnapshot.forEach(doc => {
                setUsuario(doc.data() as IUsuario);
                setIsLoading(false);
            })
        }).catch(err => {
            console.error(err);
            setIsLoading(false);
        })
    }

    const getRutaActual = () => {
        let qRutaActual: Query<DocumentData> | null = null;

        if (usuario?.rol === 'conductor') {
            qRutaActual = query(rutasRef, where("activo", "==", true), where("idAuthConductor", "==", auth.currentUser?.uid));
        } else {
            qRutaActual = query(rutasRef, where("activo", "==", true), where("pasajeros", "array-contains", {
                nombres: usuario?.nombres,
                apellidos: usuario?.apellidos,
                idAuth: auth.currentUser?.uid,
                telefono: usuario?.telefono
            }));
        }

        onSnapshot(qRutaActual, querySnapshot => {
            let rts: IRuta[] = [];
            querySnapshot.forEach(doc => {
                rts.push({ ...doc.data(), idDoc: doc.id } as IRuta);
            })

            if (rts.length > 0)
                setRutaActual(rts[0]);
            else
                setRutaActual(null);
        });
    }

    if (isLoading) {
        return (
            <SafeAreaView>
                <Center>
                    <Spinner size={'lg'} mt={4} />
                </Center>
            </SafeAreaView>
        )
    }

    return (
        <Box flex={1} bg={'white'}>
            <ScrollView>
                <VStack mx={4} my={2}>
                    <Heading>Viajes</Heading>
                    {
                        usuario?.rol === 'conductor' ?
                            <VStack my={2} bg={'blue.100'} p={4} rounded={'sm'}>
                                {
                                    !rutaActual ?
                                        <React.Fragment>
                                            <Heading fontWeight={'light'} mb={2}>
                                                No tienes una ruta activa
                                            </Heading>
                                            <Text color={'darkBlue.500'}>
                                                Activa una de tus rutas para recibir solicitudes e iniciar viajes.
                                            </Text>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <Heading fontWeight={'light'}>
                                                Ruta activa en preparación
                                            </Heading>
                                            <HStack mb={2} alignItems={'center'} space={2}>
                                                <Text fontWeight={'light'}>
                                                    {rutaActual.lugarInicio?.trim()}
                                                </Text>
                                                <AntDesign name={'arrowright'} color={theme.colors.blue[500]} size={20} />
                                                <Text fontWeight={'light'}>
                                                    {rutaActual.lugarDestino?.trim()}
                                                </Text>
                                            </HStack>
                                            <Text color={'darkBlue.500'} mb={2}>
                                                Pasajeros
                                            </Text>
                                            {
                                                rutaActual.pasajeros?.length === 0 ?
                                                    <Text color={'gray.500'}>
                                                        No hay pasajeros
                                                    </Text> :
                                                    <Box>
                                                        {
                                                            rutaActual.pasajeros?.map((value: Partial<IUsuario>, index: number) => (
                                                                <HStack alignItems={'center'} space={3} key={index}>
                                                                    <AntDesign name={'user'} size={20} color={theme.colors.blue[500]} />
                                                                    <Text fontSize={'md'} color={'gray.500'}>
                                                                        {`${value.nombres?.trim()} ${value.apellidos?.trim()}`}
                                                                    </Text>
                                                                </HStack>
                                                            ))
                                                        }
                                                        <Button mt={4} colorScheme={'emerald'} size={'lg'} height={'16'} leftIcon={<Icon as={<AntDesign name='car' />} />}>
                                                            INICIAR VIAJE
                                                        </Button>
                                                    </Box>
                                            }
                                        </React.Fragment>
                                }
                            </VStack> :
                            <VStack my={2} bg={'blue.100'} p={4} rounded={'sm'}>
                                {
                                    !rutaActual ?
                                        <React.Fragment>
                                            <Heading fontWeight={'light'} mb={2}>
                                                No estás en una ruta
                                            </Heading>
                                            <Text color={'darkBlue.500'}>
                                                Envía una solicitud a un conductor para que te agrege a su ruta
                                            </Text>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <Heading fontWeight={'light'}>
                                                Estás en una ruta
                                            </Heading>
                                            <HStack mb={2} alignItems={'center'} space={2}>
                                                <Text fontWeight={'light'}>
                                                    {rutaActual.lugarInicio?.trim()}
                                                </Text>
                                                <AntDesign name={'arrowright'} color={theme.colors.blue[500]} size={20} />
                                                <Text fontWeight={'light'}>
                                                    {rutaActual.lugarDestino?.trim()}
                                                </Text>
                                            </HStack>
                                            <Text color={'darkBlue.500'}>
                                                Conductor
                                            </Text>
                                        </React.Fragment>
                                }
                            </VStack>
                    }
                </VStack>
            </ScrollView>
        </Box>
    )
}