import { Box, Heading, HStack, Text, theme, VStack } from 'native-base'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import IRuta from '../../interfaces/ruta.interface';
import IPunto from '../../interfaces/punto.interface';

interface RutaDetalleCardProps {
    ruta: IRuta,
    lugaresDisponibles: number
}

export default function RutaDetalleCard(props: RutaDetalleCardProps) {
    return (
        <Box bg={'blue.100'} rounded={'sm'} p={4}>
            <HStack space={2}>
                <Heading fontWeight={'light'}>
                    {props.ruta.lugarInicio.trim()}
                </Heading>
                <AntDesign name={'arrowright'} color={theme.colors.blue[500]} size={32} />
                <Heading fontWeight={'light'}>
                    {props.ruta.lugarDestino.trim()}
                </Heading>
            </HStack>
            <HStack alignItems={'center'} mb={2}>
                <AntDesign name={'clockcircle'} size={16} color={theme.colors.darkBlue[600]} />
                <Heading ml={2} size={'sm'} fontWeight={'light'} color={'darkBlue.600'}>
                    La ruta empieza a las <Text bold>{props.ruta.horaSalida}</Text> hrs.
                </Heading>
            </HStack>
            <HStack mb={3} alignItems={'center'}>
                <Text mr={2}>No. de pasajeros:</Text>
                <Text bold>{props.ruta.pasajeros.length} / {props.lugaresDisponibles}</Text>
            </HStack>
            <Text mb={2} color={'gray.500'}>Recorrido:</Text>
            <VStack pl={4} borderStyle={'solid'} borderLeftColor={'blue.300'} borderLeftWidth={'2'}>
                {
                    props.ruta.puntos.map((value: IPunto, index: number) => (
                        <HStack alignItems={'center'} mb={2} key={index}>
                            <AntDesign name={'enviroment'} color={theme.colors.blue[500]} size={20} />
                            <Text ml={2} mr={4}>{value.lugar}</Text>
                            <MaterialIcons name={'attach-money'} color={theme.colors.blue[500]} size={20} />
                            <Text ml={2} mr={4}>{value.costo} MXN.</Text>
                        </HStack>
                    ))
                }
            </VStack>
        </Box>
    )
}