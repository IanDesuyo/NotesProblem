import { Box, Center, Flex, Stack, Text, VStack, Wrap } from "@chakra-ui/react";
import Footer from "../components/Footer";
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
    title: "下載筆記",
    description: "查看原本的筆記，下載影像檔案！",
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
      <Footer />
    </VStack>
  );
};

export default Index;
