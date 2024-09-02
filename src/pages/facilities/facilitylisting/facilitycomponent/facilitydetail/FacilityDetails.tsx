import { Form, useParams } from "react-router-dom";
import { Col, Label, Row } from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomTextArea from "../../../../../components/custom/CustomTextarea";
import CustomMainCard from "../../../../../components/custom/CustomCard";
import RadioBtn from "../../../../../components/custom/CustomRadioBtn";
import { useEffect, useState } from "react";
import Loader from "../../../../../components/custom/CustomSpinner";
import { getFacilityListData } from "../../../../../services/facility";
import { formatPhoneNumber, showToast } from "../../../../../helpers";
import { EditFacilityList } from "../../../../../types/FacilityTypes";

const FacilityDetails = () => {
  const facilityDataId = useParams();

  const [teachingHospital, setTeachingHospital] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<EditFacilityList>();

  const getFacilityData = async () => {
    try {
      setLoading(true);
      const facilityData = await getFacilityListData(
        Number(facilityDataId?.Id)
      );
      setData(facilityData?.data?.data[0]);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    getFacilityData();
  }, [facilityDataId?.Id]);

  useEffect(() => {
    setTeachingHospital(data?.IsTeachingHospital?.toString());
  }, [data?.IsTeachingHospital]);

  return (
    <>
      <CustomMainCard>
        <div className="facility-listing-loader">
          <h2 className="page-content-header">Facility Details</h2>
          <Form>
            {loading && <Loader />}
            <Row>
              <Col xxl="6" xl="6" lg="6" md="12" className="col-group">
                <Label className="">
                  Total Professionals on Assignment
                  <span className="asterisk">*</span>
                </Label>
                <CustomInput
                  placeholder="30"
                  disabled
                  value={data?.TalentCountOnAssignment ?? 0}
                />
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">Total Bed Count</Label>
                <CustomInput
                  placeholder="Total Bed Count"
                  disabled
                  value={data?.BedCount ?? 0}
                />
              </Col>
              <Col xxl="6" xl="6" lg="6" md="6" className="col-group">
                <Label className="">Teaching Hospital</Label>
                <RadioBtn
                  disabled={true}
                  name="IsTeachingHospital"
                  options={[
                    { label: "Yes", value: "true" },
                    { label: "No", value: "false" },
                  ]}
                  selected={teachingHospital ?? ""}
                  onChange={(value: string): string => value}
                />
              </Col>
              <Col xxl="6" xl="3" lg="3" md="6" className="col-group">
                <Label className="">Phone Number</Label>
                <CustomInput
                  placeholder="Mobile"
                  value={formatPhoneNumber(data?.HospitalPhone ?? "")}
                  disabled
                />
              </Col>
              <Col xxl="12" className="col-group">
                <Label>Facility Requirements</Label>
                <CustomTextArea
                  disabled={true}
                  value={data?.Requiremnts ?? ""}
                />
              </Col>
              <Col xxl="12" className="col-group">
                <Label>Internal Facility Notes</Label>
                <CustomTextArea
                  disabled={true}
                  value={data?.InternalNotes ?? ""}
                />
              </Col>
              <h2 className="page-content-header">Primary Point Of Contact</h2>
              <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                <Label className="">First Name</Label>
                <CustomInput
                  placeholder="First Name"
                  value={data?.PrimaryContact?.FirstName}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                <Label className="">Last Name</Label>
                <CustomInput
                  placeholder="Last Name"
                  value={data?.PrimaryContact?.LastName}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                <Label className="">Title</Label>
                <CustomInput
                  placeholder="Title"
                  value={data?.PrimaryContact?.Title}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Email Address</Label>
                <CustomInput
                  placeholder="Email Address"
                  value={data?.PrimaryContact?.Email}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                <Label className="">Mobile</Label>
                <CustomInput
                  placeholder="Phone Number"
                  value={formatPhoneNumber(data?.PrimaryContact?.Phone ?? "")}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Fax</Label>
                <CustomInput
                  placeholder="Fax"
                  value={data?.PrimaryContact?.Fax}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                <Label className="">Role</Label>
                <CustomInput
                  placeholder="Primary  Role"
                  value={formatPhoneNumber(
                    data?.PrimaryContact?.FacilityRole?.Role ?? ""
                  )}
                  disabled
                />
              </Col>
              <h2 className="page-content-header">
                Secondary Point Of Contact
              </h2>
              <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                <Label className="">First Name</Label>
                <CustomInput
                  placeholder="First Name"
                  value={data?.SecondaryContact?.FirstName}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                <Label className="">Last Name</Label>
                <CustomInput
                  placeholder="Last Name"
                  value={data?.SecondaryContact?.LastName}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                <Label className="">Title</Label>
                <CustomInput
                  placeholder="Title"
                  value={data?.SecondaryContact?.Title}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Email Address</Label>
                <CustomInput
                  placeholder="Email Address"
                  value={data?.SecondaryContact?.Email}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                <Label className="">Mobile</Label>
                <CustomInput
                  placeholder="Phone Number"
                  value={formatPhoneNumber(data?.SecondaryContact?.Phone ?? "")}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="6" md="6" className="col-group">
                <Label className="">Fax</Label>
                <CustomInput
                  placeholder="Fax"
                  value={data?.SecondaryContact?.Fax}
                  disabled
                />
              </Col>
              <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                <Label className="">Role</Label>
                <CustomInput
                  placeholder="Secondary  Role"
                  value={data?.SecondaryContact?.FacilityRole?.Role ?? ""}
                  disabled
                />
              </Col>
            </Row>
          </Form>
        </div>
      </CustomMainCard>
    </>
  );
};

export default FacilityDetails;
