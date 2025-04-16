import {useEffect } from 'react';
import {  TextField, Button, Paper, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import {  resetSignUp } from '../../redux/slices/user/signup'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from "react-router-dom";
import { resetSignIn, userVerify } from '../../redux/slices/user/signin';
import { useCookies } from 'react-cookie';
import LeftNavigationBar from './LeftNavigationBar';
import { superAdminPostSignUp } from '../../redux/slices/superAdminRegister/superAdminRegister';


const SuperAdminRegister = () => {
    const navigate = useNavigate();
    const isSuccess = useAppSelector((state) => state.userSignUp.isSuccess)
    const dispatch = useAppDispatch()
    const [cookies, removeCookie] = useCookies(["token"]);

    useEffect(() => {
        if (isSuccess) navigate('/signin')
        dispatch(resetSignUp())

    }, [navigate, isSuccess])

    const validationSchema = yup.object({
        email: yup
            .string('Enter your email*')
            .email('Enter a valid email*')
            .required('Email is required*'),
        firstName: yup
            .string('Enter your first name*')
            .required('First Name is required*'),
        lastName: yup
            .string('Enter your last name*')
            .required('Last Name is required*'),
        phone: yup
            .string()
            .required('Phone Number is required*'),
        city: yup
            .string('Enter your city name*')
            .required('City is required*'),
        state: yup
            .string('Enter your state name*')
            .required('State is required*'),
        country: yup
            .string('Enter your country name')
            .required('Country is required'),
        password: yup
            .string('Enter your password')
            .min(8, 'Password should be of minimum 8 characters length')
            .required('Password is required'),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('State is required'),
    });

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            city: "",
            state: "",
            country: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                await dispatch(superAdminPostSignUp({ values, token: cookies.token }));
                resetForm();
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        },
    });
    useEffect(() => {
        if (!cookies.token || cookies.token === undefined) {
            dispatch(resetSignIn());
            navigate("/signin");
        } else {
            dispatch(userVerify({ token: cookies.token }));
        }
    }, [cookies]);

    return (
        <LeftNavigationBar
            Content={
                <Paper style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2>Super Admin Register </h2>

                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} p={2}>

                            <Grid item xs={12}>

                                <TextField
                                    fullWidth
                                    id="signup-firstName"
                                    name="firstName"
                                    label="FIrst Name"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                />
                            </Grid>
                            <Grid item xs={12}>

                                <TextField
                                    fullWidth
                                    id="signup-lastName"
                                    name="lastName"
                                    label="Last Name"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12}>

                                <TextField
                                    fullWidth
                                    id="signup-phone"
                                    type='number'
                                    name="phone"
                                    label="phone"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                />
                            </Grid>
                            <Grid item xs={12}>

                                <TextField
                                    fullWidth
                                    id="signup-city"
                                    name="city"
                                    label="City"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.city && Boolean(formik.errors.city)}
                                    helperText={formik.touched.city && formik.errors.city}
                                />
                            </Grid>
                            <Grid item xs={12}>

                                <TextField
                                    fullWidth
                                    id="signup-state"
                                    name="state"
                                    label="State"
                                    value={formik.values.state}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.state && Boolean(formik.errors.state)}
                                    helperText={formik.touched.state && formik.errors.state}
                                />
                            </Grid>
                            <Grid item xs={12}>

                                <TextField
                                    fullWidth
                                    id="signup-country"
                                    name="country"
                                    label="Country"
                                    value={formik.values.country}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.country && Boolean(formik.errors.country)}
                                    helperText={formik.touched.country && formik.errors.country}
                                />
                            </Grid>
                            <Grid item xs={12}>

                                <TextField
                                    fullWidth
                                    id="signup-password"
                                    name="password"
                                    label="Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xs={12}>

                                <TextField
                                    fullWidth
                                    id="signup-confirmPassword"
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />
                            </Grid>
                            <Grid item xs={12}>

                                <Button id="signup-submit" variant="contained" type='Submit'>Register</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            }
        />);
};

export default SuperAdminRegister