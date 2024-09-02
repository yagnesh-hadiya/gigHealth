import CustomMainCard from "../../components/custom/CustomCard";
import ChangePasswordForm from "./ChangePasswordForm";

const Profile = () => {
  return (
    <>
      <h1 className="list-page-header">My Profile</h1>
      <CustomMainCard>
        <h2 className="page-content-header">Change Password</h2>
        <ChangePasswordForm />
      </CustomMainCard>
    </>
  );
};

export default Profile;
