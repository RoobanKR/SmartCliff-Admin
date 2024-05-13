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
                    <Typography variant="h5" gutterBottom>
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
