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

const App = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    axios.get(
      "https://n70y7tgezh.execute-api.eu-west-1.amazonaws.com/testnet-1/user/player1",
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
    <ChakraProvider>
      <Box
        maxW="md"
        mx="auto"
        mt="10"
        p="5"
        borderWidth="1px"
        borderRadius="lg"
      >
        <Heading mb="4" textAlign="center">Gamer Stats</Heading>
        <Text fontSize="xl">Username: {userInfo.username}</Text>
        <Text fontSize="xl">Score: {userInfo.score}</Text>
        <Heading size="md" mt="4">Achievements</Heading>
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
    </ChakraProvider>
  );
};

export default App;
