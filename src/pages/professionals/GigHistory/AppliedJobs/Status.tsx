import { PopoverBody, UncontrolledPopover } from "reactstrap";

const Status = () => {
  return (
    <UncontrolledPopover placement="left" target="UncontrolledPopover">
      <PopoverBody>
        <div className="application-history-stepper">
          <div className="stepper-btn-wrapper">
            <h6 className="popover-title">Application History</h6>
            <button type="button" onClick={() => {}} className="close">
              <span aria-hidden="true" className="material-symbols-outlined ">
                close
              </span>
            </button>
          </div>
          <div className="container-master">
            <div className="step">
              <div className="v-stepper">
                <div>
                  <div className="circle"></div>
                  <div className="line"></div>
                </div>
                <div className="text">Placements</div>
                <div className="border-line"></div>
              </div>

              <div className="content">04/14/2023 10:22:36</div>
            </div>

            <div className="step">
              <div className="v-stepper">
                <div>
                  <div className="circle"></div>
                  <div className="line"></div>
                </div>
                <div className="text">Offered</div>
                <div className="border-line"></div>
              </div>

              <div className="content">04/14/2023 10:22:36</div>
            </div>

            <div className="step">
              <div className="v-stepper">
                <div>
                  <div className="circle"></div>
                  <div className="line"></div>
                </div>
                <div className="text">Submitted</div>
                <div className="border-line"></div>
              </div>

              <div className="content">04/14/2023 10:22:36</div>
            </div>
            <div className="step">
              <div className="v-stepper">
                <div>
                  <div className="circle"></div>
                  <div className="line"></div>
                </div>
                <div className="text">Declined</div>
                <div className="border-line"></div>
              </div>

              <div className="content">04/14/2023 10:22:36</div>
            </div>

            <div className="step">
              <div className="v-stepper">
                <div>
                  <div className="circle"></div>
                  <div className="line"></div>
                </div>
                <div className="text">Applied</div>
                <div className="border-line"></div>
              </div>

              <div className="content">04/14/2023 10:22:36</div>
            </div>
          </div>
        </div>
      </PopoverBody>
    </UncontrolledPopover>
  );
};

export default Status;
