import { useContext, useEffect, useState } from "react";
import {
  Button,
  Center,
  Container,
  Divider,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import NoteItem from "../components/NoteItem";
import { CgNotes } from "react-icons/cg";
import { NoteResponse } from "../providers/ApiProvider.d";
import { ApiContext } from "../providers/ApiProvider";
import { ArrowBackIcon, ArrowForwardIcon, SearchIcon } from "@chakra-ui/icons";

const Notes = () => {
  const api = useContext(ApiContext);
  const [isLoading, setLoading] = useState(false);
  const [isLikePending, setLikePending] = useState(false);
  const [notes, setNotes] = useState<NoteResponse[]>([]);
  const [search, setSearch] = useState({ text: "", page: 0 });

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);

      const res = await api.note.search(
        search.text.length > 0 ? search.text : undefined,
        search.page
      );

      if (res.success) {
        setNotes(res.data as NoteResponse[]);
      } else {
        setNotes([]);
      }

      setLoading(false);
    };

    fetchNotes();
  }, [api.note, search]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const searchText = e.currentTarget.elements.namedItem("searchText") as HTMLInputElement;

    if (search.text !== searchText.value) {
      setSearch({ text: searchText.value, page: 0 });
    }
  };

  const handleLike = async (id: string, like: boolean) => {
    setLikePending(true);

    const res = await api.note.like(id, like);

    if (res.success && res.data) {
      const note = notes.find(n => n._id === id);

      if (note) {
        note.like = res.data.like;
        note.likes = (note.likes || 0) + (like ? 1 : -1);
      }

      setNotes(notes);
    }

    setLikePending(false);
  };

  return (
    <Container maxW="container.lg" my={{ base: 2, md: 10 }}>
      <Text fontSize="4xl" justifyContent="center">
        <Icon as={CgNotes} w={8} h={8} mr={2} />
        公開的筆記
      </Text>
      <Divider my={4} />
      <form onSubmit={handleSearch}>
        <InputGroup mb={2}>
          <Input placeholder="搜尋筆記" id="searchText" type="text" />
          <InputRightElement>
            <Button variant="ghost" type="submit">
              <Icon as={SearchIcon} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          <VStack spacing={4} align="start">
            {notes.map(note => (
              <NoteItem
                key={note._id}
                data={note}
                onLike={handleLike}
                isLikePending={isLikePending}
              />
            ))}
          </VStack>
          <HStack spacing={2} justifyContent="center" mt={10}>
            {search.page > 0 && (
              <Button
                variant="outline"
                onClick={() => setSearch(prev => ({ ...prev, page: prev.page - 1 }))}
                leftIcon={<Icon as={ArrowBackIcon} />}
              >
                {search.page}
              </Button>
            )}
            <Text>Page {search.page + 1}</Text>
            {notes.length === 10 && (
              <Button
                variant="outline"
                onClick={() => setSearch(prev => ({ ...prev, page: prev.page + 1 }))}
                leftIcon={<Icon as={ArrowForwardIcon} />}
              >
                {search.page + 2}
              </Button>
            )}
          </HStack>
        </>
      )}
    </Container>
  );
};

export default Notes;
