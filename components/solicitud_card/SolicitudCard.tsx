import { HStack, Box, Avatar, VStack, Text, Button, Icon } from 'native-base'
import React from 'react'
import ISolicitud from '../../interfaces/solicitud.interface'
import { SimpleLineIcons } from '@expo/vector-icons';

interface SolicitudCardProps {
    solicitud: ISolicitud
}

export default function SolicitudCard({ solicitud }: SolicitudCardProps) {
    return (
        <HStack>
            <Box mr={4}>
                <Avatar />
            </Box>
            <Box>
                <VStack>
                    <Text fontSize={'lg'}>
                        {`${solicitud.pasajero.nombres?.trim()} ${solicitud.pasajero.apellidos?.trim()}`}
                    </Text>
                    <HStack>
                        <Button variant={'link'} colorScheme={'emerald'}
                            leftIcon={<Icon as={<SimpleLineIcons name='check' />} />}>
                            Aceptar
                        </Button>
                        <Button variant={'link'} colorScheme={'red'}
                            leftIcon={<Icon as={<SimpleLineIcons name='close' />} />}>
                            Rechazar
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        </HStack>
    )
}