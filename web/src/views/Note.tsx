import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { NoteResponse } from "../api/note";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import api from "../api";
import DownloadButton from "../components/DownloadButton";

const Note = () => {
  const params = useParams();
  const [isLoading, setLoading] = useState(false);
  const [note, setNote] = useState<NoteResponse>();

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
      }

      setLoading(false);
    };

    fetchNote();
  }, [params.id]);

  return (
    <Container maxW="container.lg" my={{ base: 2, md: 10 }}>
      {isLoading ? (
        <Spinner />
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
            <HStack alignItems="start">
              <Button variant="ghost" rounded="full" w="0">
                <Icon as={FaRegHeart} size="1xl" />
              </Button>
            </HStack>
          </Flex>
          <Divider my={4} />
          <ReactMarkdown children={note.content} components={ChakraUIRenderer()} />
          <Flex my={4}>
            <DownloadButton path={note.originalFile} />
          </Flex>
        </>
      ) : (
        <Text>Not found</Text>
      )}
    </Container>
  );
};

export default Note;
