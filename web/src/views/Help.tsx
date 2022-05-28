import { Container, Text, Icon, Divider, VStack, Box } from "@chakra-ui/react";
import { FiHelpCircle } from "react-icons/fi";
import Footer from "../components/Footer";

const QA = [
  {
    question: "為什麼筆記無法上傳？",
    answer: "請確認您所選擇的檔案是PNG、JPG等影像檔案，且檔案大小不超過16MB。",
  },
  {
    question: "筆記文字辨識有誤？",
    answer: "辨識完成後可以在內文處修改辨識結果",
  },
  {
    question: '更換裝置時"我的最愛"會消失嗎？',
    answer: "我們會將您的最愛筆記儲存於我們的伺服器上，您可以隨時跨裝置查看。",
  },
  {
    question: "還需要幫助嗎？",
    answer: "歡迎與我們聯絡！ Email: d0xxxxxx@o365.fcu.edu.tw",
  },
];

const Help = () => {
  return (
    <Container maxW="container.lg" my={{ base: 2, md: 10 }} minH="100vh">
      <Text fontSize="4xl" justifyContent="center">
        <Icon as={FiHelpCircle} w={8} h={8} mr={2} />
        幫助中心
      </Text>
      <Divider my={4} />
      <VStack gap={8} textAlign="left">
        {QA.map(({ question, answer }) => (
          <Box w="100%">
            <Text fontSize="xl">{question}</Text>
            <Text>{answer}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Help;
