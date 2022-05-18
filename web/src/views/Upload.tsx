import { useContext, useRef, useState, useTransition } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import HashtagPicker from "../components/HashtagPicker";
import { CgFileAdd } from "react-icons/cg";
import UploadBox from "../components/UploadBox";
import { ApiContext } from "../providers/ApiProvider";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const api = useContext(ApiContext);
  const navigate = useNavigate();
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");
  const [noteId, setNoteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File>();
  const [isUploading, setUploading] = useState(false);
  const contentTabRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    startTransition(() => {
      setContent(e.target.value);
    });
  };

  const handleUpload = async () => {
    if (file) {
      setUploading(true);

      const res = await api.note.detect(file);
      console.log(res);
      console.log(contentRef, contentTabRef);

      if (res.success && res.data) {
        setNoteId(res.data.noteId);
        setContent(res.data.content);

        if (contentRef.current) {
          contentRef.current.value = res.data.content;
        }

        contentTabRef.current?.click();
      }

      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const title = e.currentTarget.elements.namedItem("title") as HTMLInputElement;

    if (noteId) {
      const res = await api.note.update(noteId, title.value, hashtags, content);

      if (res.success && res.data) {
        return navigate(`/note/${res.data._id}`);
      }
    } else {
      const res = await api.note.create(title.value, hashtags, content);

      if (res.success && res.data) {
        return navigate(`/note/${res.data.noteId}`);
      }
    }

    console.log(title.value, hashtags, file);
  };

  return (
    <Container maxW="container.lg" my={{ base: 2, md: 10 }}>
      <Text fontSize="4xl">
        <Icon as={CgFileAdd} w={8} h={8} mr={2} />
        上傳筆記
      </Text>
      <Divider my={4} />
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel htmlFor="title">標題</FormLabel>
            <Input id="title" type="text" isRequired maxLength={40} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="hashtags">標籤</FormLabel>
            <HashtagPicker onChange={setHashtags} />
          </FormControl>
          <Divider />
          <FormControl>
            <Tabs variant="soft-rounded">
              <TabList>
                <Tab _hover={{ bg: "gray.100" }}>辨識檔案</Tab>
                <Tab _hover={{ bg: "gray.100" }} ref={contentTabRef}>
                  內文
                </Tab>
                <Tab
                  _hover={{ bg: "gray.100" }}
                  isDisabled={isPending || !content}
                  _disabled={{ color: "gray.400" }}
                >
                  預覽
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box minH="40vh">
                    <UploadBox onChange={setFile} isUploading={isUploading} />
                    <Button
                      isFullWidth
                      mt={10}
                      onClick={handleUpload}
                      isDisabled={!file || isUploading}
                    >
                      辨識檔案
                    </Button>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Textarea
                    id="content"
                    onChange={handleContentChange}
                    minH="40vh"
                    ref={contentRef}
                  />
                </TabPanel>
                <TabPanel>
                  <Box borderRadius="3xl" border="1px" borderColor="gray.200" p={4} minH="40vh">
                    <ReactMarkdown children={content} components={ChakraUIRenderer()} />
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </FormControl>
          <Button type="submit" isDisabled={!content}>
            上傳
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default Upload;
