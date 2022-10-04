import { ScrollView, VStack, Heading, Box, Text } from 'native-base';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

import initFirebase from '../../../firebase/init';
import IUsuario from '../../../interfaces/usuario.interface';
import ConductorCard from '../../../components/conductor_card/ConductorCard';
import { TouchableHighlight } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getAuth } from 'firebase/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'PasajeroMenu'>;

export default function PasajeroMenu(props: Props) {

    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, where("rol", "==", "conductor"));
    const [conductores, setConductores] = useState<Array<IUsuario>>([]);

    useEffect(() => {
        getConductoresDocs();
    }, []);

    const getConductoresDocs = () => {
        getDocs(q).then(querySnapshot => {
            let condts: Array<IUsuario> = [];
            querySnapshot.forEach((doc) => {
                condts.push({ ...doc.data(), idDoc: doc.id } as IUsuario);
            });

            setConductores(condts);
        }).catch(err => {
            console.error(err);
        })
    }

    return (
        <Box flex={1} bg={'white'}>
            <ScrollView>
                <VStack mx={4} my={2}>
                    <Heading>Conductores compartidos</Heading>
                    <Text>
                        Lista de todos los conductores compartidos.
                    </Text>
                    <Box mt={4}>
                        {
                            conductores.map((value: IUsuario, index: number) => {
                                if (value.verificado) {
                                    return (
                                        <Box key={index} mb={4}>
                                            <TouchableHighlight
                                                style={{ borderRadius: 10 }}
                                                underlayColor={'rgba(0, 0, 0, 0.08)'}
                                                onPress={() => props.navigation.navigate("VerConductor", { idDoc: value.idDoc, idAuth: value.idAuth })}>
                                                <Box bg={'blue.100'} p={4} borderRadius={10}>
                                                    <ConductorCard conductor={value} />
                                                </Box>
                                            </TouchableHighlight>
                                        </Box>
                                    )
                                } else {
                                    return null;
                                }
                            })
                        }
                    </Box>
                </VStack>
            </ScrollView>
        </Box>
    )
}