import React from "react";

import { ResultPage } from "./steps/result";
import { Step1, Step2, Step3, Step4, Step5 } from "./steps";

import { Container, Body } from "./styles";

export function SignUp() {
  const [activeStep, setActiveStep] = React.useState(1);
  const [data, setData] = React.useState({});

  return <Container >
  {activeStep !== 6 && (
    <Body>
      <div className="Steps">
        <img
          className="logo"
          src={
            process.env.NEXT_PUBLIC_API + `/assets/logo-${process.env.client}.png`
          }
          width={100}
        />
        {activeStep === 1 && (
          <Step1 setStep={setActiveStep} setData={setData} />
        )}
        {activeStep === 2 && (
          <Step2 setStep={setActiveStep} setData={setData} data={data} />
        )}
        {activeStep === 3 && (
          <Step3 setStep={setActiveStep} data={data} />
        )}
        {activeStep === 4 && (
          <Step4 setStep={setActiveStep} setData={setData} data={data} />
        )}
        {activeStep === 5 && (
          <Step5 setStep={setActiveStep} setData={setData} data={data} />
        )}
      </div>
      <div className="img-container">
        <img src="svg/undraw_friends_r511.svg" />
      </div>
    </Body>
  )}
  {activeStep === 6 && <ResultPage />}
</Container>
}
