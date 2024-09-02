import { Form } from "react-router-dom";
import { Button, FormGroup } from "reactstrap";
import CustomInput from "../../../components/custom/CustomInput";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import Calendar from "../../../assets/images/calendar.svg";

interface GigsFiltersProps {
  search: string;
  setSearch: (arg0: string) => void;
  startDate: Date | null;
  setStartDate: (arg0: Date | null) => void;
  endDate: Date | null;
  setEndDate: (arg0: Date | null) => void;
}
const GigsFilters = ({
  search,
  setSearch,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: GigsFiltersProps) => {
  const handleChange = (text: string) => {
    setSearch(text);
  };

  const handleDateChange = (date: Date | null, type: string) => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  return (
    <div className="gig-listing-input w-100 mb-3">
      <div className="w-100">
        <Form>
          <FormGroup className="search-input-wr gig-search-input mb-0">
            <CustomInput
              type="text"
              placeholder="Search Here"
              id="search"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e.target.value);
              }}
            />
            <span className="material-symbols-outlined">search</span>
          </FormGroup>
        </Form>
      </div>
      <div className="gig-calender-wr">
        <ReactDatePicker
          isClearable={true}
          selected={startDate}
          minDate={new Date()}
          onChange={(date) => handleDateChange(date, "start")}
          timeIntervals={15}
          dateFormat="h:mm aa"
          className="custom-select-picker-all contract-select"
          customInput={
            <div className="custom-calendar-wrapper">
              <CustomInput
                value={
                  startDate
                    ? moment(startDate.toDateString()).format("MM-DD-YYYY")
                    : ""
                }
                placeholder="Start Date"
              />
              {!startDate && <img src={Calendar} className="calendar-icon" />}
            </div>
          }
        />
        <span>-</span>
        <ReactDatePicker
          isClearable={true}
          selected={endDate}
          minDate={new Date()}
          onChange={(date) => handleDateChange(date, "end")}
          timeIntervals={15}
          dateFormat="h:mm aa"
          className="custom-select-picker-all contract-select"
          customInput={
            <div className="custom-calendar-wrapper">
              <CustomInput
                value={
                  endDate
                    ? moment(endDate.toDateString()).format("MM-DD-YYYY")
                    : ""
                }
                placeholder="End Date"
              />
              {!endDate && <img src={Calendar} className="calendar-icon" />}
            </div>
          }
        />
        <Button className="blue-gradient-btn mb-0">
          <span className="material-symbols-outlined">search</span>
        </Button>
      </div>
    </div>
  );
};

export default GigsFilters;
