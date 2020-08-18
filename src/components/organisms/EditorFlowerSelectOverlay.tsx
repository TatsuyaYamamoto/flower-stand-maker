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
  Eco as LeafIcon,
  LocalFlorist as FlowerIcon,
  Nature as StandIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import useRemoteObjects from "../hooks/useRemoteObjects";

interface PartSelectListProps {
  parts: {
    id: string;
    url: string;
  }[];
  onSelect: (partId: string) => void;
}

const PartSelectList: FC<PartSelectListProps> = (props) => {
  const { onSelect, parts } = props;
  const onClick = (src: string) => () => {
    onSelect(src);
  };
  return (
    <div style={{ marginTop: 120 }}>
      {parts.map(({ id: partId, url }) => (
        <img key={partId} src={url} width={100} onClick={onClick(partId)} />
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
  onSelectItem: (partId: string) => void;
}

type TabValue = "flower" | "leaf" | "stand";

const EditorFlowerSelectOverlay: FC<EditorFlowerSelectOverlayProps> = (
  props
) => {
  const { open, handleClose, onSelectItem } = props;
  const classes = useStyles();
  const { flowers, leaves, stands } = useRemoteObjects();

  const [tabValue, setTabValue] = useState<TabValue>("flower");

  const onTabChange = (_: any, value: TabValue) => {
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
          <Tab icon={<LeafIcon />} value={"leaf"} />
          <Tab icon={<StandIcon />} value={"stand"} />
        </Tabs>
      </AppBar>

      {tabValue === "flower" && (
        <PartSelectList parts={flowers} onSelect={onSelectItem} />
      )}
      {tabValue === "leaf" && (
        <PartSelectList parts={leaves} onSelect={onSelectItem} />
      )}
      {tabValue === "stand" && (
        <PartSelectList parts={stands} onSelect={onSelectItem} />
      )}
    </Backdrop>
  );
};

export default EditorFlowerSelectOverlay;
