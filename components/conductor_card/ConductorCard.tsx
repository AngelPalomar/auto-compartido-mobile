import { AntDesign } from '@expo/vector-icons';
import { Avatar, Box, HStack, Text, theme, VStack } from 'native-base';
import React from 'react';
import IRuta from '../../interfaces/ruta.interface';
import IUsuario from '../../interfaces/usuario.interface';

interface ConductorCardProps {
    conductor: IUsuario,
    ruta: IRuta | null
}

export default function ConductorCard({ conductor, ruta }: ConductorCardProps) {
    return (
        <HStack>
            <Box mr={4}>
                <Avatar />
            </Box>
            <Box>
                <VStack>
                    <Text fontSize={'lg'}>
                        {`${conductor.nombres.trim()} ${conductor.apellidos.trim()}`}
                    </Text>
                    <Text color={'darkBlue.500'} fontSize={'xs'} mb={2}>
                        {conductor.vehiculo?.modelo}
                    </Text>
                    <HStack space={2} alignItems={'center'}>
                        <Text color={'gray.500'}>{`[${ruta?.horaSalida}]`}</Text>
                        <Text fontWeight={'light'}>
                            {ruta?.lugarInicio.trim()}
                        </Text>
                        <AntDesign name={'arrowright'} color={theme.colors.blue[500]} size={20} />
                        <Text fontWeight={'light'}>
                            {ruta?.lugarDestino.trim()}
                        </Text>
                    </HStack>
                </VStack>
            </Box>
        </HStack>
    )
}