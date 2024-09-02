import { useCallback, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Select, { MenuPlacement } from "react-select";

export interface CustomSelectWithScrollProps {
  id: string;
  name: string;
  options: { value: number; label: string }[];
  noOptionsMessage: () => string;
  placeholder: string;
  className?: string;
  value?: { value: number; label: string } | null;
  onChange: (selectedOption: { value: number; label: string } | null) => void;
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  menuPlacement?: MenuPlacement;
  styles?: any;
  loadMoreOptions: () => Promise<void>;
}

const customStyles = {
  control: (provided: any, state: { isFocused: any }) => ({
    ...provided,
    width: "100%",
    border: state.isFocused ? "1px solid #DDDDEA" : "1px solid #DDDDEA",
    boxShadow: "none",
  }),
  option: (provided: any, state: { isFocused: any }) => ({
    ...provided,
    background: state.isFocused ? "#fff" : "#fff",
    color: state.isFocused ? "#474D6A" : "#262638",
    cursor: "pointer",
    maxHeight: "200px",
    "&:hover": {},
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#717B9E",
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#262638",
    fontSize: "14px",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none",
  }),
};

const CustomSelectWithScroll = ({
  styles,
  id,
  name,
  options,
  noOptionsMessage,
  placeholder,
  isClearable,
  isSearchable,
  isDisabled,
  value,
  onChange,
  menuPlacement,
  loadMoreOptions,
}: CustomSelectWithScrollProps) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (!isLoadingMore) {
      setIsLoadingMore(true);
      // Call the function to load more options
      await loadMoreOptions();
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, loadMoreOptions]);

  const handleChange = (selectedOption: any): void => {
    onChange(selectedOption);
  };

  return (
    <InfiniteScroll
      dataLength={options.length}
      next={handleLoadMore}
      hasMore={
        options.length % 10 === 0 && options.length > 0 && !isLoadingMore
      }
      loader={<h4>Loading...</h4>}
    >
      <Select
        id={id}
        name={name}
        options={options}
        noOptionsMessage={noOptionsMessage}
        placeholder={placeholder}
        className="custom-select-picker-all"
        value={value}
        styles={styles ? styles : customStyles}
        onChange={handleChange}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        menuPlacement={menuPlacement}
      />
    </InfiniteScroll>
  );
};

export default CustomSelectWithScroll;
