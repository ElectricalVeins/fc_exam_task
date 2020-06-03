import * as yup from 'yup';
import valid from 'card-validator';

const passwordScheme = yup.string().test('test-password', 'Minimum 6 symbols', value => (value && value.trim().length >= 6)).required('Password is required field')
const confirmPasswordScheme = yup.string().required('Confirm password is required field').oneOf([yup.ref('password')], 'Confirmation password must be the same with password')
const emailScheme = yup.string().email('Must be a valid Email').max(255).required('Email is required field');

export default {
    LoginSchem: yup.object().shape({
        email: emailScheme,
        password: passwordScheme
    }),
    RegistrationSchem: yup.object().shape({
        email: yup.string().email('check email').required('Email is required'),
        password: passwordScheme,
        confirmPassword: confirmPasswordScheme,
        firstName: yup.string().test('test-firstName','required',value => (value && value.trim().length>=1)).max(255).required('First Name is required'),
        lastName: yup.string().test('test-lastName','required',value => (value && value.trim().length>=1)).max(255).required('Last Name is required'),
        displayName: yup.string().test('test-displayName','required',value => (value && value.trim().length>=1)).max(255).required('Display Name is required'),
        role: yup.string().matches(/(customer|creator)/).required('Role is required'),
        agreeOfTerms: yup.boolean().oneOf([true],'Must Accept Terms and Conditions').required('Must Accept Terms and Conditions')
    }),
    ContestSchem: yup.object().shape({
        contestType: yup.string().matches(/(name|tagline|logo)/).required(),
        file: yup.mixed(),
        title: yup.string().test('test-title','required',value => (value && value.trim().length>=1)).max(255).required('title of contest required'),
        typeOfName: yup.string(),
        industry: yup.string().required('industry required'),
        focusOfWork: yup.string().test('test-focusOfWork','required',value => (value && value.trim().length>=1)).required('focus of work required'),
        targetCustomer: yup.string().test('test-targetCustomer','required',value => (value && value.trim().length>=1)).required('target customers required'),
        styleName: yup.string().max(255),
        nameVenture: yup.string().max(255),
        typeOfTagline: yup.string().max(255),
        brandStyle: yup.string().max(255)
    }),
    LogoOfferSchema: yup.object().shape({
        offerData: yup.mixed().required('required')
    }),
    TextOfferSchema: yup.object().shape({
        offerData: yup.string().test('test-offerData','required',value => (value && value.trim().length>=1)).max(255,'Offer should not exceed 255 characters').required('suggestion is required')
    }),
    PaymentSchema: yup.object().shape({
        number: yup.string().test('test-cardNumber','Credit Card number is invalid',value => valid.number(value).isValid).required('required'),
        name: yup.string().min(1,'required atleast one symbol').required('required'),
        cvc: yup.string().test('test-cvc','cvc is invalid',value => valid.cvv(value).isValid).required('required'),
        expiry: yup.string().test('test-expiry','expiry is invalid',value=>valid.expirationDate(value).isValid).required('required')
    }),
    CashoutSchema: yup.object().shape({
        sum: yup.number().min(5,'min sum is 5$').required('required'),
        number: yup.string().test('test-cardNumber','Credit Card number is invalid',value => valid.number(value).isValid).required('required'),
        name: yup.string().min(1).required('required'),
        cvc: yup.string().test('test-cvc','cvc is invalid',value => valid.cvv(value).isValid).required('required'),
        expiry: yup.string().test('test-expiry','expiry is invalid',value=>valid.expirationDate(value).isValid).required('required')
    }),
    UpdateUserSchema: yup.object().shape({
        firstName: yup.string().test('test-firstName','required',value => (value && value.trim().length>=1)).required('required'),
        lastName: yup.string().test('test-lastName','required',value => (value && value.trim().length>=1)).required('required'),
        displayName: yup.string().test('test-displayName','required',value => (value && value.trim().length>=1)).required('required'),
        file: yup.mixed()
    }),
    PasswordRestore: yup.object().shape({
        email: emailScheme,
        password: passwordScheme,
        confirmPassword: confirmPasswordScheme,

    })
}
