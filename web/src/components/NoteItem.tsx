import { useState } from "react";
import { Box, Flex, HStack, Tag, Text, Icon, Button, Avatar } from "@chakra-ui/react";
import { NoteResponse } from "../api/note";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface NoteItemProps {
  data: NoteResponse;
  onLike: (_id: string) => void;
}

const NoteItem = ({ data, onLike }: NoteItemProps) => {
  const [isLiked, setLiked] = useState(false);
  const navigate = useNavigate();

  return (
    <Box p={4} rounded="3xl" bg="gray.50" w="100%" onClick={() => navigate(`/note/${data._id}`)} _hover={{cursor: "pointer"}}>
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="2xl">{data.title}</Text>
          <HStack spacing={2} mt={2}>
            {data.hashtags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </HStack>
        </Box>
        <HStack alignItems="start">
          <Button variant="ghost" rounded="full" w="0" onClick={() => setLiked(prev => !prev)}>
            <Icon as={isLiked ? FaHeart : FaRegHeart} size="1xl" />
          </Button>
        </HStack>
      </Flex>
      <Text noOfLines={{ base: 4, md: 3 }} my={2}>
        {data.content}
      </Text>
      <Flex justifyContent="space-between" textColor="gray.600">
        <HStack spacing={2}>
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
