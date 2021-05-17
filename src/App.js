import './App.css';
import {
  Box, Flex, Heading,
  FormControl, FormLabel, Input, Button,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Tooltip, InputGroup, InputRightElement,
  useClipboard
} from '@chakra-ui/react'
import { useState } from 'react'
import MapModal from "./components/MapModal.jsx"

function App() {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [numberOfCities, setNumberOfCities] = useState(4)
  const [data, setData] = useState([])
  const [cities, setCities] = useState([])
  const [status, setStatus] = useState(false)
  const [isNewValue, setIsNewValue] = useState(true)
  const { hasCopied, onCopy } = useClipboard(cities.map(city=>city.name.toUpperCase()).join(', '))

  const getData = (event) => {
    event.preventDefault()

    const link = `https://nearby-cities.netlify.app/.netlify/functions/search?latitude=${latitude}&longitude=${longitude}`
    if(isNewValue){
      setStatus(true)
      fetch(link)
        .then(response => response.json())
        .then(d => {
          setData(d)
          formatData(d, numberOfCities)
          setIsNewValue(false)
        })
        .finally(()=> setStatus(false))
    } else {
      formatData(data, numberOfCities)
    }
  }
  
  const checkForPrevious = (coord) => {
    const setState = {longitude: setLongitude, latitude: setLatitude}

    return (event) => {
      const formatedValue = coordsToDecimal(event.currentTarget.value)
      let newValue =  false

      if(formatedValue !== coord) newValue = true
      setState[event.currentTarget.name](formatedValue)
      setIsNewValue(newValue)
    }
  }

  const formatData = (data, numberOfCities) => {
    setCities(data.slice(0, numberOfCities))
  }

  const coordsToDecimal = (coords) => {
    const grades =Number(coords.split('°')[0])
    const minutes = Number(coords.substring(coords.indexOf('°')+1, coords.indexOf(`'`)))
    const seconds = Number(coords.substring(coords.indexOf(`'`) + 1, coords.indexOf(`"`)))
    
    let decimalCoords = grades + minutes / 60 + seconds / 3600
    if (coords.toLowerCase().includes('w') || coords.toLowerCase().includes('s')) decimalCoords = decimalCoords * -1
    return decimalCoords
  }

  return (
    <div className="App">
      <Flex minHeight='100vh' width='full' align='center'
        justifyContent='center'
      >
        <Box
          maxWidth='450px'
          borderWidth={1}
          borderRadius={10}
          boxShadow='2xl'
          px={4}
          py={4}
          textAlign='center'
        >
          <Box my={8}>
              <Heading>Encontrar ciudades cercanas</Heading>
          </Box>
          <form>
            <FormControl isRequired mb={4}>
              <FormLabel>Latitud: </FormLabel>
              <Input
                name='latitude'
                placeholder="Ingresa la latidud"
                onBlur={checkForPrevious(latitude)}
              ></Input>
            </FormControl>

            <FormControl isRequired mb={4}>
              <FormLabel>Longitud: </FormLabel>
              <Input
                name='longitude'
                placeholder='Ingresa la longitud'
                onBlur={checkForPrevious(longitude)}
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
                    <NumberIncrementStepper/>
                    <NumberDecrementStepper/>
                  </NumberInputStepper>
              </NumberInput>
              
            </FormControl>

            <Button
              colorScheme = 'teal'
              isLoading={status}
              loadingText='Buscando ciudades'
              width='full'
              mt={4}
              onClick={latitude && longitude ? getData : null}
            >🔍 Buscar ciudades cercanas</Button>
          </form>

            <FormLabel mt={10}>Ciudades cercanas: </FormLabel>

            <InputGroup borderColor = {status ? 'teal' : ''}>
              <Input readOnly value={cities.map(city=>city.name.toUpperCase()).join(', ')} />
              <InputRightElement>
                <Tooltip
                  label={'Copiar al portapapeles'}
                  hasArrow
                  closeDelay={500}>
                  <Button onClick={onCopy}>
                    {hasCopied ? '✔' : '📋'}
                  </Button>
                </Tooltip>
              </InputRightElement>
            </InputGroup>

          <MapModal
            latitude={latitude}
            longitude={longitude}
            cities={cities}
            isDisabled={(!latitude || !longitude || !cities)}
            mt={4}
          />

        </Box>
      </Flex>
    </div>
  );
}

export default App;
