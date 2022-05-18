import { Avatar, Box, Center, Container, Flex, Spinner, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AccountContext } from "../../providers/AccountProvider";
import { ApiContext } from "../../providers/ApiProvider";
import { UserResponse } from "../../providers/ApiProvider.d";

const UserIndex = () => {
  const api = useContext(ApiContext);
  const account = useContext(AccountContext);
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<UserResponse>();

  useEffect(() => {
    if (params.id === "me" && !account.isLoggedIn) {
      return navigate("/login?next=/user/me");
    }

    const fetchUser = async () => {
      setLoading(true);

      const res = await api.account.get(params.id as string);

      if (res.success && res.data) {
        setData(res.data);
      }

      setLoading(false);
    };

    fetchUser();
  }, [params.id, account.isLoggedIn, api.account, navigate]);

  return (
    <Container maxW="container.md" my={{ base: 2, md: 10 }}>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : data ? (
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={10}
          bg="gray.200"
          p={10}
          borderRadius="3xl"
        >
          <Avatar name={data.displayName} size="2xl" alignSelf="center" />
          <Box textAlign="start">
            <Text fontSize="4xl">{data.displayName}</Text>
            <Text>{data._id}</Text>
            <Text>創建於 {new Date(data.createdAt * 1000).toLocaleDateString()}</Text>
          </Box>
        </Flex>
      ) : (
        <Text>Not Found</Text>
      )}
    </Container>
  );
};

export default UserIndex;
