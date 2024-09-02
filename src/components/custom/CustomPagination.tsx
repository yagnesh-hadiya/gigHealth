import { Pagination, PaginationItem } from "reactstrap";
import CustomSelect from "./CustomSelect";
import { CustomPaginationProps } from "../../types/CustomPagination";
import Previous from "../../assets/images/previous.svg";
import Next from "../../assets/images/next.svg";

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  entriesPerPage,
  totalRows,
  setPage
}: CustomPaginationProps) => {
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalRows);
  const entriesOnPage = endEntry - startEntry + 1;

  let showingEntriesText = "";
  if (entriesOnPage === 1) {
    showingEntriesText = `Showing ${totalRows} of ${totalRows} Entries`;
  } else {
    showingEntriesText = `Showing ${startEntry} to ${endEntry} of ${totalRows} Entries`;
  }

  const handlePageChange = (selectedPage: number): void => {
    if (selectedPage >= 1 && selectedPage <= totalPages) {
      onPageChange(selectedPage);
    }
  };

  return (
    <div className="pagination-wrapper d-flex justify-content-between mt-3">
      <div className="d-flex align-items-center">
        <span className="pagination-content-pages">{showingEntriesText}</span>
        <CustomSelect
          id="entriesPerPageSelect"
          name="entriesPerPageSelect"
          value={{ value: entriesPerPage, label: entriesPerPage.toString() }}
          onChange={(
            selectedOption: { value: number; label: string } | null
          ): void => {
            const newSize: number = Number(selectedOption?.value);
            onPageSizeChange(newSize);
            setPage(1);
          }}
          options={[10, 25, 100].map(
            (size: number): { value: number; label: string } => ({
              value: size,
              label: size.toString(),
            })
          )}
          isSearchable={true}
          noOptionsMessage={(): string => "No options available"}
          menuPlacement="top"
          placeholder=""
        />
      </div>

      <div>
        <Pagination
          aria-label="Page navigation example"
          size="xsm"
          className="react-strap-pagination"
        >
          <div>
            <PaginationItem disabled={currentPage === 1}>
              <span onClick={() => handlePageChange(currentPage - 1)}>
                <img src={Previous} /> Previous
              </span>
              {/* <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} /> */}
            </PaginationItem>
          </div>

          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i} active={currentPage === i + 1}>
              {/* <PaginationLink onClick={() => handlePageChange(i + 1)}>{i + 1}</PaginationLink> */}
              <span onClick={() => handlePageChange(i + 1)}>{i + 1}</span>
            </PaginationItem>
          ))}

          <div>
            <PaginationItem disabled={currentPage === totalPages}>
              <span onClick={() => handlePageChange(currentPage + 1)}>
                Next
                <img src={Next} />
              </span>
              {/* <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} /> */}
            </PaginationItem>
          </div>
        </Pagination>
      </div>
    </div>
  );
};

export default CustomPagination;
