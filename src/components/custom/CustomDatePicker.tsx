import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomInput from "./CustomInput";
import Calendar from "../../assets/images/calendar.svg";
import { formatDateInDayMonthYear } from "../../helpers";
import React from "react";
const CustomDatePicker = React.forwardRef(
  (
    { error, style, placeholder, date, onChange, onSelectDate, ...props }: any,
    ref
  ) => {
    // const [date, setDate] = useState(initialDate);

    // const onDateChange = (date: any) => {
    //     setDate(date);
    //     onSelectDate?.(date);
    // };

    // const formatDate = (date: any) => {
    //     if (date) {
    //         return date.toLocaleDateString(undefined, {
    //             weekday: 'short',
    //             month: 'short',
    //             day: 'numeric',
    //             year: 'numeric',
    //         });
    //     }
    //     return '';
    // };

    return (
      <DatePicker
        onChange={onChange}
        onSelect={onSelectDate}
        isClearable={false}
        disabled={props.disabled}
        // value={date}
        todayButton={"Today"}
        dateFormat="dd/MM/yyyy"
        minDate={new Date()}
        selected={date}
        placeholderText={placeholder}
        customInput={
          <div className="custom-calendar-wrapper">
            <CustomInput
              style={style}
              error={error}
              ref={ref}
              value={date ? formatDateInDayMonthYear(date) : ""}
              placeholder={placeholder}
              {...props}
            />
            <img src={Calendar} className="calendar-icon" />
          </div>
        }
      />
    );
  }
);

export default CustomDatePicker;
