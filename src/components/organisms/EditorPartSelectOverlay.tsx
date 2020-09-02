/** @jsx jsx */
import React, { FC, useState } from "react";
import { jsx, css } from "@emotion/core";
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
  CreateOutlined as CustomizeIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import useParts, { ImagePart } from "../hooks/useParts";

interface PartSelectListProps {
  parts: ImagePart[];
  onSelect: (partId: string) => void;
}

const PartSelectList: FC<PartSelectListProps> = (props) => {
  const { onSelect, parts } = props;
  const onClick = (src: string) => () => {
    onSelect(src);
  };
  return (
    <div
      css={css`
        margin: 120px auto 0;
        max-width: 400px;
        text-align: center;
      `}
    >
      {parts.map(({ id: partId, url }) => (
        <img key={partId} src={url} width={100} onClick={onClick(partId)} />
      ))}
    </div>
  );
};

interface CustomizeListProps {
  onCreate: (type: "rectangle" | "text") => void;
}

const CustomizeList: FC<CustomizeListProps> = (props) => {
  const { onCreate } = props;

  const onClick = (type: "rectangle" | "text") => () => {
    onCreate(type);
  };

  return (
    <div
      css={css`
        margin: 120px auto 0;
        max-width: 400px;

        display: flex;
      `}
    >
      <div
        css={css`
          width: 70px;
          height: 70px;
          background-color: ghostwhite;
          border: solid 1px black;
        `}
        onClick={onClick("rectangle")}
      />
      <div
        css={css`
          width: 70px;
          height: 70px;
          position: relative;

          background-color: rgba(248, 248, 255, 0.5);
        `}
        onClick={onClick("text")}
      >
        <span
          css={css`
            font-size: 30px;

            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateY(-50%) translateX(-80%);
          `}
        >
          あ
        </span>
        <span
          css={css`
            font-size: 30px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateY(-50%) translateX(-20%);
          `}
        >
          A
        </span>
      </div>
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

export interface EditorPartSelectOverlayProps {
  open: boolean;
  handleClose: () => void;
  onSelectItem: (partId: string) => void;
  onCreateCustomPart: (type: "rectangle" | "text") => void;
}

type TabValue = "flower" | "leaf" | "stand" | "customize";

const EditorPartSelectOverlay: FC<EditorPartSelectOverlayProps> = (props) => {
  const { open, handleClose, onSelectItem, onCreateCustomPart } = props;
  const classes = useStyles();
  const { flowers, leaves, stands } = useParts();

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
          <Tab icon={<CustomizeIcon />} value={"customize"} />
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
      {tabValue === "customize" && (
        <CustomizeList onCreate={onCreateCustomPart} />
      )}
    </Backdrop>
  );
};

export default EditorPartSelectOverlay;
