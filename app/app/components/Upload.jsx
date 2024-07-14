"use client";

import React, { useState } from "react";
import { AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { Center, chakra, ScaleFade, Text, VStack } from "@chakra-ui/react";

import { useFile } from "../hooks/FileContext";

const SingleUploadProof = ({
  size = "100px",
  rounded = "full",
}) => {
  const { setFileBytes, fileBytes } = useFile();
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileBytes(event.target.result);
        setUploadedFile(true);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return fileBytes
    ? (
      <>
        <Text>{`${fileBytes} bytes`}</Text>
        <CheckCircleIcon boxSize={8} color="green.500" />
      </>
    )
    : (
      <Center
        w={size}
        h={size}
        as={chakra.label}
        htmlFor="file"
        bg="whiteAlpha.500"
        border="1px dashed gray"
        rounded={rounded}
        cursor="pointer"
        overflow="hidden"
        position="relative"
      >
        <Center
          position="absolute"
          w="100%"
          h="100%"
          _hover={{ bg: "blackAlpha.600" }}
        >
          <VStack>
            <AddIcon />
            <Text>Upload</Text>
          </VStack>
        </Center>

        {uploadedFile && (
          <ScaleFade initialScale={0.9} in={uploadedFile !== null}>
            <Image
              w="100%"
              h={"100%"}
              src={URL.createObjectURL(uploadedFile)}
              alt="Uploaded"
              rounded={rounded}
            />
          </ScaleFade>
        )}

        <chakra.input
          required
          style={{ display: "none" }}
          type="file"
          id="file"
          name="file"
          onChange={handleFileChange}
        />
      </Center>
    );
};

export default SingleUploadProof;
