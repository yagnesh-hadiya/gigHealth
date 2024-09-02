import { ListGroupItem } from "reactstrap";
import { CartListgroupItemProps } from "../../../types/TalentOnboardingTypes";

const CardListgroupItem = ({ title, data }: CartListgroupItemProps) => {
  return (
    <ListGroupItem>
      <div className="items-flex">
        <div className="width-48">
          <h3>{title}</h3>
        </div>
        <div className="width-48 d-flex justify-content-end text-capitalize">
          <p className="fw-500">{data}</p>
        </div>
      </div>
    </ListGroupItem>
  );
};

export default CardListgroupItem;
