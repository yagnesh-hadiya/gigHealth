export const headerStyles = {
    control: (provided: any, state: { isFocused: any; }) => ({
        ...provided,
        width: "100%",
        minWidth: "150px",
        border: state.isFocused ? "1px solid #DDDDEA" : "1px solid #DDDDEA",
        boxShadow: "none",
        minHeight: '40px',
    }),
    option: (provided: any, state: { isFocused: any; }) => ({
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
};

export const jobsCustomStyle = {
    control: (provided: any) => ({
        ...provided,
        width: "100%",
        minHeight: '26px',
        // border: state.isFocused ? "1px solid #DDDDEA" : "1px solid #DDDDEA",
        boxShadow: "none",
        backgroundColor: '#639A35',
        paddingLeft: '5px'
    }),
    option: (provided: any, state: { isFocused: any; }) => ({
        ...provided,
        // color: state.isFocused ? '#fff' : '#000',
        background: state.isFocused ? "#fff" : "#fff",
        color: state.isFocused ? "#474D6A" : "#262638",
        cursor: "pointer",
        maxHeight: "200px",
        "&:hover": {},
    }),
    placeholder: (provided: any) => ({
        ...provided,
        //color: "#717B9E",
        color: '#fff',
        fontSize: "14px",
    }),
    singleValue: (provided: any) => ({
        ...provided,
        // color: "#262638",
        fontSize: "14px",
        color: '#fff',
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        background: "#639A35",
        height: '28px',
        padding: '0px 2px'
    }),
    indicatorsContainer: (provided: any) => ({
        ...provided,
        height: '28px',
        "&:hover": { color: '#fff' },
    }),
    menu: (provided: any) => ({
        ...provided,
        width: 'auto',
        minWidth: '100%',
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    clearIndicator: (provided: any) => ({
        ...provided,
        color: '#fff',
        ':hover': {
            color: '#fff',
        },
    }),
    dropdownIndicator: (provided: any, state: { isFocused: boolean }) => ({
        ...provided,
        color: state.isFocused ? '#fff' : '#fff',
        ':hover': {
            color: '#fff',
        },
    }),
    // menu: (provided: any) => ({
    //   ...provided,
    //   // maxHeight: "100px",
    //   zIndex: 10,
    // }),
};