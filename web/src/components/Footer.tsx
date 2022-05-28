import { Box, Flex, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" p={10} w="100%" mt="auto">
      <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" w="100%">
        <Box fontSize="sm">
          <Text>地址：407 102台中市西屯區文華路100號</Text>
          <Text
            onClick={() => window.open("tel:+886900000000")}
            _hover={{ cursor: "pointer", textDecoration: "underline" }}
          >
            電話：0900000000
          </Text>
          <Text
            onClick={() => window.open("mailto:d0xxxxxx@o365.fcu.edu.tw")}
            _hover={{ cursor: "pointer", textDecoration: "underline" }}
          >
            聯絡信箱：d0xxxxxx@o365.fcu.edu.tw
          </Text>
        </Box>
        <Text textAlign="center" fontFamily="jf openhuninn" fontSize="xl" alignSelf="flex-end">
          © 2022 Notesproblem
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
