import React, { useEffect, useState } from "react";
import {
  Box,
  ChakraProvider,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import axios from "axios";

const GamerStats = () => {
  const [userInfo, setUserInfo] = useState(null);
  const params = new URLSearchParams(window.location.search);
  const username = params.get("username");

  useEffect(() => {
    axios.get(
      `https://n70y7tgezh.execute-api.eu-west-1.amazonaws.com/testnet-1/user/${username}`,
    )
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (!userInfo) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box
      maxW="md"
      mx="auto"
      mt="10"
      p="5"
      borderWidth="1px"
      borderRadius="lg"
    >
      <Heading mb="4" textAlign="center">Gamer Stats</Heading>
      <Text fontSize="xl">Username: {userInfo.user}</Text>
      <Text fontSize="xl">Score: {userInfo.score}</Text>
      <Heading size="md" mt="4">Achievements</Heading>
      <Text fontSize="md">completed {userInfo.percentage}</Text>
      <List spacing={3} mt="2">
        {userInfo.achievements.map((achievement, index) => (
          <ListItem
            key={index}
            border="1px"
            borderColor="gray.200"
            p="2"
            borderRadius="md"
          >
            {achievement}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const App = () => {
  return (
    <ChakraProvider>
      <GamerStats />
    </ChakraProvider>
  );
};
export default App;
