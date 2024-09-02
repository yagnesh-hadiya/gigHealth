import { Card, CardBody } from 'reactstrap';
import RegisterForm from '../register/registerForm';
import Footer from '../../../components/talentlayout/footer';

const index = () => {
  return (
    <div className="applicant-bg-wr bg-none">
      <div className="applicant-login-wr"> 
          <div className='auth-card-wr w-100 align-top'>
            <Card className="auth-card register-card mx-auto">
                <CardBody className="auth-card-body">
                  <h2 className="purple-title mb-3">Register Now</h2>
                  <RegisterForm/>   
                </CardBody>
            </Card>
          </div>
      </div>
      <Footer/>
    </div>
  )
}

export default index