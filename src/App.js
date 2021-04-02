import './App.css';
import {
  Box, Flex, Heading,
  FormControl, FormLabel, Input, Button,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Tooltip, InputGroup, InputRightElement,
  useClipboard
} from '@chakra-ui/react'
import { useState } from 'react'

function App() {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [numberOfCities, setNumberOfCities] = useState(4)
  const [cities, setCities] = useState('')
  const [status, setStatus] = useState(false)
  const { hasCopied, onCopy } = useClipboard(cities)

  const getData = (event) => {
    event.preventDefault()
    event.target.style.isLoading = true

    const link = `https://nearby-cities.netlify.app/.netlify/functions/search?latitude=${latitude}&longitude=${longitude}`
    
    fetch(link)
    .then(response => response.json())
    .then(data => formatData(data))
    
    setStatus(true)
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
            <FormControl isRequired>
              <FormLabel>Latitud: </FormLabel>
              <Input
                placeholder="Ingresa la latidud"
                onChange={event => setLatitude(coordsToDecimal(event.currentTarget.value))}
              ></Input>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Longitud: </FormLabel>
              <Input
                aria-required
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
              isLoading={status}
              loadingText = 'Buscando ciudades'
              width='full'
              mt={4}
              onClick={latitude && longitude ? getData : null}
            >🔍 Buscar ciudades cercanas</Button>
          </form>

            <FormLabel mt={10}>Ciudades cercanas: </FormLabel>

            <InputGroup>
              <Input readOnly value={cities} />
              <InputRightElement>
                <Tooltip
                  label='Copiar al portapapeles'
                  hasArrow
                  defaultIsOpen
                  closeDelay={500}>
                <Button onClick={onCopy}>
                  {hasCopied ? '✔' : '📋'}
                </Button>
              </Tooltip>
              </InputRightElement>
            </InputGroup>


        </Box>
      </Flex>
    </div>
  );
}

export default App;
