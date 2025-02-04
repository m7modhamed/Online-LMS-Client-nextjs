import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Section } from "@/app/interfaces/interfaces";
import { useTranslations } from "use-intl";

interface AddSectionDialogProps {
  open: boolean;
  handleClickOpen: () => void;
  handleClose: () => void;
  addSection: (newSection: Section) => void; // Function passed from parent to add section
}

export default function AddSectionDialog({
  open,
  handleClickOpen,
  handleClose,
  addSection,
}: AddSectionDialogProps) {
  // State to manage the new section form input
  const [section, setSection] = React.useState<Section>({
    title: "",
    description: "",
    position: 1,
  });

  const t = useTranslations('addSectionDialog');
  // Handle changes in input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle the submission of the new section
  const handleAddNewSection = () => {
    if (section.title && section.description) {
      addSection(section); // Call the parent function to add the section
      handleClose(); // Close the dialog
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t("dialogTitle")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("dialogContentText")}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          name="title"
          label={t("titleLabel")}
          type="text"
          fullWidth
          variant="standard"
          value={section.title} // Bind the value to state
          onChange={handleInputChange} // Update state on change
        />
        <TextField
          margin="dense"
          id="description"
          name="description"
          label={t("descriptionLabel")}
          type="text"
          fullWidth
          variant="standard"
          value={section.description} // Bind the value to state
          onChange={handleInputChange} // Update state on change
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("cancelButton")}</Button>
        <Button onClick={handleAddNewSection}>{t("addButton")}</Button>
      </DialogActions>
    </Dialog>
  );
}
