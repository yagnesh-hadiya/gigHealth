import { Card, CardBody } from 'reactstrap'
import logo from "../../../assets/images/brendan-logo.png";
import ForgotPasswordForm from '../forgotpassword/ForgotPasswordForm';
import Footer from '../../../components/talentlayout/footer';

const index = () => {
  return (
    <div className="applicant-bg-wr bg-none">
      <div className="applicant-login-wr"> 
          <div className='auth-card-wr w-100'>
            <Card className="auth-card mx-auto">
                <CardBody className="auth-card-body">
                <div className="auth-card-img-wr">
                  <img src={logo} alt="logo" className="img-logo" />
                </div>
                <h2 className="purple-title" style={{ marginBottom: '12px' }}>Forgot Password</h2>
                <p className='forgot-text'>Please enter your registered email address and we will send you link to reset your password.</p>
                <ForgotPasswordForm/>   
                </CardBody>
            </Card>
          </div>
      </div>
      <Footer/>
    </div>
    
  )
}

export default index