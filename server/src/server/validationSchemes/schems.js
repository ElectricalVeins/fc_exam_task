const yup=require('yup');

const emailScheme = yup.string().email().required().min(4).max(255);
const passwordScheme = yup.string().required().min(1).max(255);

module.exports.registrationSchem=yup.object().shape({
  firstName: yup.string().required().min(1).max(255),
  lastName: yup.string().required().min(1).max(255),
  displayName: yup.string().required().min(1).max(255),
  email: emailScheme,
  password: passwordScheme,
  role: yup.string().matches(/(customer|creator)/).required(),
});

module.exports.loginSchem=yup.object().shape({
  email: emailScheme,
  password: passwordScheme,
});

module.exports.contestSchem=yup.object().shape({
  contestType: yup.string().matches(/(name|logo|tagline)/).required(),
  fileName: yup.string().min(1),
  originalFileName: yup.string().min(1),
  title: yup.string().required().min(1).max(255),
  typeOfName: yup.string().min(1),
  industry: yup.string().required().min(1),
  focusOfWork: yup.string().required().min(1),
  targetCustomer: yup.string().required().min(1),
  styleName: yup.string().min(1),
  nameVenture: yup.string().min(1).max(255),
  typeOfTagline: yup.string().min(1),
  brandStyle: yup.string().min(1),
});

module.exports.restorePassword=yup.object().shape({
  email: emailScheme,
  password: passwordScheme,
});

module.exports.timer=yup.object().shape({
  name: yup.string().required().min(4).max(255),
  finalDate: yup.date().min(new Date()).required(),
  warnDate: yup.date().min(new Date()).max(yup.ref('finalDate')).required(),
})
