import React, { FC } from "react";
import { Drawer } from "@material-ui/core";
import { Hierarchy } from "../hooks/useHierarchy";

interface EditorLayerDrawerProps {
  open: boolean;
  onClose: () => void;
  hierarchy: Hierarchy;
}

const EditorLayerDrawer: FC<EditorLayerDrawerProps> = (props) => {
  const { open, onClose, hierarchy } = props;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <ul>
        {hierarchy.map((object) => (
          <li>
            <div>ObjectID: {object.objectId}</div>
            <div>HierarchyId: {object.hierarchyId}</div>
            <img width={100} src={object.url} />
          </li>
        ))}
      </ul>
    </Drawer>
  );
};

export default EditorLayerDrawer;
