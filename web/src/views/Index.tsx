import { Box, Button, Center, Divider, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";

const Index = () => {
  return (
    <VStack>
      <Center
        bgImage="/static/1577802868.jpg"
        bgRepeat="no-repeat"
        bgSize="cover"
        bgPosition="center"
        w="100%"
        h={{ base: "50vh", md: "70vh" }}
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
      <Flex w="100%" h="50vh" justifyContent="center">
        <HStack spacing={4}>
          <Flex h="20vh" w="45vw" justifyContent="space-between">
            <VStack spacing={4} alignItems="left" w="60%">
              <Text fontSize="2xl">上傳您的筆記</Text>
              <Divider />
              <Text>上傳你的筆記，開啟筆記共享之旅！</Text>
              <Button>立即上傳</Button>
            </VStack>
            <Image src="/static/1577802868.jpg" h="auto" />
          </Flex>
          <Flex h="20vh" w="45vw" justifyContent="space-between">
            <VStack spacing={4} alignItems="left" w="60%">
              <Text fontSize="2xl">觀看大家的筆記</Text>
              <Divider />
              <Text>點選我要觀看，參考更多人的筆記，進行多元交流！</Text>
              <Button>立即上傳</Button>
            </VStack>
            <Image src="/static/1577802868.jpg" h="auto" />
          </Flex>
        </HStack>
      </Flex>
    </VStack>
  );
};

export default Index;
