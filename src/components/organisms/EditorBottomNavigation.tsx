import React, { FC } from "react";
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import {
  Layers as LayerIcon,
  InsertPhoto as ImageIcon,
  LocalFlorist as FlowerIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translate(-50%, 0)",
  },
});

export type EditorBottomNavigationValue = "image" | "flower" | "layer";

export interface EditorBottomNavigationProps {
  onClick?: (value: EditorBottomNavigationValue) => void;
}

const EditorBottomNavigation: FC<EditorBottomNavigationProps> = (props) => {
  const classes = useStyles();
  const { onClick } = props;

  const onChange = (_: any, value: EditorBottomNavigationValue) => {
    if (onClick) {
      onClick(value);
    }
  };

  return (
    <BottomNavigation className={classes.root} onChange={onChange}>
      {false && (
        <BottomNavigationAction
          label="Favorites"
          value="image"
          icon={<ImageIcon />}
        />
      )}
      <BottomNavigationAction
        label="Nearby"
        value="flower"
        icon={<FlowerIcon />}
      />
      <BottomNavigationAction
        label="Folder"
        value="layer"
        icon={<LayerIcon />}
      />
    </BottomNavigation>
  );
};

export default EditorBottomNavigation;
