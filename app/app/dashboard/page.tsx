"use client";
import {
  Box,
  Button,
  Center,
  Container,
  createIcon,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

import { ApiPromise, initialize, signedExtensions, types } from "avail-js-sdk";
import { JoinGameCard, NewGameCard, ProveGameCard } from "../components/cards";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export default function MePage() {
  const { primaryWallet } = useDynamicContext();
  return (
    <Container maxW={"3xl"}>
      <VStack
        textAlign={"center"}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <HStack p={15}>
          <NewGameCard />
          <JoinGameCard />
          <ProveGameCard />
        </HStack>
        <Button
          leftIcon={<CloseIcon />}
          colorScheme="pink"
          variant="solid"
          onClick={() => primaryWallet?.connector.endSession()}
        >
          Logout
        </Button>
      </VStack>
    </Container>
  );
}
