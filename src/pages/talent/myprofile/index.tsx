import ProfileInformationCard from "./ProfileInformationCard";
import WorkHistory from "./WorkHistory";
import ReferenceForm from "./ReferenceForm";
import { useState, useEffect, useRef, useReducer } from "react";
import Education from "./Education";
import ProfessionalInfo from "./ProfessionalInfo";
import BackgroundQuestions from "./BackgroundQuestions";
import AdditionalDetails from "./AdditionalDetails";
import AdditionalDocuments from "./AdditionalDocuments";
import { useSelector } from "react-redux";
import {
  getAuthDetails,
  getProfilePercentage,
} from "../../../store/ProfessionalAuthStore";
import moment from "moment";
import { showToast } from "../../../helpers";
import {
  getProfessionalAdditionalDetails,
  getProfessionalBgQuestions,
  getProfessionalDocument,
  getProfessionalUploadedComplianceDocs,
} from "../../../services/ProfessionalMyProfile";
import myProfileReducer from "../../../helpers/reducers/MyProfileReducer";
import Loader from "../../../components/custom/CustomSpinner";
import { ActionType } from "../../../types/ProfessionalAuth";

const Index = () => {
  // const [activeScrollTarget, setActiveScrollTarget] = useState<string>("div1");
  // const scrollRef = useRef<HTMLDivElement>(null);

  const initialState = {
    selectedState: null,
    selectedCity: null,
    selectedZip: null,
    states: [],
    cities: [],
    zip: [],
    selectedQuestion: null,
    bgQuestions: [],
    documents: [],
    uploadedDocuments: [],
    additionalDetails: [],
    gendersList: [],
    federalQuestions: [],
    emergencyContactList: [],
    talentJobDetailsList: [],
    requiredDocsList: [],
  };

  const [activeScrollTarget, setActiveScrollTarget] = useState<string>("div1");
  const [loading, setLoading] = useState<"idle" | "loading" | "error">("idle");
  const scrollRef = useRef<HTMLDivElement>(null);
  const authDetails = useSelector(getAuthDetails);
  const currentTime = moment();
  const currentHour = currentTime.hour();
  const profilePercentage = useSelector(getProfilePercentage);
  const [state, dispatch] = useReducer(myProfileReducer, initialState);
  const [fetchDetails, setFetchDetails] = useState<boolean>(false);

  let greeting;
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 16) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollBox = scrollRef.current;
      if (scrollBox) {
        const scrollPosition = scrollBox.scrollTop + scrollBox.offsetHeight / 1;

        const sections = Array.from(scrollBox.children) as HTMLElement[];
        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;

          if (
            scrollPosition >= sectionTop + 10 &&
            scrollPosition < sectionTop + sectionHeight
          ) {
            setActiveScrollTarget(section.id);
          }
        });
      }
    };

    const scrollBox = scrollRef.current;
    if (scrollBox) {
      scrollBox.addEventListener("scroll", handleScroll);

      return () => {
        scrollBox.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const scrollToDiv = (refName: string) => {
    const element = document.getElementById(refName);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // setActiveScrollTarget(refName);
    }
  };

  const fetchData = async () => {
    setLoading("loading");
    const [document, bgQuestion, coreDocs, additionalDocs] = await Promise.all([
      getProfessionalDocument(),
      getProfessionalBgQuestions(),
      getProfessionalUploadedComplianceDocs(),
      getProfessionalAdditionalDetails(),
    ]);
    dispatch({
      type: ActionType.SetDocuments,
      payload: document?.data?.data,
    });
    dispatch({
      type: ActionType.SetBackgroundQuestion,
      payload: bgQuestion?.data?.data,
    });
    dispatch({
      type: ActionType.SetUploadedDocuments,
      payload: coreDocs.data?.data,
    });
    dispatch({
      type: ActionType.SetAdditionalDetails,
      payload: additionalDocs?.data?.data,
    });
    setLoading("idle");
    try {
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
    fetchData();
  }, []);

  return (
    <>
      {loading === "loading" && <Loader />}
      <div className="my-profile-wrapper">
        <div className="profile-name-wr">
          <div className="profile-max-width text-capitalize">
            <h2>
              {greeting}..!! {authDetails ? authDetails[0]?.FirstName : "-"}{" "}
              {authDetails ? authDetails[0]?.LastName : "-"}
            </h2>
          </div>
        </div>

        <div className="my-profile-max-width">
          <ProfileInformationCard fetchDetails={fetchDetails} />
          <div className="d-flex profile-scroll-wr">
            <div className="scroll-box scroll-anchor-wrapper">
              <h3 className="scroll-title">Complete Your Profile</h3>
              {/* <div className="mobile-view-wr">
                {[
                  { title: "Work History", id: "div1" },
                  { title: "References", id: "div2" },
                  { title: "Education", id: "div3" },
                  { title: "Professional Information", id: "div4" },
                  { title: "Background Questions", id: "div5" },
                  { title: "Additional Details", id: "div6" },
                  { title: "Additional Documents", id: "div7" },
                ].map(({ title, id }, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center mb-2 mobile_margin"
                    style={{ gap: "10px" }}
                  >
                    <button
                      className={`scroll-nav ${
                        activeScrollTarget === id ? "active" : ""
                      }`}
                      onClick={() => scrollToDiv(id)}
                    >
                      {title} <span>0%</span>
                    </button>
                    <p>0%</p>
                  </div>
                ))}
              </div> */}
              <div className="mobile-view-wr">
                <div
                  className="d-flex justify-content-between align-items-center mb-2 mobile_margin"
                  style={{ gap: "10px" }}
                >
                  <button
                    className={`scroll-nav ${
                      activeScrollTarget === "div1" ? "active" : ""
                    }`}
                    onClick={() => scrollToDiv("div1")}
                  >
                    Work History <span>{profilePercentage?.workHistory}%</span>
                  </button>
                  <p>{profilePercentage?.workHistory}%</p>
                </div>

                <div
                  className="d-flex justify-content-between align-items-center mb-2 mobile_margin"
                  style={{ gap: "10px" }}
                >
                  <button
                    className={`scroll-nav ${
                      activeScrollTarget === "div2" ? "active" : ""
                    }`}
                    onClick={() => scrollToDiv("div2")}
                  >
                    References <span>{profilePercentage?.references}%</span>
                  </button>
                  <p>{profilePercentage?.references}%</p>
                </div>

                <div
                  className="d-flex justify-content-between align-items-center mb-2 mobile_margin"
                  style={{ gap: "10px" }}
                >
                  <button
                    className={`scroll-nav ${
                      activeScrollTarget === "div3" ? "active" : ""
                    }`}
                    onClick={() => scrollToDiv("div3")}
                  >
                    Education <span>{profilePercentage?.education}%</span>
                  </button>
                  <p>{profilePercentage?.education}%</p>
                </div>

                <div
                  className="d-flex justify-content-between align-items-center mb-2 mobile_margin"
                  style={{ gap: "10px" }}
                >
                  <button
                    className={`scroll-nav ${
                      activeScrollTarget === "div4" ? "active" : ""
                    }`}
                    onClick={() => scrollToDiv("div4")}
                  >
                    Professional Information{" "}
                    <span>{profilePercentage?.professionalInformation}%</span>
                  </button>{" "}
                  <p>{profilePercentage?.professionalInformation}%</p>
                </div>

                <div
                  className="d-flex justify-content-between align-items-center mb-2 mobile_margin"
                  style={{ gap: "10px" }}
                >
                  <button
                    className={`scroll-nav ${
                      activeScrollTarget === "div5" ? "active" : ""
                    }`}
                    onClick={() => scrollToDiv("div5")}
                  >
                    Background Questions{" "}
                    <span>{profilePercentage?.backgroundQuestions}%</span>
                  </button>
                  <p>{profilePercentage?.backgroundQuestions}%</p>
                </div>

                <div
                  className="d-flex justify-content-between align-items-center mb-2 mobile_margin"
                  style={{ gap: "10px" }}
                >
                  <button
                    className={`scroll-nav ${
                      activeScrollTarget === "div6" ? "active" : ""
                    }`}
                    onClick={() => scrollToDiv("div6")}
                  >
                    Additional Details{" "}
                    <span>{profilePercentage?.additionalDetails}%</span>
                  </button>
                  <p>{profilePercentage?.additionalDetails}%</p>
                </div>

                <div
                  className="d-flex justify-content-between align-items-center mb-2 mobile_margin"
                  style={{ gap: "10px" }}
                >
                  <button
                    className={`scroll-nav ${
                      activeScrollTarget === "div7" ? "active" : ""
                    }`}
                    onClick={() => scrollToDiv("div7")}
                  >
                    Additional Documents
                    {/* <span>0%</span> */}
                  </button>
                  {/* <p>0%</p> */}
                </div>
              </div>
            </div>
            <div
              className="scroll-box scroll-main-wrapper"
              ref={scrollRef}
              style={{ overflowY: "auto", maxHeight: "calc(100vh - 150px)" }}
            >
              <div id="div1" className="scroll-section scroll-first-section">
                <WorkHistory setFetchDetails={setFetchDetails} />
              </div>
              <div id="div2" className="scroll-section scroll-second-section">
                <ReferenceForm setFetchDetails={setFetchDetails} />
              </div>
              <div id="div3" className="scroll-section scroll-third-section">
                <Education setFetchDetails={setFetchDetails} />
              </div>
              <div id="div4" className="scroll-section scroll-fourth-section">
                <ProfessionalInfo setFetchDetails={setFetchDetails} />
              </div>
              <div id="div5" className="scroll-section scroll-fifth-section">
                <BackgroundQuestions
                  state={state}
                  setFetchDetails={setFetchDetails}
                />
              </div>
              <div id="div6" className="scroll-section scroll-sixth-section">
                <AdditionalDetails
                  state={state}
                  setFetchDetails={setFetchDetails}
                />
              </div>
              <div id="div7" className="scroll-section scroll-seventh-section">
                <AdditionalDocuments state={state} fetch={fetchData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
