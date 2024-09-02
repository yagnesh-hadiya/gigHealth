import { useCallback, useEffect, useRef } from "react";
import CustomInput from "./CustomInput";
import Calendar from "../../assets/images/calendar.svg";
import DatePicker from "react-multi-date-picker";

export type MultiDatePickerProps = {
  value: any;
  onChangeDate: any;
  startDate?: Date | null;
  disabled?: boolean;
  currentDate?: any;
  maxDate?: any;
  minDate?: any;
};

const CustomMultiDatePicker = ({
  value,
  onChangeDate,
  disabled,
  currentDate,
  maxDate,
  minDate,
  ...props
}: MultiDatePickerProps) => {
  const dateTimeRef = useRef<any>();

  const useOnClickOutside = (ref: any, handler: any) => {
    useEffect(() => {
      const listener = (event: any) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref, handler]);
  };

  const handleDatePickerClose = useCallback(
    () => dateTimeRef.current?.closeCalendar(),
    [dateTimeRef]
  );

  useOnClickOutside(dateTimeRef, handleDatePickerClose);

  return (
    <div className="datepicker-container">
      <DatePicker
        placeholder="Select Date"
        className="form-control"
        ref={dateTimeRef}
        value={value ?? "Select Date"}
        onChange={(data, e) => onChangeDate(data, e)}
        currentDate={currentDate}
        multiple
        sort
        format="MM-DD-YYYY"
        highlightToday={false}
        minDate={minDate}
        maxDate={maxDate ? maxDate : new Date(2028, 11, 31)}
        disabled={disabled}
        render={
          <div className="custom-calendar-wrapper">
            <CustomInput
              value={value ?? "Select Date"}
              placeholder="Select Date"
              {...props}
            />
            <img src={Calendar} className="calendar-icon" />
          </div>
        }
      />
    </div>
  );
};

export default CustomMultiDatePicker;
