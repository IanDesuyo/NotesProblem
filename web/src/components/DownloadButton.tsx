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
import { useContext } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { AccountContext } from "../providers/AccountProvider";

interface DownloadButtonProps {
  path: string;
}

const DownloadButton = ({ path }: DownloadButtonProps) => {
  const account = useContext(AccountContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDownload = () => {
    const downloadWindow = window.open(`${process.env.REACT_APP_S3_URL}/${path}`, "_blank");

    downloadWindow?.addEventListener("load", () => {
      onClose();
    });
  };

  return (
    <>
      <Button
        leftIcon={<Icon as={AiOutlineDownload} />}
        onClick={onOpen}
        disabled={!account.isLoggedIn}
      >
        {account.isLoggedIn ? "下載" : "登入以下載原始檔案"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>下載原始檔案</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              當您按下同意時，即代表您同意只將此檔案作為個人之學術用途使用，不得任意轉發或販售。
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              取消
            </Button>
            <Button onClick={handleDownload}>同意</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DownloadButton;
