import {
    Box, Heading, HStack, Input, ScrollView, Select, VStack,
    Text,
    TextArea,
    Button,
    Icon,
    IconButton,
    Center
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import IRuta from '../../../interfaces/ruta.interface';
import IPunto from '../../../interfaces/punto.interface';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';

export default function CrearRuta() {
    const [horas, setHoras] = useState<Array<string>>([]);
    const [minutos, setMinutos] = useState<Array<string>>([]);
    const [horaSeleccionada, setHoraSeleccionada] = useState<string>("");
    const [minutoSeleccionado, setMinutoSeleccionado] = useState<string>("");
    const [lugar, setLugar] = useState<string>("");
    const [costo, setCosto] = useState<string>("");
    const [ruta, setRuta] = useState<Partial<IRuta>>({});
    const [puntos, setPuntos] = useState<Array<IPunto>>([]);
    type input = NativeSyntheticEvent<TextInputChangeEventData>;

    useEffect(() => {
        const generarHoras = () => {
            const horasArray: string[] = [];
            const minutosArray: string[] = [];

            for (let hr = 0; hr < 24; hr++) {
                if (hr < 10)
                    horasArray.push('0' + hr);
                else
                    horasArray.push(hr.toString());
            }

            for (let mn = 0; mn < 60; mn++) {
                if (mn < 10)
                    minutosArray.push('0' + mn);
                else
                    minutosArray.push(mn.toString());
            }

            setHoras(horasArray);
            setMinutos(minutosArray);
        }

        //Genera selector de horario
        generarHoras();
    }, []);

    const anadirPunto = () => {
        setPuntos(oldPuntos => [...oldPuntos, {
            lugar: lugar,
            costo: costo as unknown as number
        }]);
        setLugar("");
        setCosto("");
    }

    const removerPunto = (lugar: string) => {
        setPuntos(puntos.filter(item => item.lugar !== lugar));
    }

    return (
        <ScrollView>
            <VStack my={1} px={4}>
                <Box my={4} bg={'white'} p={8} rounded="sm" shadow={'4'}>
                    <Heading size={'sm'} mb={2} color={'gray.500'}>Información de la ruta</Heading>
                    <Input placeholder='Lugar de inicio' variant={'rounded'} mb={4} />
                    <Input placeholder='Lugar de destino' variant={'rounded'} mb={4} />
                    <TextArea placeholder='Descripción' variant={'filled'} mb={4} />
                    <Heading size={'sm'} mb={2} color={'gray.500'}>Hora de salida</Heading>
                    <HStack space={5} justifyContent='center' alignItems={'center'} mb={12}>
                        <Select placeholder='00' minWidth={'1/3'}>
                            {horas.map((value: string, index: number) => (
                                <Select.Item key={index} value={value} label={value} />
                            ))}
                        </Select>
                        <Text fontSize={'lg'}>:</Text>
                        <Select placeholder='00' minWidth={'1/3'}>
                            {minutos.map((value: string, index: number) => (
                                <Select.Item key={index} value={value} label={value} />
                            ))}
                        </Select>
                    </HStack>
                    <Heading size={'sm'} color={'gray.500'}>Puntos</Heading>
                    <Text color={'gray.500'} mb={4}>
                        Puntos de la ruta por donde pasas
                    </Text>
                    <HStack alignItems={'center'} justifyContent='center' space={1}>
                        <Input placeholder='Lugar' width={'1/3'} value={lugar}
                            onChange={(e: input) => setLugar(e.nativeEvent.text)} />
                        <Input placeholder='Costo $' width={'1/3'} keyboardType={'numeric'} value={costo}
                            onChange={(e: input) => setCosto(e.nativeEvent.text)} />
                        <Button colorScheme={'blue'}
                            leftIcon={<Icon as={<AntDesign name='plus' />} />}
                            onPress={anadirPunto}>
                            Agregar
                        </Button>
                    </HStack>
                    <VStack my={4}>
                        {puntos.map((value: IPunto, index: number) => (
                            <Box bg={'gray.100'} p={4} key={index} my={1} flexDirection='row' alignItems='center' justifyContent={'space-between'}>
                                <Box>
                                    <Text>Lugar: {value.lugar}</Text>
                                    <Text>Costo: ${value.costo.toString()}</Text>
                                </Box>
                                <IconButton icon={<Icon as={AntDesign} name='close' />}
                                    colorScheme='red'
                                    onPress={() => removerPunto(value.lugar)} />
                            </Box>
                        ))}
                    </VStack>
                    <Center>
                        <Button colorScheme={'emerald'}
                            isDisabled={puntos.length === 0 ? true : false}
                            leftIcon={<Icon as={<AntDesign name='check' />} />}>
                            AGREGAR RUTA
                        </Button>
                    </Center>
                </Box>
            </VStack>
        </ScrollView>
    )
}