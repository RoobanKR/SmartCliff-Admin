import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
} from "@mui/material";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";

const AssessmentControl = () => {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API
    fetch("http://localhost:5353/getAll/assesment")
      .then((response) => response.json())
      .then((data) => {
        if (data.assessments) {
          setAssessments(data.assessments);
        }
      })
      .catch((error) => console.error("Error fetching assessments:", error));
  }, []);

  return (
    <LeftNavigationBar
      Content={
        <Container>
          <Grid container spacing={3}>
            {assessments.map((assessment) => (
              <Grid item xs={12} md={6} lg={4} key={assessment._id}>
                <Card>
                  <CardContent>
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: 'Merriweather, serif',
                fontWeight: 700, textAlign: 'center',
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mb: 3,
                mt: -4,
                "&::before": {
                  content: '""',
                  width: "28px",
                  height: "5px",
                  display: "block",
                  position: "absolute",
                  bottom: "3px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#747474",
                },
                "&::after": {
                  content: '""',
                  width: "100px",
                  height: "1px",
                  display: "block",
                  position: "relative",
                  marginTop: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#747474",
                },
              }}
            >
                      Assessment
                    </Typography>
                    {assessment.assesment.map((item, index) => (
                      <div key={index}>
                        <Typography variant="h6">{item.title}</Typography>
                        <Typography color="textSecondary">{item.subHeading}</Typography>
                        <Typography>{item.description}</Typography>
                        {item.icon && (
                          <img
                            src={item.icon}
                            alt={`Icon ${index}`}
                            style={{ maxWidth: "100%", marginTop: 10 }}
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      }
    />
  );
};

export default AssessmentControl;
