import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { createJobPosition } from "../../redux/slices/joinus/joinus";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";

const schema = yup.object().shape({
  job_position: yup.string().required("Job position is required"),
  description: yup.string().required("Description is required"),
});

const JobPositionForm = () => {
  const dispatch = useDispatch();
  
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      job_position: "",
      description: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(createJobPosition(data));
    reset();
  };

  return (
        <LeftNavigationBar
          Content={
    
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
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
                mb: 5,
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
          Add Job Position
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="job_position"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Job Position"
                fullWidth
                margin="normal"
                error={!!errors.job_position}
                helperText={errors.job_position?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </Box>
    </Container>
      }
      />
  );
};

export default JobPositionForm;