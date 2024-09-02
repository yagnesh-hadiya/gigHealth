import Footer from "../../../components/talentlayout/footer";
import HomeForm from "../../../pages/talent/home/HomeForm";
import { useState } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselIndicators,
  Card,
  CardBody,
} from "reactstrap";

const items = [
  {
    id: 1,
    altText: "Slide 1",
  },
  {
    id: 2,
    altText: "Slide 2",
  },
  {
    id: 3,
    altText: "Slide 3",
  },
];

const Index = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex: any) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem
        className="custom-tag"
        tag="div"
        key={item.id}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      ></CarouselItem>
    );
  });

  return (
    <div className="applicant-bg-wr home-carousel-wrapper">
      <Carousel activeIndex={activeIndex} next={next} previous={previous}>
        <CarouselIndicators
          items={items}
          activeIndex={activeIndex}
          onClickHandler={goToIndex}
        />
        {slides}
      </Carousel>
      <div className="home-slide-content">
        <div className="home-slide-data">
          <h3>Jobs in Nursing and Allied Health Positions</h3>
          <Card className="auth-card home-card mx-auto">
            <CardBody className="home-card-body">
              <h2 className="home-heading">Explore Job Opportunities Here</h2>
              <HomeForm />
            </CardBody>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
