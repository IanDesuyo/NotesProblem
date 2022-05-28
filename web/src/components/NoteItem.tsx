import { useContext, useState } from "react";
import { Box, Flex, HStack, Tag, Text, Icon, Button, Avatar } from "@chakra-ui/react";
import { NoteResponse } from "../providers/ApiProvider.d";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../providers/AccountProvider";

interface NoteItemProps {
  data: NoteResponse;
  onLike: (id: string, like: boolean) => void;
  isLikePending: boolean;
}

const NoteItem = ({ data, onLike, isLikePending }: NoteItemProps) => {
  const account = useContext(AccountContext);
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    onLike(data._id, !data.like);
  };

  return (
    <Box
      p={4}
      rounded="3xl"
      bg="gray.50"
      w="100%"
      onClick={() => navigate(`/note/${data._id}`)}
      _hover={{ cursor: "pointer" }}
    >
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="2xl">
            {data.likes && data.likes > 51 ? (
              <Icon as={RiVipCrownFill} display="inline-block" color="gold" mr={2} />
            ) : null}
            {data.title}
          </Text>
          <HStack spacing={2} mt={2}>
            {data.hashtags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </HStack>
        </Box>
        <HStack alignItems="baseline" spacing={1}>
          <Text>{data.likes || 0}</Text>
          <Button
            variant="ghost"
            rounded="full"
            w="0"
            onClick={handleLike}
            isDisabled={!account.isLoggedIn || isLikePending}
          >
            <Icon as={data.like ? FaHeart : FaRegHeart} />
          </Button>
        </HStack>
      </Flex>
      <Text noOfLines={{ base: 4, md: 3 }} my={2}>
        {data.content}
      </Text>
      <Flex justifyContent="space-between" textColor="gray.600">
        <HStack alignItems="baseline" spacing={2}>
          <Text>By</Text>
          <Avatar name={data.author.displayName} size="xs" />
          <Text>{data.author.displayName}</Text>
        </HStack>
        <Text>{new Date(data.createdAt).toLocaleString()}</Text>
      </Flex>
    </Box>
  );
};

export default NoteItem;
