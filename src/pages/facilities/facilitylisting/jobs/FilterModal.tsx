import { Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import CustomSelect from "../../../../components/custom/CustomSelect";
import CustomButton from "../../../../components/custom/CustomBtn";
import { FilterModalProps, JobsActions } from "../../../../types/JobsTypes";
import { Menu, MenuItem, MenuRadioGroup, SubMenu } from "@szhsin/react-menu";
import CustomInput from "../../../../components/custom/CustomInput";
import DropdownImage from "../../../../assets/images/dropdown-arrow.svg";

const FilterModal = ({
  filterModal,
  toggleFilter,
  profession,
  speciality,
  states,
  shiftTime,
  currentState,
  dispatch,
  fetchJobsList,
  pageRef,
  setAbort,
  handleProfessionCategory,
  categoryProfession,
  professionCategory,
  setCategoryProfession,
  setProfessionId,
}: FilterModalProps) => {
  const {
    // selectedProfession,
    selectedSpecialities,
    selectedState,
    selectedShiftTime,
  } = currentState;

  // const handleProfession = (
  //   selectedOption: { value: number; label: string } | null
  // ) => {
  //   if (selectedOption === null) {
  //     dispatch({ type: JobsActions.SetSelectedProfession, payload: null });
  //     dispatch({
  //       type: JobsActions.SetFilter,
  //       payload: currentState.filter - 1,
  //     });
  //     dispatch({
  //       type: JobsActions.SetCount,
  //       payload: { ...currentState.count, professionCount: false },
  //     });
  //     return;
  //   }

  //   if (selectedOption) {
  //     dispatch({
  //       type: JobsActions.SetSelectedProfession,
  //       payload: {
  //         Id: selectedOption?.value,
  //         Profession: selectedOption?.label,
  //       },
  //     });
  //     dispatch({
  //       type: JobsActions.SetCount,
  //       payload: { ...currentState.count, professionCount: true },
  //     });
  //   }
  // };

  // const handleProfession = (categoryIndex: number) => {
  //   setSelectedCategory(categoryIndex);
  // };

  const handleSpecialities = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobsActions.SetSelectedSpecialities, payload: null });
      dispatch({
        type: JobsActions.SetFilter,
        payload: currentState.filter - 1,
      });
      dispatch({
        type: JobsActions.SetCount,
        payload: { ...currentState.count, specialityCount: false },
      });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobsActions.SetSelectedSpecialities,
        payload: {
          Id: selectedOption?.value,
          Speciality: selectedOption?.label,
        },
      });
      dispatch({
        type: JobsActions.SetCount,
        payload: { ...currentState.count, specialityCount: true },
      });
    }
  };

  const handleStateChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobsActions.SetSelectedState, payload: null });
      dispatch({
        type: JobsActions.SetCount,
        payload: { ...currentState.count, statesCount: false },
      });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobsActions.SetSelectedState,
        payload: {
          value: selectedOption?.value,
          label: selectedOption?.label,
        },
      });
      dispatch({
        type: JobsActions.SetCount,
        payload: { ...currentState.count, statesCount: true },
      });
    }
  };

  const handleShiftTime = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption === null) {
      dispatch({ type: JobsActions.SetSelectedShiftTime, payload: null });
      dispatch({
        type: JobsActions.SetCount,
        payload: { ...currentState.count, shiftCount: false },
      });
      return;
    }

    if (selectedOption) {
      dispatch({
        type: JobsActions.SetSelectedShiftTime,
        payload: {
          Id: selectedOption?.value,
          Shift: selectedOption?.label,
        },
      });
      dispatch({
        type: JobsActions.SetCount,
        payload: { ...currentState.count, shiftCount: true },
      });
    }
  };

  const handleApply = () => {
    pageRef.current = 1;
    fetchJobsList();
    toggleFilter();
  };

  const handleFilters = () => {
    // pageRef.current = 1;
    // fetchJobsList();
    dispatch({ type: JobsActions.SetSelectedState, payload: null });
    dispatch({ type: JobsActions.SetSelectedShiftTime, payload: null });
    dispatch({ type: JobsActions.SetSelectedSpecialities, paylod: null });
    // dispatch({ type: JobsActions.SetSelectedProfession, payload: null });
    setCategoryProfession("");
    setProfessionId(0);
    dispatch({
      type: JobsActions.SetCount,
      payload: {
        ...currentState.count,
        professionCount: false,
        specialityCount: false,
        statesCount: false,
        shiftCount: false,
      },
    });
    setAbort((prevState: boolean) => !prevState);
    toggleFilter();
  };

  const handleCancel = () => {
    dispatch({ type: JobsActions.SetSelectedState, payload: null });
    dispatch({ type: JobsActions.SetSelectedShiftTime, payload: null });
    dispatch({ type: JobsActions.SetSelectedSpecialities, paylod: null });
    // dispatch({ type: JobsActions.SetSelectedProfession, payload: null });
    setCategoryProfession("");
    setProfessionId(0);
    dispatch({
      type: JobsActions.SetCount,
      payload: {
        ...currentState.count,
        professionCount: false,
        specialityCount: false,
        statesCount: false,
        shiftCount: false,
      },
    });
    toggleFilter();
  };

  return (
    <Modal
      isOpen={filterModal}
      toggle={toggleFilter}
      size="lg"
      className="filter-modal"
      centered
    >
      <ModalHeader toggle={toggleFilter}>Filters</ModalHeader>
      <ModalBody>
        <Row>
          {/* <Col md="6" className="col-group">
            <Label className="col-label">Select Profession</Label>
            <CustomSelect
              id="profession"
              name="profession"
              placeholder="Select Profession"
              value={
                selectedProfession
                  ? {
                      value: selectedProfession.Id,
                      label: selectedProfession.Profession,
                    }
                  : null
              }
              options={profession.map(
                (templateProfession: {
                  Id: number;
                  Profession: string;
                }): { value: number; label: string } => ({
                  value: templateProfession?.Id,
                  label: templateProfession?.Profession,
                })
              )}
              noOptionsMessage={(): string => "No Profession Found"}
              onChange={(profession) => handleProfession(profession)}
              isClearable={true}
              isSearchable={true}
            />
          </Col> */}
          <Col md="6" className="col-group">
            <Label className="col-label">
              Select Profession <span className="asterisk">*</span>
            </Label>
            <Menu
              menuButton={
                <CustomInput
                  style={{
                    cursor: "pointer",
                    caretColor: "transparent",
                  }}
                  type="text"
                  value={
                    categoryProfession
                      ? categoryProfession
                      : "Select Profession"
                  }
                />
              }
            >
              {profession?.map((item: any, index: number) => (
                <SubMenu
                  key={item.Id}
                  label={item.Category}
                  className="sub-menu"
                >
                  {professionCategory &&
                    professionCategory[index]?.map(
                      (profItem: { Id: number; Profession: string }) => (
                        <MenuRadioGroup
                          key={profItem.Id}
                          onClick={() => handleProfessionCategory(profItem)}
                        >
                          <MenuItem
                            value={profItem.Profession}
                            className="sub-menu-item"
                          >
                            {profItem.Profession}
                          </MenuItem>
                        </MenuRadioGroup>
                      )
                    )}
                </SubMenu>
              ))}
            </Menu>
            <img
              src={DropdownImage}
              alt="DropdownImage"
              className="submenu-dropdown"
            />
          </Col>
          <Col md="6" className="col-group">
            <Label className="col-label">Select Specialties</Label>
            <CustomSelect
              id={"specialities"}
              name={"specialities"}
              options={speciality.map(
                (templateSpeciality: {
                  Id: number;
                  Speciality: string;
                }): { value: number; label: string } => ({
                  value: templateSpeciality?.Id,
                  label: templateSpeciality?.Speciality,
                })
              )}
              value={
                selectedSpecialities
                  ? {
                      value: selectedSpecialities?.Id,
                      label: selectedSpecialities?.Speciality,
                    }
                  : null
              }
              placeholder="Select Speciality"
              noOptionsMessage={(): string => "No Speciality Found"}
              onChange={(speciality) => handleSpecialities(speciality)}
              isClearable={true}
              isSearchable={true}
              isDisabled={!categoryProfession}
            />
          </Col>
          <Col md="6" className="col-group">
            <Label className="col-label">Select State</Label>
            <CustomSelect
              id="State"
              name="State"
              value={selectedState}
              onChange={(state) => handleStateChange(state)}
              options={states.map(
                (state: {
                  Id: number;
                  State: string;
                  Code: string;
                }): { value: number; label: string } => ({
                  value: state?.Id,
                  label: `${state?.State} (${state?.Code})`,
                })
              )}
              placeholder="Select State"
              noOptionsMessage={(): string => "No State Found"}
              isSearchable={true}
              isClearable={true}
            />
          </Col>
          <Col md="6" className="col-group">
            <Label className="col-label">Select Shift</Label>
            <CustomSelect
              id={"shiftTime"}
              name={"shiftTime"}
              options={shiftTime.map(
                (templateShift: {
                  Id: number;
                  Shift: string;
                }): { value: number; label: string } => ({
                  value: templateShift?.Id,
                  label: templateShift?.Shift,
                })
              )}
              value={
                selectedShiftTime
                  ? {
                      value: selectedShiftTime?.Id,
                      label: selectedShiftTime?.Shift,
                    }
                  : null
              }
              placeholder="Select Shift"
              noOptionsMessage={(): string => "No Shift Found"}
              onChange={(time) => handleShiftTime(time)}
              isClearable={true}
              isSearchable={true}
            />
          </Col>
        </Row>
        <div className="btn-wrapper">
          <CustomButton className="primary-btn" onClick={handleApply}>
            Apply{" "}
          </CustomButton>
          <CustomButton className="secondary-btn" onClick={handleCancel}>
            Cancel
          </CustomButton>
          <CustomButton className="secondary-btn" onClick={handleFilters}>
            Clear Filters
          </CustomButton>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default FilterModal;
