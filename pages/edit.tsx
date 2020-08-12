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
    if (value === "image") {
      selectImageFile();
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

  const selectImageFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = false;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement | null;
      const file = target?.files && target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (readerEvent) => {
          const imageBase64 = readerEvent.target?.result;
          console.log(imageBase64);
        };
      }
    };

    input.click();
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
