import { Spinner } from "reactstrap";
import { LoaderProps } from "../../types/CustomElementTypes";

const Loader: React.FC<LoaderProps> = ({ styles }) => {
  return (
    <div style={{ ...styles }} id="loader" className="flex-center spin-loader">
      <Spinner />
    </div>
  );
};

export default Loader;
