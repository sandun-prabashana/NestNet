import { Helmet } from "react-helmet-async";
// @mui
import { styled } from "@mui/material/styles";
import { Container, Typography, Divider, Stack, Button } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';


import useResponsive from "../hooks/useResponsive";
// components
import Logo from "../components/logo";
import Iconify from "../components/iconify";
// sections
import { RegisterForm } from "../sections/auth/register";
import SignUpImage from '../images/assets/illustrations/signup.svg';


// ----------------------------------------------------------------------

const StyledRoot = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const StyledSection = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 480,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive("up", "md");

  const StyledLink = styled(RouterLink)({
    color: 'blue',
    textDecoration: 'none',
    fontWeight: 'bold',  // Make text bold
    '&:hover': {
      color: 'pink',
    }
  });

  return (
    <>
      <Helmet>
        <title> Register | User </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: "absolute",
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {/* Add this block for the Sign In link */}
        <Typography 
          component="div"
          sx={{
            position: "absolute",
            top: { xs: 16, sm: 24, md: 40 },
            right: { xs: 16, sm: 24, md: 40 },
            border: "2px solid",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
  <StyledLink to="/login">Already have an account? Sign In </StyledLink>
        </Typography>

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src={SignUpImage} alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign Up
            </Typography>
            <Divider sx={{ my: 3 }} />
            <RegisterForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
