import { Box, Heading, ScrollView, VStack } from 'native-base'
import React from 'react'

export default function Viajes() {
    return (
        <Box flex={1} bg={'white'}>
            <ScrollView>
                <VStack mx={4} my={2}>
                    <Heading>Viajes</Heading>
                </VStack>
            </ScrollView>
        </Box>
    )
}