import { Button, Col, FormFeedback, FormGroup, Label, Row } from "reactstrap";
import CustomSelect from "../../../components/custom/CustomSelect";
import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import CustomInput from "../../../components/custom/CustomInput";
import moment from "moment";
import Calendar from "../../../assets/images/calendar.svg";
import { ProfileInformationCardProps } from "../../../types/ProfessionalDetails";
import Loader from "../../../components/custom/CustomSpinner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProfessionalAdditionalDetailsSchema } from "../../../helpers/schemas/ProfessionalMyProfile";
import {
  AdditionalDetailsType,
  ProfessionalAdditionalDetailsPropsType,
  ProfessionalAdditionalDetailsType,
} from "../../../types/ProfessionalAuth";
import { SelectOption } from "../../../types/FacilityTypes";
import {
  getFileExtension,
  maxFileSize,
  showToast,
  validFileExtensions,
} from "../../../helpers";
import {
  getAdditionalDetails,
  updateAdditionalDetails,
  uploadSignatureProfessionals,
} from "../../../services/ProfessionalMyProfile";

const AdditionalDetails = ({
  state,
  setFetchDetails,
}: ProfileInformationCardProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfessionalAdditionalDetailsPropsType>({
    resolver: yupResolver(ProfessionalAdditionalDetailsSchema) as any,
  });
  const [dob, setDob] = useState<Date | null>(null);
  const [selectedGig, setSelectedGig] = useState<SelectOption | null>(null);
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const [edit, setEdit] = useState<boolean>(false);
  const [details, setDetails] = useState<ProfessionalAdditionalDetailsType>();
  const [image, setImage] = useState<File | undefined>();
  const [imageURL, setImageURL] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  useEffect(() => {
    const uploadImage = async () => {
      if (image) {
        try {
          const upload = await uploadSignatureProfessionals(image);
          if (upload?.status === 200) {
            showToast(
              "success",
              "Signature uploaded successfully" || upload.data?.message
            );
            return true;
          } else {
            console.error(upload);
            return showToast("error", "Failed to upload signature");
          }
        } catch (error: any) {
          console.error(error);
          showToast(
            "error",
            error?.response?.data?.message || "Something went wrong"
          );
        }
      }
    };
    uploadImage();
  }, [image]);

  const fetchAdditionalDetails = async () => {
    try {
      setLoading("loading");
      const response = await getAdditionalDetails();
      if (response.status === 200) {
        setDetails(response.data?.data[0]);

        const imageUrlFromApi: string = response.data?.data[0]?.signatureUrl;

        if (imageUrlFromApi) {
          setImageURL(imageUrlFromApi);
          setImageLoading(false);
        } else {
          setImageURL(imageUrlFromApi);
          setImageLoading(false);
        }
      }
      setLoading("idle");
    } catch (error: any) {
      console.error(error);
      setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    fetchAdditionalDetails();
  }, []);

  useEffect(() => {
    setValue(
      "other",
      details?.DiscoveredGigOther ? details?.DiscoveredGigOther : ""
    );
    setValue("referral", details?.ReferralId ? details?.ReferralId : "");
    setValue("ssn", details?.Ssn ? details?.Ssn : "");
    if (details?.DiscoveredGig) {
      setSelectedGig({
        value: details?.DiscoveredGig.Id,
        label: details?.DiscoveredGig.Option,
      });
    }
    setDob(details?.Dob ? new Date(details?.Dob) : null);
  }, [details]);

  const handleGig = (selectedOption: SelectOption | null) => {
    if (selectedOption === null) {
      setSelectedGig(null);
    }

    setValue("other", "");
    setValue("referral", "");

    if (selectedOption) {
      setSelectedGig({
        value: selectedOption.value,
        label: selectedOption.label,
      });
    }
  };

  const onSubmit = async (data: ProfessionalAdditionalDetailsPropsType) => {
    // if (!selectedGig) {
    //   return showToast("error", "Please select the gig");
    // }

    // if (!data?.ssn) {
    //   return showToast("error", "SSN field is required");
    // }

    // if (!dob) {
    //   return showToast("error", "Please select date of birth");
    // }
    if (selectedGig) {
      if (
        selectedGig.label === "Other" &&
        data?.other !== undefined &&
        data.other.trim() === ""
      ) {
        return showToast("error", "Other field is required");
      }
    }

    if (selectedGig) {
      if (selectedGig.label === "Referral" && data?.referral === "") {
        return showToast("error", "Please fill the referral id");
      }
    }

    try {
      // setLoading("loading");
      const response = await updateAdditionalDetails(
        dob ? moment(dob?.toString()).format("YYYY-MM-DD") : null,
        data?.ssn ? data?.ssn : null,
        selectedGig ? selectedGig?.value : null,
        data?.referral ? Number(data?.referral) : null,
        data?.other ? data?.other : null
      );
      if (response.status === 200) {
        showToast(
          "success",
          "Additional details updated successfully" || response.data?.message
        );
        setDob(null);
        reset();
        setValue("other", "");
        setValue("referral", "");
        setSelectedGig(null);
        fetchAdditionalDetails();
        setEdit((prev) => !prev);
        setFetchDetails && setFetchDetails((prev) => !prev);
      }
      // setLoading("idle");
    } catch (error: any) {
      console.error(error);
      // setLoading("error");
      showToast(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage: File | undefined = e.target?.files?.[0];
    if (selectedImage) {
      const fileExtension = getFileExtension(selectedImage);
      if (fileExtension !== undefined) {
        if (
          !fileExtension ||
          !validFileExtensions.facilityPicture.includes(fileExtension)
        ) {
          showToast("error", "Supported formats are only .jpg, .jpeg, .png");
          return;
        }
      }
      const fileSizeMb: number = selectedImage.size / (1024 * 1024);

      if (fileSizeMb > maxFileSize) {
        showToast(
          "error",
          `File size exceeds the maximum limit of ${maxFileSize} MB`
        );
        return;
      }
      setImage(selectedImage);
      setImageURL(URL.createObjectURL(selectedImage));
    }
  };

  return (
    <>
      {loading === "loading" && <Loader />}
      <div>
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <h2 className="form-small-text scroll-title mb-0">
            Additional Details
          </h2>
          <Button
            type="button"
            className="dt-talent-btn"
            onClick={() => setEdit((prev) => !prev)}
          >
            <span className="material-symbols-outlined">Edit</span>
          </Button>
        </div>
        <Row>
          <Col sm="12">
            <Row>
              <Col lg="6" md="12">
                <div className="mb-3 mt-4">
                  <Label for="discover_drp">
                    How did you discover Gig Healthcare?{" "}
                    {/* <span className="asterisk">*</span> */}
                  </Label>
                  <CustomSelect
                    value={selectedGig}
                    id="discover_drp"
                    placeholder="Select Option"
                    name=""
                    noOptionsMessage={() => "No gig found"}
                    onChange={(doc) => handleGig(doc)}
                    isClearable={true}
                    isDisabled={!edit}
                    options={state?.additionalDetails?.map(
                      (item: AdditionalDetailsType) => ({
                        value: item.Id,
                        label: item.Option,
                      })
                    )}
                  />
                </div>
              </Col>
              {selectedGig?.label === "Referral" && (
                <Col lg="6" md="12">
                  <div className="mb-3 mt-4">
                    <Label for="discover_drp">
                      Referral Name or Professional/Referral ID
                      <span className="asterisk">*</span>
                    </Label>
                    <CustomInput
                      type="text"
                      placeholder="Referral Name or Professional/Referral ID"
                      id="deg_text"
                      invalid={!!errors.referral}
                      {...register("referral")}
                      className="text-capitalize"
                      disabled={!edit}
                    />
                    <FormFeedback>{errors.referral?.message}</FormFeedback>
                  </div>
                </Col>
              )}

              {selectedGig?.label === "Other" && (
                <Col lg="6" md="12">
                  <div className="mb-3 mt-4">
                    <Label for="discover_drp">
                      Other
                      <span className="asterisk">*</span>
                    </Label>
                    <CustomInput
                      type="text"
                      placeholder="Other"
                      id="deg_text"
                      invalid={!!errors.other}
                      {...register("other")}
                      className="text-capitalize"
                      disabled={!edit}
                    />
                    <FormFeedback>{errors.other?.message}</FormFeedback>
                  </div>
                </Col>
              )}
            </Row>
          </Col>
          <Col sm="6">
            <div className="accented-date-picker mb-3">
              <Label className="">
                Date of Birth
                {/* <span className="asterisk">*</span> */}
              </Label>
              <ReactDatePicker
                maxDate={new Date()}
                selected={dob}
                onChange={(date) => setDob(date)}
                timeIntervals={15}
                dateFormat="h:mm aa"
                className="custom-select-picker-all contract-select"
                isClearable={true}
                disabled={!edit}
                customInput={
                  <div className="custom-calendar-wrapper">
                    <CustomInput
                      value={
                        dob
                          ? moment(dob.toDateString()).format("MM-DD-YYYY")
                          : ""
                      }
                      placeholder="Date of Birth "
                      disabled={!edit}
                    />
                    {!dob && <img src={Calendar} className="calendar-icon" />}
                  </div>
                }
              />
            </div>
          </Col>
          <Col sm="6">
            <FormGroup>
              <Label for="ssn_input">
                SSN
                {/* <span className="asterisk">*</span> */}
              </Label>
              <CustomInput
                type="text"
                placeholder="SSN"
                id="ssn_input"
                invalid={!!errors.ssn}
                {...register("ssn")}
                className="text-capitalize"
                disabled={!edit}
              />
              <FormFeedback>{errors.ssn?.message}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <div className="mb-4">
          <Button
            className="blue-gradient-btn mb-0 mobile-btn"
            onClick={handleSubmit(onSubmit)}
            disabled={!edit}
          >
            Save
          </Button>
        </div>

        <p className="scroll-title mb-3" style={{ fontSize: "16px" }}>
          Signature
        </p>
        <div className="policy-content-wr">
          <p>
            Thank you for completing a profile with Gig Healthcare, we are
            excited for you to potentially join our team!
          </p>

          <p>
            By providing your signature you certify that the information in your
            profile is both accurate and truthful. You consent to Gig Healthcare
            verifying details such as work history, education, or references,
            and authorize Gig to supply all relevant profile information and
            medical compliance to our clients on your behalf. Additional details
            can be found in our
            <a href="#"> privacy policy</a>.
          </p>

          <p style={{ marginBottom: "20px" }}>
            By providing your signature you acknowledge that Gig Healthcare is
            an at-will employer, and all applications, job offers and employment
            opportunities are contingent upon a successful onboarding
          </p>
        </div>

        <div className="signature-wrapper mb-3">
          {/* <SignatureCanvas
            penColor="purple"
            canvasProps={{ width: 250, height: 80, className: "sigCanvas" }}
          /> */}
          <div className="signature-div">
            {imageLoading && (
              <div>
                <Loader />
              </div>
            )}
            {image && imageURL && (
              <img
                src={imageURL}
                alt="camera-img"
                width={"180px"}
                height={"120px"}
              />
            )}
            {!imageLoading && imageURL && !image && (
              <img
                src={imageURL}
                alt="signature-img"
                width={"180px"}
                height={"120px"}
              />
            )}
            {!imageLoading && !imageURL && !image && (
              <img src={imageURL} width={"180px"} height={"120px"} />
            )}
          </div>
          <div
            className={`mb-1 upload-image-btn`}
            style={{ width: "fit-content" }}
          >
            <input
              type="file"
              title="Click here to upload"
              accept=".jpg, .jpeg, .png, .heic"
              className="custom-file-input hover-upload-btn-disabled"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleImageUpload(e)
              }
            />
          </div>
        </div>
        <div className="file-para">
          <p
            style={{
              color: "#717B9E",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              letterSpacing: "-0.28px",
              marginBottom: "0px",
            }}
          >
            Supported Formats: .jpg, .jpeg, .png upto 2 MB
          </p>
        </div>
      </div>
    </>
  );
};

export default AdditionalDetails;
