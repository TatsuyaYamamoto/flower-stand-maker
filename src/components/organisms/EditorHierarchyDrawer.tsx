/** @jsx jsx */
import React, { FC } from "react";
import { jsx, css } from "@emotion/core";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Drawer } from "@material-ui/core";

import { Hierarchy } from "../hooks/useHierarchy";

export interface HierarchyListItemProp {
  objectId: string;
  index: number;
  url: string;
  onHover: (objectId: string) => void;
}

const HierarchyListItem: FC<HierarchyListItemProp> = (props) => {
  const { objectId, url, onHover } = props;

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

  return (
    <div
      ref={(node) => drag(drop(node))}
      css={css`
        list-style: none;
        border: solid 1px black;
        opacity: ${isDragging ? 0 : 1};
      `}
    >
      <img width={100} src={url} css={css``} />
    </div>
  );
};

interface EEditorHierarchyDrawerProps {
  open: boolean;
  hierarchy: Hierarchy;
  onClose: () => void;
  onChangeOrder: (params: { objectId: string; to: number | "front" }) => void;
}

const EditorHierarchyDrawer: FC<EEditorHierarchyDrawerProps> = (props) => {
  const { open, hierarchy, onClose, onChangeOrder } = props;

  const onMove = (index: number) => (objectId: string) => {
    onChangeOrder({
      objectId,
      to: index,
    });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <DndProvider backend={HTML5Backend}>
        <ul
          css={css`
            list-style: none;
          `}
        >
          {hierarchy.map(({ objectId, url }, index) => (
            <li key={objectId}>
              <HierarchyListItem
                key={objectId}
                objectId={objectId}
                index={index}
                url={url}
                onHover={onMove(index)}
              />
            </li>
          ))}
        </ul>
      </DndProvider>
    </Drawer>
  );
};

export default EditorHierarchyDrawer;
