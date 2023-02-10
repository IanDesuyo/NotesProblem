import { useContext, useEffect, useState } from "react";
import {
  Container,
  Text,
  Divider,
  Spinner,
  HStack,
  Tag,
  Flex,
  Box,
  Button,
  Icon,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { NoteResponse } from "../providers/ApiProvider.d";
import { FaRegHeart, FaHeart, FaRegFileAudio } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import DownloadButton from "../components/DownloadButton";
import { ApiContext } from "../providers/ApiProvider";
import { AccountContext } from "../providers/AccountProvider";
import AudioButton from "../components/AudioButton";
import WordCloud from "../components/WordCloud";

const Note = () => {
  const account = useContext(AccountContext);
  const api = useContext(ApiContext);
  const params = useParams();
  const [isLoading, setLoading] = useState(false);
  const [isLikePending, setLikePending] = useState(false);
  const [note, setNote] = useState<NoteResponse>();
  const [wordCloud, setWordCloud] = useState<[string, number][]>([]);

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);

      if (!params.id) {
        return;
      }

      const res = await api.note.get(params.id);

      if (res.success && res.data) {
        setNote({
          ...res.data,
          content: res.data.content.replace(/\n/g, "\n\n"),
        });

        const wordCloud: any = {};
        res.data.content
          .replace(/\n/g, " ")
          .replace(/[\d]./g, "")
          .split(" ")
          .filter(word => word.length > 0)
          .forEach(word => {
            if (wordCloud[word]) {
              wordCloud[word] += 1;
            } else {
              wordCloud[word] = 1;
            }
          });
        setWordCloud(Object.entries(wordCloud));
      }

      setLoading(false);
    };

    fetchNote();
  }, [api.note, params.id]);

  const handleLike = async () => {
    if (!note) {
      return;
    }

    setLikePending(true);

    const res = await api.note.like(note._id, !note.like);

    if (res.success && res.data) {
      setNote({
        ...note,
        like: res.data.like,
        likes: (note.likes || 0) + (res.data.like ? 1 : -1),
      });
    }

    setLikePending(false);
  };

  return (
    <Container maxW="container.lg" my={{ base: 2, md: 10 }}>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : note ? (
        <>
          <Flex justifyContent="space-between">
            <Box>
              <Text fontSize="4xl">{note.title}</Text>
              <HStack spacing={2} mt={2}>
                {note.hashtags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </HStack>
              <HStack spacing={2} mt={4}>
                <Text>By</Text>
                <Avatar name={note.author.displayName} size="xs" />
                <Text>{note.author.displayName}</Text>
              </HStack>
            </Box>
            <HStack alignItems="baseline" spacing={1}>
              <Text>{note.likes || 0}</Text>
              <Button
                variant="ghost"
                rounded="full"
                w="0"
                isDisabled={!account.isLoggedIn || isLikePending}
                onClick={handleLike}
              >
                <Icon as={note.like ? FaHeart : FaRegHeart} />
              </Button>
            </HStack>
          </Flex>
          <Divider my={4} />
          <Box textOverflow="scroll" mb={10}>
            <ReactMarkdown children={note.content} components={ChakraUIRenderer()} />
          </Box>
          {note.aiComment && (
            <Box borderRadius="3xl" bg="gray.100" mb={10} p={4}>
              <Text fontSize="xl" mb={2}>
                AI 註解
              </Text>
              <Text>{note.aiComment}</Text>
            </Box>
          )}
          <Box w="100%" h={64} bg="gray.100" borderRadius="3xl" mb={10} p={4}>
            <WordCloud
              words={wordCloud}
              options={{
                weightFactor: function (s) {
                  return (Math.pow(s, 1.1) / 128) * window.innerWidth;
                },
                color: "random-light",
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
              id="main-word-cloud"
              useDiv
            />
          </Box>
          <Flex my={4} gap={6} alignItems="center">
            {note.originalFile && <DownloadButton path={note.originalFile} />}
            <AudioButton noteId={note._id} path={note.audio} />
          </Flex>
        </>
      ) : (
        <Text>Not found</Text>
      )}
    </Container>
  );
};

export default Note;
