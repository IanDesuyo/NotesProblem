import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FaRegFileAudio } from "react-icons/fa";
import { AccountContext } from "../providers/AccountProvider";
import { ApiContext } from "../providers/ApiProvider";

interface AudioButtonProps {
  noteId: string;
  path?: string;
}

const AudioButton = ({ noteId, path }: AudioButtonProps) => {
  const account = useContext(AccountContext);
  const api = useContext(ApiContext);
  const [audioPath, setAudioPath] = useState<string | undefined>(path);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    const res = await api.note.audio(noteId);

    if (res.success && res.data) {
      setAudioPath(res.data.audio);
    }

    setIsLoading(false);
  };

  return audioPath ? (
    <audio src={`${process.env.REACT_APP_S3_URL}/${audioPath}`} controls />
  ) : (
    <Button
      leftIcon={<Icon as={FaRegFileAudio} />}
      isDisabled={!account.isLoggedIn}
      onClick={handleClick}
      isLoading={isLoading}
    >
      {account.isLoggedIn ? "朗讀" : "登入以聆聽朗讀"}
    </Button>
  );
};

export default AudioButton;
