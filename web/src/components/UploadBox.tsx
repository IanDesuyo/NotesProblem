import { Box, Icon, Text, useToast, BoxProps, Spinner } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

interface UploadBoxProps extends Omit<BoxProps, "onChange"> {
  onChange: (file: File) => void;
  isUploading?: boolean;
}

const UploadBox = ({ onChange, isUploading, ...props }: UploadBoxProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [file, _setFile] = useState<File>();
  const toast = useToast();

  useEffect(() => {
    const handleDropFile = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isUploading && e.dataTransfer && e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          const item = e.dataTransfer.items[i];

          if (item.kind === "file") {
            const file = item.getAsFile();

            if (file) {
              setFile(file);
              return;
            }
          }
        }
      }
    };

    const ref = boxRef.current;
    ref?.addEventListener("dragover", e => e.preventDefault(), false);
    ref?.addEventListener("drop", handleDropFile, false);

    return () => {
      ref?.removeEventListener("dragover", e => e.preventDefault(), false);
      ref?.removeEventListener("drop", handleDropFile, false);
    };
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFile(file);
    }
  };

  const setFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return toast({
        title: "不支援的檔案格式",
        description: "請選擇圖片檔案",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    _setFile(file);
    onChange(file);
  };

  return (
    <Box {...props}>
      <input
        type="file"
        accept="image/*"
        ref={uploadRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Box
        borderRadius="3xl"
        border="1px"
        borderColor="gray.200"
        p={4}
        h={40}
        textColor={file ? "gray.900" : "gray.500"}
        _hover={{ textColor: "gray.900", cursor: "pointer" }}
        onClick={() => uploadRef.current?.click()}
        ref={boxRef}
      >
        <Box textAlign="center">
          {isUploading ? (
            <Spinner as={Icon} w={12} h={12} speed="1.5s" thickness="4px" m={5} />
          ) : (
            <Icon as={AiOutlineCloudUpload} w={20} h={20} />
          )}
          <Text>{file?.name || "上傳檔案"}</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadBox;
