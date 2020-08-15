/** @jsx jsx */
import React, { useState } from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { jsx, css } from "@emotion/core";

import EditorBottomNavigation, {
  EditorBottomNavigationValue,
} from "@/components/organisms/EditorBottomNavigation";
import EditorLayerDrawer from "@/components/organisms/EditorLayerDrawer";
import EditorFlowerSelectOverlay from "@/components/organisms/EditorFlowerSelectOverlay";

import useHierarchy from "@/components/hooks/useHierarchy";

const RendererWithNoSSR = dynamic(
  () => import("@/components/organisms/Renderer"),
  { ssr: false }
);

const EditPage: NextPage = () => {
  const [isLayerDrawerOpen, setLayerDrawerOpen] = useState(false);
  const [isFlowerSelectOverlayOpen, setFlowerSelectOverlayOpen] = useState(
    false
  );
  const { hierarchy, addObject, updateObject } = useHierarchy();

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

  const handleSelectItem = (objectId: string) => {
    handleFlowerSelectOverlay();
    addObject({
      id: objectId,
      type: "image",
    });
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

  const onMoveObject = (params: {
    hierarchyId: string;
    pointer: { x: number; y: number };
  }) => {
    const { hierarchyId, pointer } = params;

    updateObject({
      hierarchyId,
      key: "pointer",
      value: pointer,
    });
  };

  return (
    <>
      <div>
        <div
          css={css`
            display: flex;
            justify-content: center;

            padding-top: 50px;
          `}
        >
          <RendererWithNoSSR hierarchy={hierarchy} onMove={onMoveObject} />
        </div>
        <EditorBottomNavigation onClick={onBottomNavigationClicked} />
      </div>
      <EditorFlowerSelectOverlay
        open={isFlowerSelectOverlayOpen}
        handleClose={handleFlowerSelectOverlay}
        onSelectItem={handleSelectItem}
      />
      <EditorLayerDrawer
        open={isLayerDrawerOpen}
        onClose={handleLayerDrawer}
        hierarchy={hierarchy}
      />
    </>
  );
};

export default EditPage;
