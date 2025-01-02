import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Lesson } from "@/app/interfaces/interfaces";

interface AddLessonDialogProps {
  open: boolean;
  handleClickOpen: () => void;
  handleClose: () => void;
  addLesson: (newLesson: Lesson , sectionId :Number) => void; 
  sectionId :Number;
}

export default function AddLessonDialog({
  open,
  handleClickOpen,
  handleClose,
  addLesson,
  sectionId,
}: AddLessonDialogProps) {
  
    
  const [lesson, setLesson] = React.useState<Lesson>({
    title: "",
    position: 1,
  });

  // Handle changes in input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLesson((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleAddNewSection = () => {
    if (lesson.title) {
      addLesson( lesson , sectionId); 
      handleClose(); // Close the dialog
    }
  };

  return (
    <React.Fragment>
    
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Lesson</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the title of the new lesson you would like to add to
            this section. This title will help identify the lesson within the
            course content. You can update it later if needed.
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={lesson.title} // Bind the value to state
            onChange={handleInputChange} // Update state on change
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddNewSection}>Add</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
