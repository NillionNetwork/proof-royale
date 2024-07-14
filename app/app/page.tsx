"use client";

import { DynamicWidget } from "../lib/dynamic";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

import { Image } from "@chakra-ui/react";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CloseIcon, ExternalLinkIcon } from "@chakra-ui/icons";

export default function Main() {
  const { primaryWallet } = useDynamicContext();

  return (
    <>
      <Container maxW={"3xl"}>
        <VStack
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Center>
            <Image
              boxSize="450px"
              src="/logo.png"
              alt="logo"
            />
          </Center>
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Show Off and Earn Big with Your Gaming Achievements!
          </Heading>

          <DynamicWidget />
          <Button
            rightIcon={<ExternalLinkIcon />}
            colorScheme="orange"
            variant="outline"
            onClick={() => null}
          >
            Docs
          </Button>

          {primaryWallet && (
            <>
              <Text as={"span"} color={"orange.400"}>
                {primaryWallet.address}:{" "}
                {primaryWallet.connected ? "Connected" : "Not connected"}
              </Text>
              <Button
                leftIcon={<CloseIcon />}
                colorScheme="pink"
                variant="solid"
                onClick={() => primaryWallet?.connector.endSession()}
              >
                Logout
              </Button>
            </>
          )}
        </VStack>
      </Container>
    </>
  );
}
