"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Center,
  chakra,
  Container,
  createIcon,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  HStack,
  Icon,
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
import { ApiPromise, initialize, signedExtensions, types } from "avail-js-sdk";
import { ArrowForwardIcon } from "@chakra-ui/icons";

import { BsArrowUpRight } from "react-icons/bs";
import { FaChessKnight, FaDiceFive } from "react-icons/fa";
import { CgCardSpades } from "react-icons/cg";
import { LuGamepad2 } from "react-icons/lu";

import { FaEthereum } from "react-icons/fa";

import { BsHeart } from "react-icons/bs";
import { GiDeathSkull, GiRuleBook } from "react-icons/gi";
import { TbPigMoney } from "react-icons/tb";

import { FaPeopleGroup, FaPeopleRobbery } from "react-icons/fa6";

import Upload from "../components/Upload";
import { useFile } from "../hooks/FileContext";

export default function ProvePage() {
  const { fileBytes } = useFile();

  return (
    <Container maxW={"3xl"}>
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
                src={"winner-4149321_1280.jpg"}
                roundedTop={"sm"}
                objectFit="cover"
                h="full"
                w="full"
                alt={"Gamer Image"}
              />
            </Box>
            <Box p={4}>
              <Heading color={"black"} fontSize={"2xl"} noOfLines={1}>
                Report game results!
              </Heading>
            </Box>
            <VStack borderTop={"1px"} p={5} color="black">
              <Heading color={"brown"} fontSize={"md"} noOfLines={1}>
                Step #1
              </Heading>
              <Text color={"brown"}>
                Select the TLSNotary file that you obtained using the Proof
                Royal browser extension
              </Text>
              <Box>
                {fileBytes
                  ? (
                    <Heading color={"green"} fontSize={"2xl"} noOfLines={1}>
                      File uploaded successfully!
                    </Heading>
                  )
                  : <Upload />}
              </Box>
            </VStack>
            <HStack borderTop={"1px"} color="black">
              <Flex
                p={4}
                alignItems="center"
                justifyContent={"space-between"}
                roundedBottom={"sm"}
                w="full"
              >
                <FaChessKnight color="pink" />
                <CgCardSpades color="brown" />
                <FaDiceFive color="pink" />
                <BsHeart color="brown" />
                <GiDeathSkull color="pink" />
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  colorScheme="orange"
                  variant="solid"
                  isDisabled={!fileBytes}
                >
                  Next
                </Button>
              </Flex>
            </HStack>
          </Box>
        </Center>
      </Stack>
    </Container>
  );
}
