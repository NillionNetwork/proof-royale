"use client";

import { useState } from "react";
import {
  Box,
  Button,
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

import { ethers } from "ethers";
import { BsArrowUpRight } from "react-icons/bs";
import { FaChessKnight, FaDiceFive } from "react-icons/fa";
import { CgCardSpades } from "react-icons/cg";
import { LuGamepad2 } from "react-icons/lu";

import { FaEthereum } from "react-icons/fa";

import { BsHeart } from "react-icons/bs";
import { GiDeathSkull, GiRuleBook } from "react-icons/gi";
import { TbPigMoney } from "react-icons/tb";

import { FaPeopleGroup, FaPeopleRobbery } from "react-icons/fa6";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const duelFactoryAddress = "0xd3a129dbd8e3dbae175392d34d0fa30f2ba2a5bc";
const duelFactoryABI = [
  "function createDuel(string memory _title, string memory _achievement, uint256 _betSize, uint256 _expiryDate, address _verifier, address _defenderAddr, string memory _challengerUserID, string memory _defenderUserID) public payable returns (address)",
];
const ARBITRUM_SEPOLIA_CHAIN_ID = "0x66eee"; // Hexadecimal chain ID for Arbitrum Sepolia (505)

const checkAndSwitchNetwork = async () => {
  if (window.ethereum) {
    try {
      // Request to switch to the Arbitrum Sepolia network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARBITRUM_SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          // Try to add the Arbitrum Sepolia network if it's not available
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: ARBITRUM_SEPOLIA_CHAIN_ID,
              rpcUrl:
                "https://arb-sepolia.g.alchemy.com/v2/vCYo4htbu1PpUP5QQZ3sMgvVOBN2N9h9", // Update with your Infura project ID
            }],
          });
        } catch (addError) {
          console.error(
            "Failed to add the Arbitrum Sepolia network:",
            addError,
          );
        }
      } else {
        console.error("Could not switch to Arbitrum Sepolia:", switchError);
      }
    }
  }
};

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
  const { primaryWallet } = useDynamicContext();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inProgress, setInProgress] = useState(false);

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

  const submitContract = async () => {
    setInProgress(true);
    await checkAndSwitchNetwork(); // Ensure the correct network
    if (typeof window.ethereum !== "undefined") {
      const signer = await primaryWallet.connector.ethers?.getSigner();
      const provider = await primaryWallet.connector.ethers?.getWeb3Provider();
      const duelFactory = new ethers.Contract(
        duelFactoryAddress,
        duelFactoryABI,
        signer,
      );

      const title = gameValue;
      const achievement = gameTerms;
      const betSize = ethers.utils.parseEther(
        wagerValue,
      ); // 0.01 ETH
      const expiryDate = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days from now

      const verifier = "0xaEc75df67Db9467BE89d468edbc8C0D503B643C4";
      const defenderAddr = opponent;

      const challengerUserID = "player1";
      const defenderUserID = "player2";

      try {
        const txResponse = await duelFactory.createDuel(
          title,
          achievement,
          betSize,
          expiryDate,
          verifier,
          defenderAddr,
          challengerUserID,
          defenderUserID,
          { value: betSize },
        );
        const receipt = await txResponse.wait();
        console.log("Duel created:", receipt);
      } catch (error) {
        console.error("Error creating duel:", error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
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
                      onClick={submitContract}
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
                    return <option key={item}>{item}</option>;
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
