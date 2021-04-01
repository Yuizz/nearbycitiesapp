import logo from './logo.svg';
import './App.css';
import { Box, Flex, Heading, Stack } from '@chakra-ui/layout';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Button } from '@chakra-ui/button';
import {
  NumberDecrementStepper, NumberIncrementStepper, NumberInput,
  NumberInputField, NumberInputStepper
} from '@chakra-ui/number-input';
import { useState } from 'react'
import { CircularProgress } from '@chakra-ui/progress';
import { Tooltip } from '@chakra-ui/tooltip';

function App() {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('null')
  const [numberOfCities, setNumberOfCities] = useState(4)
  const [cities, setCities] = useState('')
  const [status, setStatus] = useState(false)

  const getData = (event) => {
    event.preventDefault()
    
    const link = `https://nearby-cities.netlify.app/.netlify/functions/search?latitude=${latitude}&longitude=${longitude}`
    
    fetch(link)
    .then(response => response.json())
    .then(data => formatData(data))
    
    setStatus(true)
  }

  const copyCitiesToClipboard = () => {
    navigator.clipboard.writeText(cities)
  }
  
  const formatData = (data) => {
    const citiesQuery = []
    for (let i = 0; i < numberOfCities; i++) {
      citiesQuery.push(data[i].name.toUpperCase())
    }
    setCities(citiesQuery.join(', '))
    setStatus(false)
  }

  const coordsToDecimal = (coords) => {
    const grades =Number(coords.split('°')[0])
    const minutes = Number(coords.substring(coords.indexOf('°')+1, coords.indexOf(`'`)))
    const seconds = Number(coords.substring(coords.indexOf(`'`) + 1, coords.indexOf(`"`)))
    
    const decimalCoords = grades + minutes / 60 + seconds / 3600
    return decimalCoords
  }

  const Status = () => {
    if(!status) return ''
    return (
      <CircularProgress isIndeterminate color='green.300' size='20px' pr={15}/>
    )
  }

  return (
    <div className="App">
      <Flex minHeight='100vh' width='full' align='center' justifyContent='center'>
        <Box
          maxWidth='450px'
          borderWidth={1}
          borderRadius={10}
          boxShadow='lg'
          px={4}
          py={4}
          textAlign='center'
        >
        <Box my={8}>
          <Heading>Encontrar ciudades cercanas</Heading>
        </Box>
          <form>
            <FormControl>
              <FormLabel>Latitud: </FormLabel>
              <Input
                placeholder="Ingresa la latidud"
                onChange={event => setLatitude(coordsToDecimal(event.currentTarget.value))}
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel>Longitud: </FormLabel>
              <Input
                placeholder='Ingresa la longitud'
                onChange={event => setLongitude(coordsToDecimal(event.currentTarget.value))}
              ></Input>
            </FormControl>
            <FormControl>
                <FormLabel>Numero de ciudades: </FormLabel>
              <NumberInput
                defaultValue={4}
                min={1}
                max={10}
                onChange={valueString => setNumberOfCities(Number(valueString))}
              >
                <NumberInputField
                />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper/>
                  </NumberInputStepper>
                </NumberInput>
            </FormControl>

            <Button
              width='full'
              mt={4}
              onClick={getData}
            >🔍 Buscar ciudades cercanas</Button>
          </form>

          <FormControl mt={10}>
            <Stack isInline justifyContent='space-between'>
              <FormLabel>Ciudades cercanas: </FormLabel>
              <Status/>
            </Stack>
            <Stack direction='row'>
              <Input readOnly value={cities}></Input>
              <Tooltip label='Copy to clipboard' hasArrow closeDelay={500}>
                <Button
                  onClick={copyCitiesToClipboard}
                >📋</Button>
              </Tooltip>
            </Stack>
          </FormControl>
        </Box>
      </Flex>
    </div>
  );
}

export default App;
