import { Form, Link, useNavigate, useParams } from "react-router-dom";
import { Col, FormFeedback, Label, Row } from "reactstrap";
import CustomInput from "../../../../../components/custom/CustomInput";
import CustomRichTextEditor from "../../../../../components/custom/CustomTextEditor";
import CustomButton from "../../../../../components/custom/CustomBtn";
import CustomSelect from "../../../../../components/custom/CustomSelect";
import { Contract, PaymentTerm } from "../../../../../types/ContractTerm";
import { useContext, useEffect, useState } from "react";
import {
  createContractTerm,
  editContractTerm,
  getContractDetails,
  getContractTermId,
  getPayementTerms,
} from "../../../../../services/ContractTerm";
import {
  capitalize,
  formatPhoneNumber,
  showToast,
} from "../../../../../helpers";
import { useForm } from "react-hook-form";
import contractSchema from "../../../../../helpers/schemas/ContractTerm";
import { yupResolver } from "@hookform/resolvers/yup";
import { getTextContent } from "../../../../../helpers";
import { FacilityActiveComponentProps } from "../../../../../types";
import { FacilityActiveComponentContext } from "../../../../../helpers/context/FacilityActiveComponent";
import { AddContractProps } from "../../../../../types/ContractTerm";
import Loader from "../../../../../components/custom/CustomSpinner";

