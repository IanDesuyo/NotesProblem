import { useContext, useEffect, useState } from "react";
import { Center, Container, Divider, Icon, Spinner, Text, VStack } from "@chakra-ui/react";
import { AccountContext } from "../../providers/AccountProvider";
import { ApiContext } from "../../providers/ApiProvider";
import { NoteResponse } from "../../providers/ApiProvider.d";
import NoteItem from "../../components/NoteItem";
import { CgNotes } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const UserLikes = () => {
  const account = useContext(AccountContext);
  const api = useContext(ApiContext);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [notes, setNotes] = useState<NoteResponse[]>([]);

  useEffect(() => {
    if (!account.isLoggedIn) {
      return navigate("/login?next=/user/me/likes");
    }

    const fetchNotes = async () => {
      setLoading(true);

      const res = await api.account.likes();

      if (res.success) {
        setNotes(res.data as NoteResponse[]);
      }

      setLoading(false);
    };

    fetchNotes();
  }, [account.isLoggedIn, api.account, navigate]);

  return (
    <Container maxW="container.lg" my={{ base: 2, md: 10 }}>
      <Text fontSize="4xl" justifyContent="center">
        <Icon as={CgNotes} w={8} h={8} mr={2} />
        我的最愛
      </Text>
      <Divider my={4} />
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <VStack spacing={4} align="start">
          {notes.map(note => (
            <NoteItem key={note._id} data={note} isLikePending={true} onLike={() => {}} />
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default UserLikes;
