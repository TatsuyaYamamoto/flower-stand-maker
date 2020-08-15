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
import useRemoteObjects from "../hooks/useRemoteObjects";

interface FlowerListProps {
  flowers: {
    id: string;
    url: string;
  }[];
  onSelect: (objectId: string) => void;
}

const FlowerList: FC<FlowerListProps> = (props) => {
  const { onSelect, flowers } = props;
  const onClick = (src: string) => () => {
    onSelect(src);
  };
  return (
    <div style={{ marginTop: 120 }}>
      {flowers.map((item) => (
        <img
          key={item.id}
          src={item.url}
          width={100}
          onClick={onClick(item.id)}
        />
      ))}
    </div>
  );
};

interface BalloonListProps {
  balloons: {
    id: string;
    url: string;
  }[];
  onSelect: (objectId: string) => void;
}

const BalloonList: FC<BalloonListProps> = (props) => {
  const { onSelect, balloons } = props;
  const onClick = (src: string) => () => {
    onSelect(src);
  };

  return (
    <div style={{ marginTop: 120 }}>
      {balloons.map((item) => (
        <img
          key={item.id}
          src={item.url}
          width={100}
          onClick={onClick(item.id)}
        />
      ))}
    </div>
  );
};

const useStyles = makeStyles({
  backdrop: {
    zIndex: 100,
    display: "block",
    overflowY: "scroll",
  },
});

export interface EditorFlowerSelectOverlayProps {
  open: boolean;
  handleClose: () => void;
  onSelectItem: (objectId: string) => void;
}

const EditorFlowerSelectOverlay: FC<EditorFlowerSelectOverlayProps> = (
  props
) => {
  const { open, handleClose, onSelectItem } = props;
  const classes = useStyles();
  const { flowers, balloons } = useRemoteObjects();

  const [tabValue, setTabValue] = useState<"flower" | "balloon">("flower");

  const onTabChange = (_: any, value: "flower" | "balloon") => {
    setTabValue(value);
  };

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <AppBar position="fixed">
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

      {tabValue === "flower" && (
        <FlowerList flowers={flowers} onSelect={onSelectItem} />
      )}
      {tabValue === "balloon" && (
        <BalloonList balloons={balloons} onSelect={onSelectItem} />
      )}
    </Backdrop>
  );
};

export default EditorFlowerSelectOverlay;
