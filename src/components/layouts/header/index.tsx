import Menu from "../../../assets/images/menu.svg";
// import Bell from "../../../assets/images/bell.svg";
import React, {  useEffect, useState } from 'react';
const Header: React.FC = () => {
  const [pushRightClass, ] = useState('sidebar-active');
  const [body,] = useState(document.querySelector('body'));

  const onResize = () => {
    const bodyElement = document.querySelector('body');
    if (bodyElement) {
      if (window.innerWidth <= 1199) {
        bodyElement.classList.add(pushRightClass);
        localStorage.setItem('hideSidebar', 'true');
      } else {
        bodyElement.classList.remove(pushRightClass);
      }
    }
  };
  window.addEventListener('resize', onResize);
  useEffect(() => {
    // Initial update on component mount
    onResize();

    // Add event listener for window resize
    window.addEventListener('resize', onResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []); 

  const toggleSidebar = () => {
    if (body) {
      body.classList.toggle(pushRightClass);
    }
  };

  return (
    <div className="header-wrapper header-section">
      <div className="header-content">
        <div className="burger">
          <div className="icon-img">
            <img
              src={Menu}
              alt="menu"
              onClick={toggleSidebar}
              
            />
            <div className="bell-wrap">
              <span className="notification">2</span>
              {/* <img src={Bell} alt="menu" className="menu-bell-img" /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
