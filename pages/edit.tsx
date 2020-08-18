/** @jsx jsx */
import React, { useState } from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { jsx, css } from "@emotion/core";

import EditorBottomNavigation, {
  EditorBottomNavigationValue,
} from "@/components/organisms/EditorBottomNavigation";
import EditorHierarchyDrawer from "@/components/organisms/EditorHierarchyDrawer";
import EditorPartSelectOverlay from "@/components/organisms/EditorPartSelectOverlay";

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

  const handleSelectItem = (partId: string) => {
    handleFlowerSelectOverlay();
    addObject({
      partId,
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
    objectId: string;
    pointer: { x: number; y: number };
  }) => {
    const { objectId, pointer } = params;

    updateObject({
      objectId,
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
      <EditorPartSelectOverlay
        open={isFlowerSelectOverlayOpen}
        handleClose={handleFlowerSelectOverlay}
        onSelectItem={handleSelectItem}
      />
      <EditorHierarchyDrawer
        open={isLayerDrawerOpen}
        onClose={handleLayerDrawer}
        hierarchy={hierarchy}
      />
    </>
  );
};

export default EditPage;
