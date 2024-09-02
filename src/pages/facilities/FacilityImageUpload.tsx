import Camera from "../../assets/images/camera.svg";
import CustomInput from "../../components/custom/CustomInput";
import Loader from "../../components/custom/CustomSpinner";
import { useState } from "react";
import { FacilityImageUploadProps } from "../../types/FacilityTypes";

const FacilityImageUpload = ({
  image,
  imageURL,
  onImageUpload,
}: FacilityImageUploadProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      <div className="facility-camera-wrapper facility-add-camera position-relative">
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="camera-img"
            width="140"
            height="140"
            className="file-camera-img w-100"
          />
        ) : (
          <>
            {loading && <Loader />}
            {imageURL && (
              <img
                src={imageURL}
                alt="camera-img"
                className="file-camera-img w-100 h-100"
                onLoad={() => setLoading(false)}
                style={{ display: loading ? "none" : "block" }}
              />
            )}
            {!imageURL && !loading && (
              <img
                src={Camera}
                alt="camera-img"
                className="file-camera-img"
                style={{ display: loading ? "none" : "block" }}
              />
            )}
          </>
        )}
        <CustomInput
          id="facilityPicture"
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onImageUpload(e.target?.files?.[0] as File)
          }
          title={"Click here to upload"}
        />
      </div>
    </>
  );
};

export default FacilityImageUpload;
