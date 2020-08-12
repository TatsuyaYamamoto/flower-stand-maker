import React, { useState } from "react";
import { NextPage } from "next";

import EditorBottomNavigation, {
  EditorBottomNavigationValue,
} from "../src/components/organisms/EditorBottomNavigation";
import EditorLayerDrawer from "../src/components/organisms/EditorLayerDrawer";

const EditPage: NextPage = () => {
  const [isLayerDrawerOpen, setLayerDrawerOpen] = useState(false);

  const onBottomNavigationClicked = (value: EditorBottomNavigationValue) => {
    if (value === "layer") {
      setLayerDrawerOpen(true);
    }
  };

  const onLayerDrawerClose = () => {
    setLayerDrawerOpen(false);
  };

  return (
    <>
      <div>
        <EditorBottomNavigation onClick={onBottomNavigationClicked} />
      </div>
      <EditorLayerDrawer
        open={isLayerDrawerOpen}
        onClose={onLayerDrawerClose}
      />
    </>
  );
};

export default EditPage;
