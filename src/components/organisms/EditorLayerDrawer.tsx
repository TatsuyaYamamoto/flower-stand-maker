import React, { FC } from "react";
import { Drawer } from "@material-ui/core";

interface EditorLayerDrawerProps {
  open: boolean;
  onClose: () => void;
}

const EditorLayerDrawer: FC<EditorLayerDrawerProps> = (props) => {
  const { open, onClose } = props;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <ul>
        <li>Layer1</li>
        <li>Layer2</li>
        <li>Layer3</li>
        <li>Layer4</li>
      </ul>
    </Drawer>
  );
};

export default EditorLayerDrawer;
