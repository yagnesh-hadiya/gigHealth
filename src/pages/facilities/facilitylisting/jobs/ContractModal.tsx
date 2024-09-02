import { memo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, Form, Row, Col, Label, Button } from 'reactstrap';
import File from "../../../../assets/images/file.svg";
import CustomInput from '../../../../components/custom/CustomInput';
import CustomRichTextEditor from '../../../../components/custom/CustomTextEditor';
import { formatPhoneNumber, ucFirstChar } from '../../../../helpers';
import CustomSelect from '../../../../components/custom/CustomSelect';

const ContractModal = ({ ContractId, ContactName, ContactNumber, PaymentTerm, WorkWeek, SuperAdminFee, NonBillableOrientation, HolidayMultiplier, IncludedHolidays, HolidayBillingRules, OvertimeMultiplier, OvertimeThreshold, OnCallRate, CallBackMultiplier, TimeRoundingGuidelines, SpecialBillingDetails, GauranteedHrs, MissedPunchPayrollProcess, CostCenters, KronosTimeCodes, ContractDocuments }: any) => {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    return (
        <>
            <div>
                {ContractId ?
                    (<Button className='contract-id' onClick={toggle}>
                        {!ContractId ? '' : `FCONID-${ContractId}`}
                    </Button>)
                    : (
                        <CustomInput value={''} disabled />
                    )
                }

                <Modal isOpen={modal} toggle={toggle} centered={true} size='xl'>
                    <ModalHeader toggle={toggle}>Contract ID - FCONID-{ContractId}</ModalHeader>
                    <ModalBody>
                        <div className='view-file-wrapper'>
                            {ContractDocuments && ContractDocuments.map((doc: { Id: number, FileName: string, Notes: string, CreatedOn: string }) => (
                                <div key={doc?.Id} className="d-flex align-items-center view-file-info-section pb-3 pt-3">
                                    <div className="file-img d-flex">
                                        <img src={File} className="" alt="File Icon" />
                                    </div>
                                    <div>
                                        <p className='file-name'>{doc?.FileName}</p>
                                        <div className='file-content'>
                                            <span className='info-title me-2'>Uploaded On:</span>
                                            <span className='info-content'>
                                                {new Date(doc?.CreatedOn).toLocaleString("en-GB", {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: false
                                                })}
                                            </span>
                                            <span className='info-title me-2'>Notes:</span>
                                            <span className='info-content'>{doc?.Notes}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Form>
                            <Row>
                                <Col xxl="4" xl="4" lg="6" className="col-group mt-4">
                                    <Label className="">
                                        Accounts Payable(AP) Contact Name{" "}
                                        <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="Contact Name" value={ucFirstChar(ContactName)} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group mt-4">
                                    <Label className="">
                                        Accounts Payable(AP) Contact Number{" "}
                                        <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput value={ContactNumber ? formatPhoneNumber(ContactNumber) : ''} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group mt-4">
                                    <Label className="">
                                        Contract ID <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="Contract ID" disabled value={`FCONID-${!ContractId ? '' : ContractId}`} />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        Payment Terms<span className="asterisk">*</span>
                                    </Label>
                                    <CustomSelect
                                        id="paymentterm"
                                        name="paymentterm"
                                        options={[]}
                                        noOptionsMessage={() => "No options available"}
                                        placeholder="Select Payment Terms"
                                        value={PaymentTerm ? { value: PaymentTerm?.Id, label: PaymentTerm?.Term } : null}
                                        onChange={() => { }}
                                        isDisabled={true}
                                    />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        Work Week <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput value={ucFirstChar(WorkWeek)} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        Super Admin Fee <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput value={SuperAdminFee} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        Non-Billable Orientation <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput value={ucFirstChar(NonBillableOrientation)} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        Holiday Multiplier <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput value={HolidayMultiplier} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        List of Included Holidays <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput value={ucFirstChar(IncludedHolidays)} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        Holiday Billing Rules <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={ucFirstChar(HolidayBillingRules)} />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        Overtime Multiplier <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={OvertimeMultiplier} />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        Overtime Threshold <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={OvertimeThreshold} />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        On-Call Rate <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="$ 0.00" disabled value={OnCallRate} />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        Call Back Multiplier <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={CallBackMultiplier} />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        Time Rounding Guidelines <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={ucFirstChar(TimeRoundingGuidelines)} />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        Special Billing Details <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={ucFirstChar(SpecialBillingDetails)} />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        Guaranteed Hours <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={GauranteedHrs} />
                                </Col>
                                <Col xxl="4" xl="4" lg="6" className="col-group">
                                    <Label className="">
                                        Cancellation Policy <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled />
                                </Col>
                                <Col xxl="12" xl="12" lg="12" className="col-group">
                                    <Label className="">
                                        Missed Punch/ Payroll Process <span className="asterisk">*</span>
                                    </Label>
                                    <CustomRichTextEditor content={MissedPunchPayrollProcess ? MissedPunchPayrollProcess : ''} readOnly={true} />
                                </Col>
                                <Col xxl="12" xl="12" lg="12" className="col-group">
                                    <Label className="">
                                        Cost Centers Listed by Unit <span className="asterisk">*</span>
                                    </Label>
                                    <CustomRichTextEditor content={CostCenters ? CostCenters : ''} readOnly={true} />
                                </Col>
                                <Col xxl="12" xl="12" lg="12" className="col-group">
                                    <Label className="">
                                        Kronos Specific Time Codes <span className="asterisk">*</span>
                                    </Label>
                                    <CustomRichTextEditor content={KronosTimeCodes ? KronosTimeCodes : ''} readOnly={true} />
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        </>
    );
}

export default memo(ContractModal)