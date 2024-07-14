"use client";

import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Img,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsArrowUpRight } from "react-icons/bs";
import { useRouter } from "next/navigation";

export function ProveGameCard() {
  const router = useRouter();

  return (
    <Center py={6}>
      <Box
        w="xs"
        rounded={"sm"}
        my={5}
        mx={[0, 5]}
        overflow={"hidden"}
        bg="white"
        border={"1px"}
        borderColor="black"
        boxShadow={useColorModeValue("6px 6px 0 black", "6px 6px 0 orange")}
        onClick={() => router.push("/prove")}
      >
        <Box h={"200px"} borderBottom={"1px"} borderColor="black">
          <Img
            src={"winner-4149321_1280.jpg"}
            roundedTop={"sm"}
            objectFit="cover"
            h="full"
            w="full"
            alt={"Blog Image"}
          />
        </Box>
        <Box p={4}>
          <Box
            bg="black"
            display={"inline-block"}
            px={2}
            py={1}
            color="white"
            mb={2}
          >
            <Text fontSize={"xs"} fontWeight="medium">
              REFEREE
            </Text>
          </Box>
          <Heading color={"black"} fontSize={"2xl"} noOfLines={1}>
            Report game results!
          </Heading>
          <Text color={"gray.500"} noOfLines={5}>
            You will upload the proof which will
            trigger a verification and release some or all of the funds
          </Text>
        </Box>
        <HStack borderTop={"1px"} color="black">
          <Flex
            p={4}
            alignItems="center"
            justifyContent={"space-between"}
            roundedBottom={"sm"}
            cursor={"pointer"}
            w="full"
          >
            <Text fontSize={"md"} fontWeight={"semibold"}>
              Report back
            </Text>
            <BsArrowUpRight />
          </Flex>
        </HStack>
      </Box>
    </Center>
  );
}
export function JoinGameCard() {
  const router = useRouter();
  return (
    <Center py={6}>
      <Box
        w="xs"
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
            src={"computer-6906848_1280.png"}
            roundedTop={"sm"}
            objectFit="cover"
            h="full"
            w="full"
            alt={"Blog Image"}
          />
        </Box>
        <Box p={4}>
          <Box
            bg="black"
            display={"inline-block"}
            px={2}
            py={1}
            color="white"
            mb={2}
          >
            <Text fontSize={"xs"} fontWeight="medium">
              FOLLOWER
            </Text>
          </Box>
          <Heading color={"black"} fontSize={"2xl"} noOfLines={1}>
            You need to ante up!
          </Heading>
          <Text color={"gray.500"} noOfLines={5}>
            Click here to add funds to the web3 contract so that you can compete
            for the prize pool!
          </Text>
        </Box>
        <HStack borderTop={"1px"} color="black">
          <Flex
            p={4}
            alignItems="center"
            justifyContent={"space-between"}
            roundedBottom={"sm"}
            cursor={"pointer"}
            w="full"
          >
            <Text fontSize={"md"} fontWeight={"semibold"}>
              Join now
            </Text>
            <BsArrowUpRight />
          </Flex>
        </HStack>
      </Box>
    </Center>
  );
}

export function NewGameCard() {
  const router = useRouter();

  return (
    <Center py={6}>
      <Box
        w="xs"
        rounded={"sm"}
        my={5}
        mx={[0, 5]}
        overflow={"hidden"}
        bg="white"
        border={"1px"}
        borderColor="black"
        boxShadow={useColorModeValue("6px 6px 0 black", "6px 6px 0 orange")}
        onClick={() => router.push("/newgame")}
      >
        <Box h={"200px"} borderBottom={"1px"} borderColor="black">
          <Img
            src={"gamer-6022003_1280.png"}
            roundedTop={"sm"}
            objectFit="cover"
            h="full"
            w="full"
            alt={"Blog Image"}
          />
        </Box>
        <Box p={4}>
          <Box
            bg="black"
            display={"inline-block"}
            px={2}
            py={1}
            color="white"
            mb={2}
          >
            <Text fontSize={"xs"} fontWeight="medium">
              STARTER
            </Text>
          </Box>
          <Heading color={"black"} fontSize={"2xl"} noOfLines={1}>
            Get this party started!
          </Heading>
          <Text color={"gray.500"} noOfLines={5}>
            You will specify the contest criteria that creates the web3 contract
            and stake some funds
          </Text>
        </Box>
        <HStack borderTop={"1px"} color="black">
          <Flex
            p={4}
            alignItems="center"
            justifyContent={"space-between"}
            roundedBottom={"sm"}
            cursor={"pointer"}
            w="full"
          >
            <Text fontSize={"md"} fontWeight={"semibold"}>
              Start now
            </Text>
            <BsArrowUpRight />
          </Flex>
        </HStack>
      </Box>
    </Center>
  );
}
