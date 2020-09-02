/** @jsx jsx */
import React, { FC, useState } from "react";
import { jsx, css } from "@emotion/core";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import {
  VisibilityOutlined as VisibilityIcon,
  VisibilityOffOutlined as VisibilityOffIcon,
  DeleteOutline as DeleteIcon,
} from "@material-ui/icons";
import { Drawer, IconButton } from "@material-ui/core";

import { Hierarchy } from "../hooks/useHierarchy";

// https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
const isTouchDevice = "ontouchstart" in window;

export interface HierarchyListItemProp {
  objectId: string;
  index: number;
  visible: boolean;
  handleVisible: (visible: boolean) => void;
  onRemove: () => void;
  onHover: (objectId: string) => void;
}

const HierarchyListItem: FC<HierarchyListItemProp> = (props) => {
  const {
    objectId,
    visible,
    onHover,
    handleVisible,
    onRemove,
    children,
  } = props;

  const [{ isDragging }, drag] = useDrag({
    item: { type: "item", objectId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<{ type: string; objectId: string }, {}, {}>({
    accept: "item",
    hover: ({ objectId: draggedObjectId }) => {
      if (objectId !== draggedObjectId) {
        onHover(draggedObjectId);
      }
    },
  });

  const onClickVisibleButton = () => {
    handleVisible(!visible);
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      css={css`
        width: 200px;
        height: 70px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26);
        margin: 10px 0;

        list-style: none;
        opacity: ${!isDragging ? 1 : isTouchDevice ? 0.5 : 0};

        display: flex;
        align-items: center;
      `}
    >
      {children}
      <div>
        <IconButton onClick={onClickVisibleButton}>
          {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
        <IconButton onClick={onRemove}>
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
};

interface EditorHierarchyDrawerProps {
  open: boolean;
  hierarchy: Hierarchy;
  onClose: () => void;
  onChangeOrder: (params: { objectId: string; to: number | "front" }) => void;
  onChangeVisible: (params: { objectId: string; visible: boolean }) => void;
  onRemoveObject: (params: { objectId: string }) => void;
}

const EditorHierarchyDrawer: FC<EditorHierarchyDrawerProps> = (props) => {
  const {
    open,
    hierarchy,
    onClose,
    onChangeOrder,
    onChangeVisible,
    onRemoveObject,
  } = props;
  const [reactDndBackend] = useState(() => {
    if (isTouchDevice) {
      return TouchBackend;
    }
    return HTML5Backend;
  });

  const onMove = (index: number) => (objectId: string) => {
    onChangeOrder({
      objectId,
      to: index,
    });
  };

  const handleVisible = (objectId: string) => (visible: boolean) => {
    onChangeVisible({
      objectId,
      visible,
    });
  };

  const onRemove = (objectId: string) => () => {
    onRemoveObject({ objectId });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <DndProvider backend={reactDndBackend}>
        <ul
          css={css`
            list-style: none;
          `}
        >
          {hierarchy.map((object, index) => {
            const { objectId, visible } = object;
            return (
              <li key={objectId}>
                <HierarchyListItem
                  key={objectId}
                  objectId={objectId}
                  index={index}
                  visible={visible}
                  handleVisible={handleVisible(objectId)}
                  onHover={onMove(index)}
                  onRemove={onRemove(objectId)}
                >
                  {object.type === "image" && (
                    <img
                      src={object.url}
                      css={css`
                        width: 50px;
                        height: 50px;
                      `}
                    />
                  )}
                  {object.type === "text" && (
                    <div
                      css={css`
                        width: 50px;
                        height: 50px;
                      `}
                    >
                      {object.text}
                    </div>
                  )}
                </HierarchyListItem>
              </li>
            );
          })}
        </ul>
      </DndProvider>
    </Drawer>
  );
};

export default EditorHierarchyDrawer;
