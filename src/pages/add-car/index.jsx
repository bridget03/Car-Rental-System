import styles from "./styles.module.css";

import BreadCrumb from "@/components/breadcrumb";
import { useReducer, useState } from "react";
import { carReducer, initialState } from "@components/AddCar/CarReducer";
import Step1 from "@components/AddCar/Step1/Step1";
import Step2 from "@components/AddCar/Step2/Step2";
import Step3 from "@components/AddCar/Step3/Step3";
import Step4 from "@components/AddCar/Step4/Step4";

import StepDisplay from "@/components/StepDisplay/StepDisplay";

export default function () {
  const steps = [
    { value: 1, name: "Basic" },
    { value: 2, name: "Details" },
    { value: 3, name: "Pricing" },
    { value: 4, name: "Finish" },
  ];
  const [state, dispatch] = useReducer(carReducer, initialState);
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={styles.container}>
      <BreadCrumb />
      <h1>Add a car</h1>
      <StepDisplay currentStep={currentStep} steps={steps} />

      <div>
        {currentStep === 1 && (
          <Step1 state={state.step1} dispatch={dispatch} nextStep={nextStep} />
        )}
        {currentStep === 2 && (
          <Step2
            state={state.step2}
            dispatch={dispatch}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 3 && (
          <Step3
            state={state.step3}
            dispatch={dispatch}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 4 && <Step4 state={state} prevStep={prevStep} />}
      </div>
    </div>
  );
}
