import React, { FC, useState } from "react";
import {
  AppBar,
  Backdrop,
  Button,
  Tab,
  Tabs,
  Toolbar,
} from "@material-ui/core";
import {
  Toys as BalloonIcon,
  LocalFlorist as FlowerIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

interface FlowerListProps {
  onSelect: () => void;
}

const FlowerList: FC<FlowerListProps> = (props) => {
  const { onSelect } = props;

  return (
    <div>
      <ul>
        <li onClick={onSelect}>Flower1</li>
        <li>Flower2</li>
        <li>Flower3</li>
      </ul>
    </div>
  );
};

interface BalloonListProps {
  onSelect: () => void;
}

const BalloonList: FC<BalloonListProps> = (props) => {
  const { onSelect } = props;

  return (
    <div>
      <ul>
        <li onClick={onSelect}>Balloon1</li>
        <li>Balloon2</li>
        <li>Balloon3</li>
      </ul>
    </div>
  );
};

const useStyles = makeStyles({
  backdrop: {
    zIndex: 100,
  },
});

export interface EditorFlowerSelectOverlayProps {
  open: boolean;
  handleClose: () => void;
  onSelectItem: () => void;
}

const EditorFlowerSelectOverlay: FC<EditorFlowerSelectOverlayProps> = (
  props
) => {
  const { open, handleClose, onSelectItem } = props;
  const classes = useStyles();

  const [tabValue, setTabValue] = useState<"flower" | "balloon">("flower");

  const onTabChange = (_: any, value: "flower" | "balloon") => {
    setTabValue(value);
  };

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <AppBar position="static">
        <Toolbar>
          <Button onClick={handleClose} color="inherit">
            Close
          </Button>
        </Toolbar>
        <Tabs value={tabValue} centered onChange={onTabChange}>
          <Tab icon={<FlowerIcon />} value={"flower"} />
          <Tab icon={<BalloonIcon />} value={"balloon"} />
        </Tabs>
      </AppBar>

      {tabValue === "flower" && <FlowerList onSelect={onSelectItem} />}
      {tabValue === "balloon" && <BalloonList onSelect={onSelectItem} />}
    </Backdrop>
  );
};

export default EditorFlowerSelectOverlay;
