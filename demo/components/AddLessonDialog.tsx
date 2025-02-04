import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Lesson } from "@/app/interfaces/interfaces";
import { useTranslations } from "next-intl"; // Import useTranslations for translations

interface AddLessonDialogProps {
  open: boolean;
  handleClickOpen: () => void;
  handleClose: () => void;
  addLesson: (newLesson: Lesson, sectionId: Number) => void;
  sectionId: Number;
}

export default function AddLessonDialog({
  open,
  handleClickOpen,
  handleClose,
  addLesson,
  sectionId,
}: AddLessonDialogProps) {
  const t = useTranslations("addLessonDialog"); // Fetch the translations for this dialog

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

  // Handle adding new lesson
  const handleAddNewLesson = () => {
    if (lesson.title) {
      addLesson(lesson, sectionId); // Call parent function to add the lesson
      handleClose(); // Close the dialog
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("dialogTitle")}</DialogTitle> {/* Use translation for title */}
        <DialogContent>
          <DialogContentText>{t("dialogContentText")}</DialogContentText> {/* Translation for content text */}

          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label={t("titleLabel")} // Translation for label
            type="text"
            fullWidth
            variant="standard"
            value={lesson.title} // Bind the value to state
            onChange={handleInputChange} // Update state on change
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("cancelButton")}</Button> {/* Translation for cancel button */}
          <Button onClick={handleAddNewLesson}>{t("addButton")}</Button> {/* Translation for add button */}
        </DialogActions>
      </Dialog>
    </div>
  );
}
