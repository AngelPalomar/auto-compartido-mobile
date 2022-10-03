import React from 'react'
import { Box, Avatar, HStack, VStack, Text } from 'native-base'
import IUsuario from '../../interfaces/usuario.interface';

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
                    <Text color={'darkBlue.500'} fontSize={'xs'}>
                        {conductor.vehiculo?.modelo}
                    </Text>
                </VStack>
            </Box>
        </HStack>
    )
}