import { Card, CardProps } from "reactstrap";

interface CustomMainCard extends CardProps {
  style?: React.CSSProperties;
}
const CustomMainCard: React.FC<CustomMainCard> = ({
  children,
  style,
  ...props
}) => {
  return (
    <>
      <Card className="main-card-wrapper" {...props}>
        {children}
      </Card>
    </>
  );
};

export default CustomMainCard;
