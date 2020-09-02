import React, { ChangeEvent, FC } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

interface TextObjectEditDialogProps {
  text?: string;
  handleClose: () => void;
  onChange: (text: string) => void;
}

const TextObjectEditDialog: FC<TextObjectEditDialogProps> = (props) => {
  const { text, handleClose, onChange } = props;

  const open = !!text;

  const onChangeTextField = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          multiline
          value={text}
          onChange={onChangeTextField}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TextObjectEditDialog;