const AddContract = ({
  switchToNextTab,
  onContractIdChange,
  setActiveTab,
}: AddContractProps) => {
  const [paymentTerm, setPaymentTerm] = useState<PaymentTerm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [missedPunchPayrollProcess, setMissedPunchPayrollProcess] =
    useState("");
  const [costCenters, setCostCenters] = useState("");
  const [kronosTimeCodes, setKronosTimeCodes] = useState("");
  const [contractIds, setContractIds] = useState<number>();
  const { Id, contractId } = useParams();
  const navigate = useNavigate();
  const { setActiveComponent } = useContext<FacilityActiveComponentProps>(
    FacilityActiveComponentContext
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Contract>({
    resolver: yupResolver(contractSchema) as any,
  });

  useEffect(() => {
    const payementTermList = async () => {
      try {
        setLoading(true);
        const res = await getPayementTerms(Number(Id));
        setLoading(false);
        setPaymentTerm(res);
      } catch (error: any) {
        console.error(error);
        setLoading(false);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    };
    payementTermList();
  }, []);

  useEffect(() => {
    if (!contractId) {
      const getContractId = async () => {
        try {
          setLoading(true);
          const Id1 = await getContractTermId(Number(Id));
          setLoading(false);
          setContractIds(Id1.nextId);
        } catch (error: any) {
          console.error(error);
          setLoading(false);
          showToast(
            "error",
            error?.response?.data?.message || "Something went wrong"
          );
        }
      };
      getContractId();
    }
  }, [contractId, Id]);

  const fetchContractData = async () => {
    setLoading(true);
    try {
      if (contractId !== undefined) {
        const data = await getContractDetails(Number(Id), Number(contractId));
        setValue("contactName", capitalize(data.ContactName));
        setValue("contactNumber", formatPhoneNumber(data.ContactNumber));
        setValue("workWeek", data.WorkWeek);
        setValue("superAdminFee", data.SuperAdminFee);
        setValue("nonBillableOrientation", data.NonBillableOrientation);
        setValue("holidayMultiplier", data.HolidayMultiplier);
        setValue("includedHolidays", data.IncludedHolidays);
        setValue("holidayBillingRules", data.HolidayBillingRules);
        setValue("overtimeMultiplier", data.OvertimeMultiplier);
        setValue("overtimeThreshold", data.OvertimeThreshold);
        setValue("onCallRate", data.OnCallRate);
        setValue("doubletimeMultiplier", data.DoubletimeMultiplier);
        setValue("callBackMultiplier", data.CallBackMultiplier);
        setValue("timeRoundingGuidelines", data.TimeRoundingGuidelines);
        setValue("specialBillingDetails", data.SpecialBillingDetails);
        setValue("gauranteedHrs", data.GauranteedHrs);
        setValue("timekeepingProcess", data.TimekeepingProcess);

        if (data.PaymentTerm && data.PaymentTerm.Id) {
          setSelectedType({
            value: data.PaymentTerm.Id,
            label: data.PaymentTerm.Term,
          });
        }
        setMissedPunchPayrollProcess(data.MissedPunchPayrollProcess);
        setCostCenters(data.CostCenters);
        setKronosTimeCodes(data.KronosTimeCodes);
      }
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      showToast("error", error.response.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchContractData();
  }, [contractId]);

  const validateMissedPunch = () => {
    const textContent = getTextContent(missedPunchPayrollProcess);
    if (!textContent) {
      showToast("error", "Missed Punch/Payroll Process is required");
      return false;
    }
    if (textContent.length > 255) {
      showToast(
        "error",
        "Missed Punch/Payroll Process should be less than 256 characters"
      );
      return false;
    }
    return true;
  };

  const validateCostCenters = () => {
    const textContent = getTextContent(costCenters);
    if (!textContent) {
      showToast("error", "Cost Centers is required");
      return false;
    }
    if (textContent.length > 255) {
      showToast("error", "Cost Centers should be less than 256 characters");
      return false;
    }
    return true;
  };

  const validateKronosTimeCodes = () => {
    const textContent = getTextContent(kronosTimeCodes);
    if (!textContent) {
      showToast("error", "Kronos Specific Time Codes is required");
      return false;
    }
    if (textContent.length > 255) {
      showToast(
        "error",
        "Kronos Specific Time Codes should be less than 256 characters"
      );
      return false;
    }
    return true;
  };

  const onSubmit = async (data: Contract) => {
    if (!selectedType) {
      return showToast("error", "Please select a payment term");
    }

    if (
      !validateMissedPunch() ||
      !validateCostCenters() ||
      !validateKronosTimeCodes()
    ) {
      return;
    }
    const phone: string = data.contactNumber.replace(/\D/g, "");
    const fullData = {
      ...data,
      contactNumber: phone,
      paymentTermId: selectedType?.value,
      missedPunchPayrollProcess,
      costCenters,
      kronosTimeCodes,
    };
    if (!contractId) {
      try {
        setLoading(true);
        const response = await createContractTerm(Number(Id), fullData);
        const newContractId = response.id;
        onContractIdChange(newContractId);
        if (response?.id) {
          switchToNextTab();
          setActiveTab("2");
        }
        setLoading(false);
        reset();
        showToast("success", "Contract term created successfully");
        setSelectedType(null);
        setMissedPunchPayrollProcess("");
        setCostCenters("");
        setKronosTimeCodes("");
      } catch (error: any) {
        console.error(error);
        setLoading(false);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    } else {
      try {
        const {
          contactName,
          workWeek,
          superAdminFee,
          nonBillableOrientation,
          holidayMultiplier,
          includedHolidays,
          holidayBillingRules,
          overtimeMultiplier,
          overtimeThreshold,
          onCallRate,
          doubletimeMultiplier,
          callBackMultiplier,
          timeRoundingGuidelines,
          specialBillingDetails,
          gauranteedHrs,
          timekeepingProcess,
        } = data;
        setLoading(true);
        const response = await editContractTerm(
          Number(Id),
          Number(contractId),
          contactName,
          phone,
          selectedType?.value,
          workWeek,
          superAdminFee,
          nonBillableOrientation,
          holidayMultiplier,
          includedHolidays,
          holidayBillingRules,
          overtimeMultiplier,
          overtimeThreshold,
          onCallRate,
          doubletimeMultiplier,
          callBackMultiplier,
          timeRoundingGuidelines,
          specialBillingDetails,
          gauranteedHrs,
          timekeepingProcess,
          missedPunchPayrollProcess,
          costCenters,
          kronosTimeCodes
        );
        if (response?.status === 200) {
          switchToNextTab();
          setActiveTab("2");
        }
        setLoading(false);
        reset();
        showToast("success", "Contract term Edited successfully");
        setSelectedType(null);
        setMissedPunchPayrollProcess("");
        setCostCenters("");
        setKronosTimeCodes("");
      } catch (error: any) {
        console.error(error);
        setLoading(false);
        showToast(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    }
  };

  const handleCancel = () => {
    setActiveComponent("Contract Terms");
    navigate(`/facility/${Id}`);
  };

  return (
    <div>
      {loading && <Loader />}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mt-3">
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Accounts Payable(AP) Contact Name{" "}
              <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="Contact Name"
              invalid={!!errors.contactName}
              {...register("contactName")}
            />
            <FormFeedback>{errors.contactName?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Accounts Payable(AP) Contact Number{" "}
              <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="Contact Number"
              invalid={!!errors.contactNumber}
              {...register("contactNumber", {
                onChange: (e) => {
                  const formattedNumber: string = formatPhoneNumber(
                    e.target.value
                  );
                  setValue("contactNumber", formattedNumber);
                },
              })}
            />
            <FormFeedback>{errors.contactNumber?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Contract ID <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="Contract ID"
              disabled
              value={contractId ? `FCON-${contractId}` : `FCON-${contractIds}`}
            />
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Payment Terms<span className="asterisk">*</span>
            </Label>
            <CustomSelect
              id="paymentterm"
              name="payemtterm"
              options={paymentTerm.map((type) => ({
                label: type.Term,
                value: type.Id,
              }))}
              noOptionsMessage={() => "No options available"}
              placeholder="Select  Payment Terms"
              value={
                selectedType
                  ? {
                      value: selectedType?.value,
                      label: selectedType?.label,
                    }
                  : null
              }
              onChange={(selectedOption) => {
                setSelectedType(selectedOption);
              }}
            />
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Work Week <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="Work Week"
              invalid={!!errors.workWeek}
              {...register("workWeek")}
            />
            <FormFeedback>{errors.workWeek?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Super Admin Fee <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="Super Admin Fee "
              invalid={!!errors.superAdminFee}
              {...register("superAdminFee")}
            />
            <FormFeedback>{errors.superAdminFee?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Non-Billable Orientation <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="Non Billable Orientation"
              invalid={!!errors.nonBillableOrientation}
              {...register("nonBillableOrientation")}
            />
            <FormFeedback>
              {errors.nonBillableOrientation?.message}
            </FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Holiday Multiplier <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder=" Holiday Multiplier "
              invalid={!!errors.holidayMultiplier}
              {...register("holidayMultiplier")}
            />
            <FormFeedback>{errors.holidayMultiplier?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              List of Included Holidays <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="List of Included Holidays "
              invalid={!!errors.includedHolidays}
              {...register("includedHolidays")}
            />
            <FormFeedback>{errors.includedHolidays?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Holiday Billing Rules <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder=" Holiday Billing Rules "
              invalid={!!errors.holidayBillingRules}
              {...register("holidayBillingRules")}
            />
            <FormFeedback>{errors.holidayBillingRules?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Overtime Multiplier <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="Overtime Multiplier "
              invalid={!!errors.overtimeMultiplier}
              {...register("overtimeMultiplier")}
            />
            <FormFeedback>{errors.overtimeMultiplier?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Overtime Threshold <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="Overtime Threshold  "
              invalid={!!errors.overtimeThreshold}
              {...register("overtimeThreshold")}
            />
            <FormFeedback>{errors.overtimeThreshold?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              On-Call Rate <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="$ 0.00"
              invalid={!!errors.onCallRate}
              {...register("onCallRate")}
            />
            <FormFeedback>{errors.onCallRate?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Double Time Multiplier{" "}
              <span className="california-text">(California Only)</span>
            </Label>
            <CustomInput
              placeholder="$ 0.00"
              invalid={!!errors.doubletimeMultiplier}
              {...register("doubletimeMultiplier")}
            />
            <FormFeedback>{errors.doubletimeMultiplier?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Call Back Multiplier <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="Call Back Multiplier "
              invalid={!!errors.callBackMultiplier}
              {...register("callBackMultiplier")}
            />
            <FormFeedback>{errors.callBackMultiplier?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Time Rounding Guidelines <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="Time Rounding Guidelines "
              invalid={!!errors.timeRoundingGuidelines}
              {...register("timeRoundingGuidelines")}
            />
            <FormFeedback>
              {errors.timeRoundingGuidelines?.message}
            </FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Special Billing Details <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="Special Billing Details"
              invalid={!!errors.specialBillingDetails}
              {...register("specialBillingDetails")}
            />
            <FormFeedback>{errors.specialBillingDetails?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Guaranteed Hours <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="Guaranteed Hours "
              invalid={!!errors.gauranteedHrs}
              {...register("gauranteedHrs")}
            />
            <FormFeedback>{errors.gauranteedHrs?.message}</FormFeedback>
          </Col>
          <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
            <Label className="">
              Timekeeping Process <span className="asterisk">*</span>
            </Label>
            <CustomInput
              placeholder="Timekeeping Process "
              invalid={!!errors.timekeepingProcess}
              {...register("timekeepingProcess")}
            />
            <FormFeedback>{errors.timekeepingProcess?.message}</FormFeedback>
          </Col>
          <Col xxl="12" xl="12" lg="12" className="col-group">
            <Label className="">
              Missed Punch/ Payroll Process <span className="asterisk">*</span>
            </Label>
            <CustomRichTextEditor
              content={missedPunchPayrollProcess}
              handleChange={setMissedPunchPayrollProcess}
            />
          </Col>
          <Col xxl="12" xl="12" lg="12" className="col-group">
            <Label className="">
              Cost Centers Listed by Unit <span className="asterisk">*</span>
            </Label>
            <CustomRichTextEditor
              content={costCenters}
              handleChange={setCostCenters}
            />
          </Col>
          <Col xxl="12" xl="12" lg="12" className="col-group">
            <Label className="">
              Kronos Specific Time Codes <span className="asterisk">*</span>
            </Label>
            <CustomRichTextEditor
              content={kronosTimeCodes}
              handleChange={setKronosTimeCodes}
            />
          </Col>
        </Row>
        <div className="btn-wrapper">
          <CustomButton className="primary-btn">Save & Next</CustomButton>
          <Link onClick={handleCancel} to={""}>
            <CustomButton className="secondary-btn">Cancel</CustomButton>
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default AddContract;
