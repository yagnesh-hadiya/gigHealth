import { SetStateAction, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "reactstrap";
import CustomSelect from "../../../components/custom/CustomSelect";
import MultiSelectComponent from "../../../components/custom/CustomTalentMultiSelect";
import {
  getStatesLocations,
  getStateSpecialities,
  getProfessionCategories,
  getProfessions,
} from "../../../services/SearchJobsServices";
import { useNavigate } from "react-router-dom";
import { OptionProps } from "react-select";

const HomeForm = () => {
  const navigate = useNavigate();

  const [professionCategoriesList, setProfessionCategoriesList] = useState([]);
  const [professionsList, setProfessionsList] = useState([]);
  const [specialitiesList, setSpecialitiesList] = useState([]);
  const [locationList, setLocationList] = useState([]);

  const [selectedProfessionCategories, setSelectedProfessionCategories] =
    useState(null);
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [selectedSpecialities, setSelectedSpecialities] = useState<OptionProps[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<OptionProps[]>([]);

  const [professionCategoriesIds, setProfessionCategoriesIds] = useState(0);
  const [professionIds, setProfessionIds] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const professionCategoriesRes = await getProfessionCategories();
      setProfessionCategoriesList(professionCategoriesRes.data.data);

      const locationsRes = await getStatesLocations();
      setLocationList(locationsRes.data.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (professionIds) {
      const fetchStateSpecialities = async () => {
        const res = await getStateSpecialities(professionIds);
        setSpecialitiesList(res.data.data);
      };
      fetchStateSpecialities();
    }
  }, [professionIds]);

  useEffect(() => {
    if (professionCategoriesIds) {
      const fetchProfessions = async () => {
        const res = await getProfessions(professionCategoriesIds);
        setProfessionsList(res.data.data);
      };
      fetchProfessions();
    }
  }, [professionCategoriesIds]);

  const locationOption = locationList.map(({ Id, State, Code }) => ({
    value: Id,
    label: `${State} (${Code})`,
  }));

  const specialtiesOption = specialitiesList.map(({ Id, Speciality }) => ({
    value: Id,
    label: Speciality,
  }));

  const professionCategoriesOption = professionCategoriesList.map(
    ({ Id, Category }) => ({
      value: Id,
      label: Category,
    })
  );

  const professionsOption = professionsList.map(({ Id, Profession }) => ({
    value: Id,
    label: Profession,
  }));

  const handleProfessionCategoriesChange = (selectOption: any) => {
    setSelectedProfessionCategories(selectOption);
    setProfessionCategoriesIds(selectOption?.value);
    setSelectedProfession(null);
    setSelectedSpecialities([]);
    setProfessionsList([]);
    setSpecialitiesList([]);
  };

  const handleProfessionsChange = (selectOption: any) => {
    setSelectedProfession(selectOption);
    setProfessionIds(selectOption?.value);
    setSelectedSpecialities([]);
  };

  const redirectToSearchJob = () => {
    navigate("/talent/search-jobs", {
      state: {
        selectedProfessionCategoriesProps: selectedProfessionCategories,
        selectedProfessionProps: selectedProfession,
        selectedSpecialitiesProps: selectedSpecialities,
        selectedLocationsProps: selectedLocations,
        professionCategoriesIdsProps: professionCategoriesIds,
        professionIdsProps: professionIds,
      },
    });
  };

  const clearFilter = () => {
    setSelectedProfessionCategories(null);
    setSelectedProfession(null);
    setSelectedSpecialities([]);
    setSelectedLocations([]);
    setProfessionCategoriesIds(0);
    setProfessionIds(0);
  };
  return (
    <div className="home-form-wr">
      <Form>
        <Row>
          <Col sm={6}>
            <div className="mb-3">
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
          </Col>
          <Col sm={6}>
            <div className="mb-3">
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
          </Col>
          <Col sm={12}>
            <div className="search-icon-multiselect mb-3">
              <MultiSelectComponent
                isDisabled={!professionIds || !selectedProfession}
                options={specialtiesOption}
                value={selectedSpecialities}
                placeholder="Select Specialties"
                openMenu={false}
                onChange={(val: SetStateAction<OptionProps[]> | null) => {
                  if (val === null) {
                    setSelectedSpecialities([]);
                    return;
                  } else {
                    setSelectedSpecialities(val);
                  }
                }}
              />
            </div>
          </Col>
          <Col sm={12}>
            <div className="mb-3">
              <MultiSelectComponent
                options={locationOption}
                value={selectedLocations}
                placeholder="Search Location"
                openMenu={false}
                onChange={(val: SetStateAction<OptionProps[]> | null) => {
                  if (val === null) {
                    setSelectedLocations([]);
                    return;
                  } else {
                    setSelectedLocations(val);
                  }
                }}
              />
            </div>
          </Col>
          <Col sm={12}>
            <Button
              className="yellow-btn form-common-btn mb-0 w-100"
              onClick={redirectToSearchJob}
            >
              Search
            </Button>
            <div className="text-center">
              <Button
                color="link"
                className="transparent-btn filter-btn mt-3 mb-1"
                onClick={clearFilter}
              >
                Clear Filters
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default HomeForm;
