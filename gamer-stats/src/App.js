import React, { useEffect, useState } from "react";
import {
  Box,
  ChakraProvider,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';
import axios from "axios";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const query = useQuery();
  const username = query.get("username");

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
    </ChakraProvider>
  );
};

export default App;
