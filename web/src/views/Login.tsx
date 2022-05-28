import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AccountContext } from "../providers/AccountProvider";
import { ApiContext } from "../providers/ApiProvider";

const Login = () => {
  const account = useContext(AccountContext);
  const api = useContext(ApiContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    e.stopPropagation();

    const email = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
    const password = e.currentTarget.elements.namedItem("password") as HTMLInputElement;

    const res = await api.account.login(email.value, password.value);

    setLoading(false);

    if (res.success && res.data) {
      account.useToken(res.data.token);

      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");

      toast({
        title: "登入成功",
        description: `歡迎，${res.data.payload.displayName}`,
        status: "success",
        duration: 3000,
      });
      return navigate(next || "/");
    }

    toast({
      title: "登入失敗",
      description: res.message,
      status: "error",
      duration: 5000,
    });
    setError(res.message);
  };

  return (
    <Container maxW="container.md" mt={10}>
      <Text fontSize="4xl">登入</Text>
      <Divider my={6} />
      <Box>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl>
              <FormLabel htmlFor="email">電子郵件</FormLabel>
              <Input id="email" type="email" isRequired />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">密碼</FormLabel>
              <Input id="password" type="password" isRequired minLength={8} maxLength={32} />
            </FormControl>
          </VStack>
          <VStack spacing={6} mt={10}>
            {error && <Text color="red.500">{error}</Text>}
            <Button type="submit" colorScheme="blue" isFullWidth isLoading={isLoading}>
              登入
            </Button>
            <HStack>
              <Text fontSize="sm" color="gray.600" as={NavLink} to="/register">
                立即註冊
              </Text>
              <Divider orientation="vertical" />
              <Text fontSize="sm" color="gray.600" as={NavLink} to="/help">
                取得協助
              </Text>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
