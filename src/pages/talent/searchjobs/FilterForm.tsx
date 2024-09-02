import { SetStateAction } from "react";
import CustomSelect from "../../../components/custom/CustomSelect";
import { Button, Label } from "reactstrap";
import MultiSelectComponent from "../../../components/custom/CustomTalentMultiSelect";

interface Props {
  professionCategoriesList: any;
  professionsList: any;
  setProfessionsList: any;
  specialitiesList: any;
  locationList: any;
  selectedProfessionCategories: any;
  setSelectedProfessionCategories: any;
  selectedProfession: any;
  setSelectedProfession: any;
  selectedSpecialities: any;
  setSelectedSpecialities: any;
  selectedLocations: any;
  setSelectedLocations: any;
  professionCategoriesIds: any;
  setProfessionCategoriesIds: any;
  professionIds: any;
  setProfessionIds: any;
  shiftId: any;
  setShiftId: any;
  searchJobsShift: any;
}
const FilterForm = ({
  professionCategoriesList,
  professionsList,
  setProfessionsList,
  specialitiesList,
  locationList,
  selectedProfessionCategories,
  setSelectedProfessionCategories,
  selectedProfession,
  setSelectedProfession,
  selectedSpecialities,
  setSelectedSpecialities,
  selectedLocations,
  setSelectedLocations,
  professionCategoriesIds,
  setProfessionCategoriesIds,
  professionIds,
  setProfessionIds,
  shiftId,
  setShiftId,
  searchJobsShift,
}: Props) => {
  const locationOption = locationList?.map((value: any) => ({
    value: value.Id,
    label: `${value.State} (${value.Code})`,
  }));

  const specialtiesOption = specialitiesList?.map((value: any) => ({
    value: value.Id,
    label: value.Speciality,
  }));

  const professionCategoriesOption = professionCategoriesList?.map(
    (value: any) => ({
      value: value.Id,
      label: value.Category,
    })
  );

  const professionsOption = professionsList?.map((value: any) => ({
    value: value.Id,
    label: value.Profession,
  }));

  const handleSearchClick = (id: number) => {
    if (shiftId === id) {
      setShiftId("");
    } else {
      setShiftId(id);
    }
  };

  const handleProfessionCategoriesChange = (selectOption: any) => {
    setSelectedProfessionCategories(selectOption);
    setProfessionCategoriesIds(selectOption?.value);
    setSelectedProfession(null);
    setSelectedSpecialities([]);
    setProfessionsList([]);
    setSelectedSpecialities([]);
  };

  const handleProfessionsChange = (selectOption: any) => {
    setSelectedProfession(selectOption);
    setProfessionIds(selectOption?.value);
    setSelectedSpecialities([]);
  };

  return (
    <div>
      <div className="mb-3">
        <Label for="select_profession" className="filter-label">
          Select Profession
        </Label>
        <CustomSelect
          value={selectedProfessionCategories}
          id="select_profession"
          placeholder={"Select Category"}
          onChange={handleProfessionCategoriesChange}
          name=""
          noOptionsMessage={() => ""}
          options={professionCategoriesOption}
          isClearable={true}
        ></CustomSelect>
      </div>
      <div className="mb-4">
        <CustomSelect
          value={selectedProfession}
          id="select_profession_details"
          placeholder={"Select Profession"}
          onChange={handleProfessionsChange}
          name=""
          noOptionsMessage={() => ""}
          options={professionsOption}
          isDisabled={!professionCategoriesIds}
          isClearable={true}
        ></CustomSelect>
      </div>
      <div className="mb-3 filter-multi-select">
        <Label for="select_profession" className="filter-label">
          Select Specialties
        </Label>
        <div className="search-icon-multiselect talent_multiselect-grp mb-3">
          <MultiSelectComponent
            isDisabled={!professionIds || !selectedProfession}
            options={specialtiesOption}
            value={selectedSpecialities}
            placeholder="Select Specialties"
            openMenu={false}
            onChange={(specialtiesOption: SetStateAction<never[]> | null) => {
              if (specialtiesOption === null) {
                setSelectedSpecialities([]);
                return;
              } else {
                setSelectedSpecialities(specialtiesOption);
              }
            }}
          />
        </div>
        <div className="mb-3">
          <Label for="select_profession" className="filter-label">
            Location
          </Label>
          <div className="fixed-multiselect mb-3">
            <MultiSelectComponent
              options={locationOption}
              value={selectedLocations}
              placeholder="Search Location"
              openMenu={true}
              onChange={(val: SetStateAction<never[]> | null) => {
                if (val === null) {
                  setSelectedLocations([]);
                  return;
                } else {
                  setSelectedLocations(val);
                }
              }}
            />
          </div>
        </div>
        <div className="shift-toggle-wr">
          <p className="filter-label mb-2">Shifts</p>
          <div>
            {searchJobsShift?.map((item: any) => (
              <Button
                outline
                className={`${shiftId == item.Id ? "active" : ""}`}
                key={item.Id}
                onClick={() => handleSearchClick(item.Id)}
              >
                {item?.Shift}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterForm;
