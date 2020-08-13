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
  onSelect: (src: string) => void;
}

const FlowerList: FC<FlowerListProps> = (props) => {
  const { onSelect } = props;
  const onClick = (src: string) => () => {
    onSelect(src);
  };
  const list = [
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
  ];
  return (
    <div style={{ marginTop: 120 }}>
      {list.map((item, index) => (
        <img
          key={index}
          src={item.src}
          width={100}
          onClick={onClick(item.src)}
        />
      ))}
    </div>
  );
};

interface BalloonListProps {
  onSelect: (src: string) => void;
}

const BalloonList: FC<BalloonListProps> = (props) => {
  const { onSelect } = props;
  const onClick = (src: string) => () => {
    onSelect(src);
  };

  const list = [
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
    { src: `/assets/images/flower0141.png` },
    { src: `/assets/images/flower0145.png` },
    { src: `/assets/images/flower0221.png` },
    { src: `/assets/images/flower0245.png` },
  ];

  return (
    <div style={{ marginTop: 120 }}>
      {list.map((item, index) => (
        <img
          key={index}
          src={item.src}
          width={100}
          onClick={onClick(item.src)}
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

      {tabValue === "flower" && <FlowerList onSelect={onSelectItem} />}
      {tabValue === "balloon" && <BalloonList onSelect={onSelectItem} />}
    </Backdrop>
  );
};

export default EditorFlowerSelectOverlay;
