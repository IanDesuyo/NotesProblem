import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface IndexCard1Props {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
}

const IndexCard1 = (props: IndexCard1Props) => {
  return (
    <Flex
      h="20vh"
      w={{ base: "90vw", md: "40vw" }}
      bg="white"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="gray.200"
      overflow="hidden"
    >
      <Flex direction="column" justifyContent="space-between" h="100%" w="100%" p={4}>
        <Box>
          <Text fontSize="2xl">{props.title}</Text>
          <Text>{props.description}</Text>
        </Box>
        <Button isFullWidth as={Link} to={props.buttonLink}>
          {props.buttonText}
        </Button>
      </Flex>
      <Image src={props.imageSrc} h="100%" />
    </Flex>
  );
};

export default IndexCard1;
