import { useEffect, useState } from "react";
import { Center, Container, Divider, Spinner, Text, VStack } from "@chakra-ui/react";
import NoteItem from "../components/NoteItem";
import { NoteResponse } from "../api/note";
import api from "../api";

const Notes = () => {
  const [isLoading, setLoading] = useState(false);
  const [notes, setNotes] = useState<NoteResponse[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);

      const res = await api.note.search();

      if (res.success) {
        setNotes(res.data as NoteResponse[]);
      } else {
        setNotes([]);
      }

      setLoading(false);
    };

    fetchNotes();
  }, []);

  const handleLike = (id: string) => {};

  return (
    <Container maxW="container.lg" my={{ base: 2, md: 10 }}>
      <Text fontSize="4xl">公開的筆記</Text>
      <Divider my={4} />

      <VStack spacing={4} align="start">
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          notes.map(note => <NoteItem key={note._id} data={note} onLike={handleLike} />)
        )}
      </VStack>
    </Container>
  );
};

export default Notes;
