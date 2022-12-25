import { Avatar, HStack, Text } from "@chakra-ui/react";
import React from "react";

const Message = ({ text, uri, user = "other" }) => {
  return (
    <HStack
      bg={user === "me" ? "whatsapp.50" : "gray.100"}
      alignSelf={user === "me" ? "flex-end" : "flex-start"}
      borderRadius={"full"}
      paddingX={4}
      paddingY={3}
    >
      <Text>{text}</Text>
      {user === "other" ? <Avatar src="uri" /> : ""}
    </HStack>
  );
};

export default Message;
