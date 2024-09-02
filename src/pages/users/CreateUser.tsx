import { Link } from "react-router-dom";
import CustomMainCard from "../../components/custom/CustomCard";
import UserForm from "./UserForm";

const CreateUser = () => {
  return (
    <>
      <div className="navigate-wrapper">
        <Link to="/users" className="link-btn">
          Manage Users
        </Link>
        <span> / </span>
        <span>Add New User</span>
      </div>
      <CustomMainCard>
        <UserForm />
      </CustomMainCard>
    </>
  );
};

export default CreateUser;
