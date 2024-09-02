import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { getProfessionalsList } from "../../../../../services/ProfessionalServices";
import { ProfessionalType } from "../../../../../types/ProfessionalTypes";
import { capitalize, formatPhoneNumber } from "../../../../../helpers";
import { components } from "react-select";

type ProfessionalSelectProps = {
  currentProfessional: {
    value: number;
    label: string;
  } | null;
  setCurrentProfessional: (
    value: { value: number; label: string } | null
  ) => void;
};

const ProfessionalSelect: React.FC<ProfessionalSelectProps> = ({
  currentProfessional,
  setCurrentProfessional,
}: ProfessionalSelectProps) => {
  async function loadOptions(
    search: string,
    loadedOptions: any[],
    { page }: any
  ) {
    const response = await getProfessionalsList(
      10,
      page,
      "name",
      "ASC",
      search,
      "",
      ""
    );

    return {
      options: [
        ...loadedOptions,
        ...response.rows.map((item: ProfessionalType) => ({
          value: item.Id,
          label: `${capitalize(item.FirstName)} ${capitalize(item.LastName)}`,
          professional: item,
        })),
      ],
      hasMore: response.count > page * 10,
      additional: {
        page: page + 1,
      },
    };
  }

  const SelectOption = (props: any) => {
    return (
      <components.Option {...props}>
        <div
          style={{
            margin: "0px !important",
          }}
        >
          <table
            style={{
              width: "100%",
            }}
          >
            <tbody>
              <tr
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <td
                  style={{
                    flex: 4,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <p
                      className="me-2"
                      style={{
                        borderRadius: "50%",
                        background:
                          "linear-gradient(90deg, #2E65C3 0%, #7F47DD 100%)",
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "normal",
                        letterSpacing: "-0.28px",
                        marginBottom: "0px",
                        width: "46px",
                        minWidth: "46px",
                        height: "46px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {props.label.charAt(0).toUpperCase()}
                      {props.label.split(" ")[1].charAt(0).toUpperCase()}
                    </p>
                    <div>
                      <p className="center-align text-align mb-0">
                        {props.label}
                      </p>
                      <span className="text-color">
                        {props.data.professional.Email}
                      </span>
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    flex: 2,
                    textAlign: "center",
                  }}
                >
                  {formatPhoneNumber(props.data.professional.Phone)}
                </td>
                <td
                  style={{
                    flex: 1,
                  }}
                >
                  PID-{props.data.value}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </components.Option>
    );
  };

  return (
    <AsyncPaginate
      loadOptions={loadOptions as any}
      additional={{
        page: 1,
      }}
      value={currentProfessional}
      onChange={setCurrentProfessional}
      // styles={customStyles as any}
      components={{
        Option: SelectOption,
      }}
    />
  );
};

export default ProfessionalSelect;
