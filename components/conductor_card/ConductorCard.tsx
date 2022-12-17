import { AntDesign } from '@expo/vector-icons';
import { Avatar, Box, HStack, Text, theme, VStack } from 'native-base';
import React from 'react';
import IRuta from '../../interfaces/ruta.interface';
import IUsuario, { IRutaUsuarioInfo } from '../../interfaces/usuario.interface';

interface ConductorCardProps {
    conductor: IUsuario
}

export default function ConductorCard({ conductor }: ConductorCardProps) {
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
                        <Text color={'gray.500'}>{`[${conductor.rutaInfo?.hora}]`}</Text>
                        <Text fontWeight={'light'}>
                            {conductor.rutaInfo?.lugarInicio.trim()}
                        </Text>
                        <AntDesign name={'arrowright'} color={theme.colors.blue[500]} size={20} />
                        <Text fontWeight={'light'}>
                            {conductor.rutaInfo?.lugarDestino.trim()}
                        </Text>
                    </HStack>
                </VStack>
            </Box>
        </HStack>
    )
}