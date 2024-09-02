import Select from "react-select";

const CustomSelectWithTable = ({ options }: { options: any }) => {
  const CustomMenuList = ({
    innerProps,
    children,
  }: {
    innerProps: any;
    children: any;
  }) => (
    <div {...innerProps}>
      {children}
      <div className="professional-table">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th className="ps-5">Professional Name</th>
              <th>Phone</th>
              <th>Professional ID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="table-username">
                  <p className="name-logo me-2">DK</p>
                  <div>
                    <p className="center-align text-align mb-0">
                      Dona Horrison
                    </p>
                    <span className="text-color">abc@yopmail.com</span>
                  </div>
                </div>
              </td>
              <td>(555) 123-4567</td>
              <td>12345</td>
            </tr>
            <tr>
              <td>
                <div className="table-username">
                  <p className="name-logo me-2">DK</p>
                  <div>
                    <p className="center-align text-align mb-0">
                      Dona Horrison
                    </p>
                    <span className="text-color">abc@yopmail.com</span>
                  </div>
                </div>
              </td>
              <td>(555) 987-6543</td>
              <td>67890</td>
            </tr>
            <tr>
              <td>
                <div className="table-username">
                  <p className="name-logo me-2">DK</p>
                  <div>
                    <p className="center-align text-align mb-0">
                      Dona Horrison
                    </p>
                    <span className="text-color">abc@yopmail.com</span>
                  </div>
                </div>
              </td>
              <td>(555) 987-6543</td>
              <td>67890</td>
            </tr>
            <tr>
              <td>
                <div className="table-username">
                  <p className="name-logo me-2">DK</p>
                  <div>
                    <p className="center-align text-align mb-0">
                      Dona Horrison
                    </p>
                    <span className="text-color">abc@yopmail.com</span>
                  </div>
                </div>
              </td>
              <td>(555) 987-6543</td>
              <td>67890</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );

  return <Select options={options} components={{ MenuList: CustomMenuList }} />;
};

export default CustomSelectWithTable;
