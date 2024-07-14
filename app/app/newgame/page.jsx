"use client";

import { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  chakra,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  HStack,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { BsArrowUpRight } from "react-icons/bs";
import { FaChessKnight, FaDiceFive } from "react-icons/fa";
import { CgCardSpades } from "react-icons/cg";
import { LuGamepad2 } from "react-icons/lu";

import { FaEthereum } from "react-icons/fa";

import { BsHeart } from "react-icons/bs";
import { GiDeathSkull, GiRuleBook } from "react-icons/gi";
import { TbPigMoney } from "react-icons/tb";

import { FaPeopleGroup, FaPeopleRobbery } from "react-icons/fa6";

function StatsCard(props) {
  const { title, stat, icon, wager } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={"5"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded={"lg"}
    >
      <Flex justifyContent={"space-between"}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={"2xl"} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={"medium"}>
            {stat}
          </StatNumber>
          <StatNumber
            fontSize={"sm"}
            whiteSpace="normal"
            wordBreak="break-word"
          >
            {wager}
          </StatNumber>
        </Box>
        <Box
          my={"auto"}
          color={useColorModeValue("gray.800", "gray.200")}
          alignContent={"center"}
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
}

export default function NewGame() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [gameTerms, setGameTerms] = useState();
  const handleGameTerms = (event) => setGameTerms(event.target.value);

  const [gameValue, setGameValue] = useState();
  const handleGame = (event) => {
    setGameValue(event.target.value);
    setGameTerms(achievementMap[event.target.value][0]);
  };

  const [opponent, setOpponent] = useState("0x0000000000000000");
  const handleOpponent = (event) => setOpponent(event.target.value);

  const [wagerValue, setWagerValue] = useState(0.000025);
  const handleWager = (event) => setWagerValue(event);

  const [expiryValue, setExpiryValue] = useState(0);
  const handleExpiry = (event) => setExpiryValue(event.target.value);

  const achievementMap = {
    "Online: DEMO": [
      "Percentage of all achievements",
    ],
    "Online: chess.com": [
      "Highest FIDE",
      "Game Winner",
      "Game Loser",
    ],
    "Steam: Portal 2": [
      "Iron Grip",
      "Talent Show",
    ],
    "Online: lichess.org": [
      "Highest FIDE",
      "Game Winner",
      "Game Loser",
    ],
  };

  const ConfirmModal = () => {
    return (
      <>
        <Modal
          onClose={onClose}
          isOpen={isOpen}
          motionPreset="slideInBottom"
          size="4xl"
          isCentered
        >
          <ModalOverlay
            bg="blackAlpha.300"
            backdropFilter="blur(10px) hue-rotate(90deg)"
          />
          <ModalContent
            bg="white"
            color="black"
            border={"1px"}
            borderColor="black"
            boxShadow={useColorModeValue(
              "6px 6px 0 black",
              "6px 6px 0 orange",
            )}
          >
            <Stack
              textAlign={"center"}
              spacing={{ base: 8, md: 14 }}
            >
              <Box
                rounded={"sm"}
                my={5}
                mx={[0, 5]}
                overflow={"hidden"}
              >
                <ModalCloseButton />
                <ModalBody>
                  <Box
                    maxW="7xl"
                    mx={"auto"}
                    pt={5}
                    px={{ base: 2, sm: 12, md: 17 }}
                  >
                    <chakra.h1
                      textAlign={"center"}
                      fontSize={"4xl"}
                      py={10}
                      fontWeight={"bold"}
                    >
                      Create 2-player Duel
                    </chakra.h1>
                    <SimpleGrid
                      columns={{ base: 1, md: 3 }}
                      spacing={{ base: 5, lg: 8 }}
                    >
                      <StatsCard
                        title={"Game"}
                        stat={gameValue}
                        icon={<LuGamepad2 size={"3em"} />}
                      />
                      <StatsCard
                        title={"Terms"}
                        stat={gameTerms}
                        icon={<GiRuleBook size={"3em"} />}
                      />
                      <StatsCard
                        title={"Wager"}
                        stat={`---`}
                        wager={`${wagerValue} ETH`}
                        icon={<TbPigMoney size={"3em"} />}
                      />
                    </SimpleGrid>
                  </Box>
                  <Divider mt={10} />
                  <FormControl p={15} as="fieldset">
                    <FormLabel as="legend">
                      Opponent ETH Wallet Address
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FaEthereum color="gray.300" />
                      </InputLeftElement>
                      <Input
                        variant="outline"
                        type="opponent"
                        placeholder={opponent}
                        onBlur={handleOpponent}
                      />
                    </InputGroup>
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <HStack borderTop={"1px"} w={"full"} color="black">
                    <Flex
                      p={4}
                      alignItems="center"
                      justifyContent={"space-between"}
                      roundedBottom={"sm"}
                      cursor={"pointer"}
                      w="full"
                      onClick={() => null}
                    >
                      <Text fontSize={"md"} fontWeight={"semibold"}>
                        Submit
                      </Text>
                      <BsArrowUpRight />
                    </Flex>
                  </HStack>
                </ModalFooter>
              </Box>
            </Stack>
          </ModalContent>
        </Modal>
      </>
    );
  };

  return (
    <Container maxW={"3xl"}>
      <ConfirmModal />
      <Stack
        textAlign={"center"}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <Center py={6}>
          <Box
            w="3xl"
            rounded={"sm"}
            my={5}
            mx={[0, 5]}
            overflow={"hidden"}
            bg="white"
            border={"1px"}
            borderColor="black"
            boxShadow={useColorModeValue("6px 6px 0 black", "6px 6px 0 orange")}
          >
            <Box h={"200px"} borderBottom={"1px"} borderColor="black">
              <Img
                src={"gamer-6022003_1280.png"}
                roundedTop={"sm"}
                objectFit="cover"
                h="full"
                w="full"
                alt={"Gamer Image"}
              />
            </Box>
            <Box p={4}>
              <Heading color={"black"} fontSize={"2xl"} noOfLines={1}>
                Get this party started!
              </Heading>
            </Box>
            <VStack borderTop={"1px"} p={5} color="black">
              <FormControl as={GridItem} colSpan={[6, 3]}>
                <FormLabel
                  htmlFor="game"
                  fontWeight="md"
                >
                  Game
                </FormLabel>
                <Select
                  id="game"
                  name="game"
                  bg="white"
                  color="black"
                  autoComplete="game"
                  placeholder="Select game"
                  focusBorderColor="orange.400"
                  size="sm"
                  variant="outline"
                  w="full"
                  rounded="md"
                  onChange={handleGame}
                >
                  <option>Online: DEMO</option>
                  <option>Online: chess.com</option>
                  <option>Steam: Portal 2</option>
                  <option>Online: lichess.org</option>
                </Select>
              </FormControl>

              <FormControl as={GridItem} colSpan={6}>
                <FormLabel
                  htmlFor="achievement"
                  fontWeight="md"
                  mt="2%"
                >
                  Choose Achievement
                </FormLabel>
                <Select
                  type="text"
                  name="achievement"
                  id="achievement"
                  focusBorderColor="brand.400"
                  w="full"
                  rounded="md"
                  onChange={handleGameTerms}
                >
                  {gameValue && achievementMap[gameValue].map((item) => {
                    return <option>{item}</option>;
                  })}
                </Select>
              </FormControl>

              <FormControl as={GridItem} colSpan={[6, 6, null, 2]}>
                <FormLabel
                  htmlFor="asset"
                  fontWeight="md"
                  mt="2%"
                >
                  Choose Asset
                </FormLabel>
                <Select
                  type="text"
                  name="asset"
                  id="asset"
                  focusBorderColor="brand.400"
                  shadow="sm"
                  size="sm"
                  w="full"
                  rounded="md"
                >
                  <option>ETH</option>
                </Select>
              </FormControl>

              <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
                <FormLabel
                  htmlFor="wager"
                  fontWeight="md"
                  mt="2%"
                >
                  Wager Amount
                </FormLabel>
                <Flex>
                  <NumberInput
                    defaultValue={15.040002}
                    precision={18}
                    w={"100%"}
                    step={0.0005}
                    onChange={handleWager}
                  >
                    <NumberInputField
                      onChange={handleWager}
                    />
                  </NumberInput>
                </Flex>
              </FormControl>

              <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
                <FormLabel
                  htmlFor="expiry"
                  fontSize="sm"
                  fontWeight="md"
                  mt="2%"
                >
                  Expires in...
                </FormLabel>
                <RadioGroup defaultValue="2">
                  <Stack spacing={5} direction="row">
                    <Radio colorScheme="orange" value="1">
                      1 week
                    </Radio>
                    <Radio colorScheme="orange" value="2">
                      1 month
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </VStack>
            <HStack borderTop={"1px"} color="black">
              <Flex
                p={4}
                alignItems="center"
                justifyContent={"space-between"}
                roundedBottom={"sm"}
                w="full"
              >
                <Button
                  leftIcon={<FaPeopleRobbery />}
                  colorScheme="orange"
                  variant="solid"
                  onClick={() => onOpen()}
                >
                  Create 2-player Duel
                </Button>
                <FaChessKnight color="pink" />
                <CgCardSpades color="brown" />
                <FaDiceFive color="pink" />
                <BsHeart color="brown" />
                <GiDeathSkull color="pink" />
                <Button
                  leftIcon={<FaPeopleGroup />}
                  colorScheme="orange"
                  variant="solid"
                >
                  Create Tournament
                </Button>
              </Flex>
            </HStack>
          </Box>
        </Center>
      </Stack>
    </Container>
  );
}