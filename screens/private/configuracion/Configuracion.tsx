import { Box, Heading, VStack } from 'native-base'
import React from 'react'

export default function Configuracion() {
    return (
        <Box flex={1} bg={'white'}>
            <VStack my={4} px={4}>
                <Heading>Configuración</Heading>
            </VStack>
        </Box>
    )
}