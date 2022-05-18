import { Box, Center, Flex, Stack, Text, VStack, Wrap } from "@chakra-ui/react";
import IndexCard1 from "../components/IndexCard1";

const CARD1_ITEMS = [
  {
    title: "上傳您的筆記",
    description: "上傳你的筆記，開啟筆記共享之旅！",
    buttonText: "我要上傳",
    buttonLink: "/upload",
    imageSrc: "/static/1577802868.jpg",
  },
  {
    title: "觀看大家的筆記",
    description: "​參考更多人的筆記，進行多元交流！",
    buttonText: "我要觀看",
    buttonLink: "/notes",
    imageSrc: "/static/1577802868.jpg",
  },
  {
    title: "語音朗讀",
    description: "將最佳筆記朗讀出來！",
    buttonText: "查看筆記",
    buttonLink: "/notes",
    imageSrc: "/static/1577802868.jpg",
  },
  {
    title: "筆記翻譯",
    description: "將筆記轉換成多國語言， 讓多元學習更容易",
    buttonText: "查看筆記",
    buttonLink: "/notes",
    imageSrc: "/static/1577802868.jpg",
  },
];

const Index = () => {
  return (
    <VStack spacing={0}>
      <Center
        bgImage="/static/1577802868.jpg"
        bgRepeat="no-repeat"
        bgSize="cover"
        bgPosition="center"
        w="100%"
        h={{ base: "50vh", md: "75vh" }}
      >
        <Box textAlign="center">
          <Text fontFamily="jf openhuninn" fontSize={{ base: "4xl", md: "7xl" }} color="white">
            筆話 Notesproblem
          </Text>
          <Text fontFamily="jf openhuninn" fontSize={{ base: "2xl", md: "4xl" }} color="#b5aaf6">
            Notesproblem → No Problem！
          </Text>
        </Box>
      </Center>

      <Box bg="#cbcbe1" w="100%" minH={{ base: "auto", md: "50vh" }} py={20}>
        <Text textAlign="center" fontFamily="jf openhuninn" fontSize={{ base: "3xl", md: "4xl" }}>
          我們可以做到什麼？
        </Text>
        <Wrap spacing={6} justify="center" p={10}>
          {CARD1_ITEMS.map((item, index) => (
            <IndexCard1 key={index} {...item} />
          ))}
        </Wrap>
      </Box>
      <Box as="footer" p={10} w="100%">
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
    </VStack>
  );
};

export default Index;
