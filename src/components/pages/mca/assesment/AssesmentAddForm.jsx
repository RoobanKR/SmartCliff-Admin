import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";

const AssessmentAddForm = () => {
  const [assessmentData, setAssessmentData] = useState([
    {
      heading: "",
      subheading: "",
      assesment: [{ icon: null, title: "", description: "" }],
    },
  ]);

  const handleAddSection = () => {
    setAssessmentData([
      ...assessmentData,
      {
        heading: "",
        subheading: "",
        assesment: [{ icon: null, title: "", description: "" }],
      },
    ]);
  };

  const handleRemoveSection = (sectionIndex) => {
    const newData = [...assessmentData];
    newData.splice(sectionIndex, 1);
    setAssessmentData(newData);
  };

  const handleAddField = (sectionIndex) => {
    const newData = [...assessmentData];
    newData[sectionIndex].assesment.push({
      icon: null,
      title: "",
      description: "",
    });
    setAssessmentData(newData);
  };

  const handleRemoveField = (sectionIndex, fieldIndex) => {
    const newData = [...assessmentData];
    newData[sectionIndex].assesment.splice(fieldIndex, 1);
    setAssessmentData(newData);
  };

  const handleTitleChange = (sectionIndex, value) => {
    const newData = [...assessmentData];
    newData[sectionIndex].heading = value;
    setAssessmentData(newData);
  };

  const handleSubheadingChange = (sectionIndex, value) => {
    const newData = [...assessmentData];
    newData[sectionIndex].subheading = value;
    setAssessmentData(newData);
  };

  const handleIconChange = (sectionIndex, fieldIndex, files) => {
    const newData = [...assessmentData];
    newData[sectionIndex].assesment[fieldIndex].icon = files[0];
    setAssessmentData(newData);
  };

  const handleFieldTitleChange = (sectionIndex, fieldIndex, value) => {
    const newData = [...assessmentData];
    newData[sectionIndex].assesment[fieldIndex].title = value;
    setAssessmentData(newData);
  };

  const handleFieldDescriptionChange = (sectionIndex, fieldIndex, value) => {
    const newData = [...assessmentData];
    newData[sectionIndex].assesment[fieldIndex].description = value;
    setAssessmentData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("assesment", JSON.stringify(assessmentData));

      const response = await fetch("http://localhost:5353/create/assesment", {
        method: "POST",
        body: formData,
      });
      console.log("formData", formData);
      const data = await response.json();

      if (response.ok) {
        // Handle success, e.g., show a success message
        console.log("Assessment added successfully:", data.message);
      } else {
        // Handle error, e.g., show an error message
        console.error("Error adding assessment:", data.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error adding assessment:", error);
    }
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
            <Typography
              gutterBottom
              variant="h4"
              align="center"
              component="div"
              style={{ fontFamily: "Serif" }}
            >
              Add Assessment
            </Typography>
            <form onSubmit={handleSubmit}>
              {assessmentData.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id={`title-${sectionIndex}`}
                    label={`Main Heading ${sectionIndex + 1}`}
                    value={section.heading}
                    onChange={(e) =>
                      handleTitleChange(sectionIndex, e.target.value)
                    }
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    id={`subheading-${sectionIndex}`}
                    label={`Subheading ${sectionIndex + 1}`}
                    value={section.subheading}
                    onChange={(e) =>
                      handleSubheadingChange(sectionIndex, e.target.value)
                    }
                  />
                  {section.assesment.map((field, fieldIndex) => (
                    <div key={fieldIndex}>
                      <DropzoneArea
                        acceptedFiles={["image/*"]}
                        filesLimit={1}
                        onChange={(files) =>
                          handleIconChange(sectionIndex, fieldIndex, files)
                        }
                        dropzoneText="Drag and drop an image here or click"
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id={`field-title-${sectionIndex}-${fieldIndex}`}
                        label={`Field Title ${fieldIndex + 1}`}
                        value={field.title}
                        onChange={(e) =>
                          handleFieldTitleChange(
                            sectionIndex,
                            fieldIndex,
                            e.target.value
                          )
                        }
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id={`field-description-${sectionIndex}-${fieldIndex}`}
                        label={`Field Description ${fieldIndex + 1}`}
                        multiline
                        rows={4}
                        value={field.description}
                        onChange={(e) =>
                          handleFieldDescriptionChange(
                            sectionIndex,
                            fieldIndex,
                            e.target.value
                          )
                        }
                      />
                      {fieldIndex > 0 && (
                        <IconButton
                          color="secondary"
                          onClick={() =>
                            handleRemoveField(sectionIndex, fieldIndex)
                          }
                          aria-label="Remove Field"
                        >
                          <RemoveIcon /> Remove SubHeading
                        </IconButton>
                      )}
                    </div>
                  ))}
                  <IconButton
                    type="button"
                    color="primary"
                    onClick={() => handleAddField(sectionIndex)}
                    aria-label="Add Field"
                  >
                    <AddIcon style={{ color: "#FF69B4" }} />
                    Add Sub Heading
                  </IconButton>{" "}
                  <br />
                  {sectionIndex > 0 && (
                    <IconButton
                      color="secondary"
                      onClick={() => handleRemoveSection(sectionIndex)}
                      aria-label="Remove Main Heading"
                    >
                      <RemoveIcon /> Remove Main Heading
                    </IconButton>
                  )}
                </div>
              ))}{" "}
              <IconButton
                type="button"
                color="primary"
                onClick={handleAddSection}
                aria-label="Add Main Heading"
              >
                <AddIcon style={{ color: "#FF69B4" }} />
                Add Main Heading
              </IconButton>{" "}
              <Button
                type="submit"
                variant="contained"
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  marginTop: 2,
                }}
                fullWidth
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default AssessmentAddForm;
