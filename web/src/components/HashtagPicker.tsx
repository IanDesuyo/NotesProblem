import {
  AutoComplete,
  AutoCompleteCreatable,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";

const COMMON_TAGS = [
  "english",
  "數學",
  "英文",
  "線性代數",
  "微積分",
  "統計學",
  "資料結構",
  "計算機概論",
  "資料庫",
  "程式設計",
  "電子學",
];

interface HashtagPickerProps {
  onChange: (hashtags: string[]) => void;
}

const HashtagPicker = ({ onChange }: HashtagPickerProps) => {
  return (
    <AutoComplete multiple openOnFocus creatable onChange={onChange}>
      <AutoCompleteInput>
        {({ tags }) =>
          tags.map((tag, tid) => (
            <AutoCompleteTag
              key={tid}
              label={tag.label}
              onRemove={tag.onRemove}
              textTransform="capitalize"
            />
          ))
        }
      </AutoCompleteInput>
      <AutoCompleteList>
        {/* {COMMON_TAGS.map((tag, index) => (
          <AutoCompleteItem
            key={`option-${index}`}
            value={tag}
            textTransform="capitalize"
            _selected={{ bg: "whiteAlpha.50" }}
            _focus={{ bg: "whiteAlpha.100" }}
          />
        ))} */}
        <AutoCompleteCreatable>
          {({ value }) => <span>將 {value} 加至標籤</span>}
        </AutoCompleteCreatable>
      </AutoCompleteList>
    </AutoComplete>
  );
};

export default HashtagPicker;
