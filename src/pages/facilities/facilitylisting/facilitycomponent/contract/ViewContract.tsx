import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Row, Col, Label } from 'reactstrap';
import CustomInput from '../../../../../components/custom/CustomInput';
import CustomRichTextEditor from '../../../../../components/custom/CustomTextEditor';
import File from "../../../../../assets/images/file.svg";
import { ContractData, PaymentTerm, ViewContractProps } from '../../../../../types/ContractTerm';
import { getContractDetails, getPayementTerms } from '../../../../../services/ContractTerm';
import { capitalize, formatPhoneNumber, showToast, ucFirstChar } from '../../../../../helpers';
import { useParams } from 'react-router';
import Loader from '../../../../../components/custom/CustomSpinner';
import CustomSelect from '../../../../../components/custom/CustomSelect';



const ViewContract = ({ Id, isOpen, toggle }: ViewContractProps) => {
    const [loading, setLoading] = useState(false);
    const [contractData, setContractData] = useState<ContractData | null>(null);
    const [selectedTerm, setSelectedTerm] = useState<{ value: number; label: string; } | null>(null);
    const [paymentTerm, setPaymentTerm] = useState<PaymentTerm[]>([])
    const facilityDataId = useParams();


    useEffect(() => {
        const fetchContractData = async () => {
            setLoading(true);
            try {
                if (Id !== undefined) {
                    const data = await await getContractDetails(Number(facilityDataId?.Id), Id);
                    setContractData(data);
                }
                setLoading(false);
            }
            catch (error: any) {
                console.error(error);
                setLoading(false);
                showToast("error", error.response.message || "Something went wrong");
            }
        };
        fetchContractData();
    }, []);

    useEffect(() => {
        if (contractData && contractData.PaymentTerm) {
            setSelectedTerm({
                label: contractData.PaymentTerm.Term,
                value: contractData.PaymentTerm.Id
            });
        }
    }, [contractData]);


    useEffect(() => {
        const payementTermList = async () => {
            try {
                setLoading(true);
                const res = await getPayementTerms(Number(facilityDataId?.Id));
                setLoading(false);
                setPaymentTerm(res);
            } catch (error: any) {
                console.error(error);
                setLoading(false);
                showToast('error', error?.response?.data?.message || 'Something went wrong');
            }
        }
        payementTermList();

    }, [])

    return (
        <div>

            <Modal className='view-contract-modal' isOpen={isOpen} toggle={toggle} centered={true} size='xl'>
                <ModalHeader toggle={toggle}>Contract ID - {loading ? <Loader /> : `FCON-${Id}`}</ModalHeader>
                <ModalBody>
                    {loading ? <Loader /> : contractData ?
                        (<>
                            <div className='view-file-wrapper'>
                                {contractData?.ContractDocuments?.map((document) => (
                                    <>
                                        <div className="d-flex align-items-center view-file-info-section pb-3 pt-3">
                                            <div className="file-img d-flex">
                                                <img src={File} className="" />
                                            </div>
                                            <div>
                                                <p className='file-name'>{document.FileName}</p>
                                                <div className='file-content'><span className='info-title'>Uploaded On:</span> <span className='info-content'> {new Date(document.CreatedOn).toLocaleString("en-GB", {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: false
                                                })}</span>
                                                    <span className='info-title'>Notes:</span> <span className='info-content'>{document.Notes}</span></div>
                                            </div>
                                        </div>
                                    </>))}
                            </div>
                            {/* <Form> */}
                            <Row className='mt-3'>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Accounts Payable(AP) Contact Name{" "}
                                        <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput value={capitalize(contractData?.ContactName)} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Accounts Payable(AP) Contact Number{" "}
                                        <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput value={formatPhoneNumber(contractData?.ContactNumber)} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Contract ID <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="Contract ID" disabled value={`FCON-${Id}`} />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Payment Terms<span className="asterisk">*</span>
                                    </Label>
                                    <CustomSelect
                                        id="paymentterm"
                                        name="paymentterm"
                                        options={paymentTerm.map(type => ({ label: type.Term, value: type.Id }))}
                                        noOptionsMessage={() => "No options available"}
                                        placeholder="Select Payment Terms"
                                        value={selectedTerm}
                                        onChange={(selectedOption) => setSelectedTerm(selectedOption)}
                                        isDisabled={true}
                                    />


                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Work Week <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput value={ucFirstChar(contractData?.WorkWeek)} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Super Admin Fee <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput value={contractData?.SuperAdminFee} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Non-Billable Orientation <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput value={ucFirstChar(contractData?.NonBillableOrientation)} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Holiday Multiplier <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput value={contractData?.HolidayMultiplier} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        List of Included Holidays <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput value={ucFirstChar(contractData?.IncludedHolidays)} disabled />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Holiday Billing Rules <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={ucFirstChar(contractData?.HolidayBillingRules)} />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Overtime Multiplier <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={contractData?.OvertimeMultiplier} />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Overtime Threshold <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={contractData?.OvertimeThreshold} />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        On-Call Rate <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="$ 0.00" disabled value={contractData?.OnCallRate} />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Double Time Pay Rate <span className="california-text">(California Only)</span>
                                    </Label>
                                    <CustomInput placeholder="$ 0.00" disabled value={contractData?.DoubletimeMultiplier} />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Call Back Multiplier <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={contractData?.CallBackMultiplier} />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Time Rounding Guidelines <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={ucFirstChar(contractData?.TimeRoundingGuidelines)} />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Special Billing Details <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={ucFirstChar(contractData?.SpecialBillingDetails)} />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Guaranteed Hours <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={contractData?.GauranteedHrs} />
                                </Col>
                                <Col xxl="4" xl="4" lg="4" md="6" className="col-group">
                                    <Label className="">
                                        Timekeeping Process <span className="asterisk">*</span>
                                    </Label>
                                    <CustomInput placeholder="" disabled value={ucFirstChar(contractData?.TimekeepingProcess)} />
                                </Col>
                                <Col xxl="12" xl="12" lg="12" className="col-group">
                                    <Label className="">
                                        Missed Punch/ Payroll Process <span className="asterisk">*</span>
                                    </Label>
                                    <CustomRichTextEditor content={contractData.MissedPunchPayrollProcess}
                                        readOnly={true} />
                                </Col>
                                <Col xxl="12" xl="12" lg="12" className="col-group">
                                    <Label className="">
                                        Cost Centers Listed by Unit <span className="asterisk">*</span>
                                    </Label>
                                    <CustomRichTextEditor content={contractData.CostCenters}
                                        readOnly={true} />
                                </Col>
                                <Col xxl="12" xl="12" lg="12" className="col-group">
                                    <Label className="">
                                        Kronos Specific Time Codes <span className="asterisk">*</span>
                                    </Label>
                                    <CustomRichTextEditor content={contractData.KronosTimeCodes}
                                        readOnly={true} />
                                </Col>
                            </Row>
                            {/* </Form> */}
                        </>
                        ) : null}
                </ModalBody>
            </Modal>
        </div>
    );
}

export default ViewContract