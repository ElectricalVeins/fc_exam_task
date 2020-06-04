import React from 'react';
import {Field} from 'redux-form';
import CONSTANTS from "../../constants";
import SelectInput from "../SelectInput/SelectInput";
import FormInput from "../FormInput/FormInput";

const ContestSpecialInputs = (props) => {
  const{dataForContest, classes, contestType}=props

  switch (contestType) {
    case CONSTANTS.NAME_CONTEST: {
      return (
        <>
          <Field
            name='styleName'
            component={SelectInput}
            header='Style name'
            classes={{
              inputContainer: classes.selectInputContainer,
              inputHeader: classes.selectHeader,
              selectInput: classes.select
            }}
            optionsArray={dataForContest.data.nameStyle}
          />
          <Field
            name='typeOfName'
            component={SelectInput}
            classes={{
              inputContainer: classes.selectInputContainer,
              inputHeader: classes.selectHeader,
              selectInput: classes.select
            }}
            header='type of company'
            optionsArray={dataForContest.data.typeOfName}
          />
        </>
      )
    }
    case CONSTANTS.LOGO_CONTEST: {
      return (
        <>
          <div className={classes.inputContainer}>
            <span className={classes.inputHeader}>What name of your venture?</span>
            <Field
              name='nameVenture'
              component={FormInput}
              type='text'
              label='name of venture'
              classes={{
                container: classes.componentInputContainer,
                input: classes.input,
                warning: classes.warning
              }}
            />
          </div>
          <Field
            name='brandStyle'
            component={SelectInput}
            classes={{
              inputContainer: classes.selectInputContainer,
              inputHeader: classes.selectHeader,
              selectInput: classes.select
            }}
            header='Brand Style'
            optionsArray={dataForContest.data.brandStyle}
          />
        </>
      )
    }
    case CONSTANTS.TAGLINE_CONTEST: {
      return (
        <>
          <div className={classes.inputContainer}>
            <span className={classes.inputHeader}>What name of your venture?</span>
            <Field
              name='nameVenture'
              component={FormInput}
              type='text'
              label='name of venture'
              classes={{
                container: classes.componentInputContainer,
                input: classes.input,
                warning: classes.warning
              }}
            />
          </div>
          <Field
            name='typeOfTagline'
            component={SelectInput}
            classes={{
              inputContainer: classes.selectInputContainer,
              inputHeader: classes.selectHeader,
              selectInput: classes.select
            }}
            header='Type tagline'
            optionsArray={dataForContest.data.typeOfTagline}
          />
        </>
      )
    }
  }
};

export default ContestSpecialInputs;