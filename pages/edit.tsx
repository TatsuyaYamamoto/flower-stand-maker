import React, { useState } from "react";
import { NextPage } from "next";

import EditorBottomNavigation, {
  EditorBottomNavigationValue,
} from "../src/components/organisms/EditorBottomNavigation";
import EditorLayerDrawer from "../src/components/organisms/EditorLayerDrawer";
import EditorFlowerSelectOverlay from "../src/components/organisms/EditorFlowerSelectOverlay";

const EditPage: NextPage = () => {
  const [isLayerDrawerOpen, setLayerDrawerOpen] = useState(false);
  const [isFlowerSelectOverlayOpen, setFlowerSelectOverlayOpen] = useState(
    false
  );

  const onBottomNavigationClicked = (value: EditorBottomNavigationValue) => {
    if (value === "layer") {
      setLayerDrawerOpen(true);
    }
    if (value === "flower") {
      setFlowerSelectOverlayOpen(true);
    }
  };

  const handleLayerDrawer = () => {
    setLayerDrawerOpen((value) => !value);
  };

  const handleFlowerSelectOverlay = () => {
    setFlowerSelectOverlayOpen((value) => !value);
  };

  const handleSelectItem = () => {
    console.log("select!");
    handleFlowerSelectOverlay();
  };

  return (
    <>
      <div>
        <EditorBottomNavigation onClick={onBottomNavigationClicked} />
      </div>
      <EditorFlowerSelectOverlay
        open={isFlowerSelectOverlayOpen}
        handleClose={handleFlowerSelectOverlay}
        onSelectItem={handleSelectItem}
      />
      <EditorLayerDrawer open={isLayerDrawerOpen} onClose={handleLayerDrawer} />
    </>
  );
};

export default EditPage;
