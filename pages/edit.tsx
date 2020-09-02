/** @jsx jsx */
import React, { useMemo, useState } from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { jsx, css } from "@emotion/core";

import EditorBottomNavigation, {
  EditorBottomNavigationValue,
} from "@/components/organisms/EditorBottomNavigation";
import EditorPartSelectOverlay from "@/components/organisms/EditorPartSelectOverlay";

import useHierarchy from "@/components/hooks/useHierarchy";
import useParts from "@/components/hooks/useParts";
import TextObjectEditDialog from "@/components/organisms/TextObjectEditDialog";

const RendererWithNoSSR = dynamic(
  () => import("@/components/organisms/Renderer"),
  { ssr: false }
);

const EditorHierarchyDrawerWithNoSsr = dynamic(
  () => import("@/components/organisms/EditorHierarchyDrawer"),
  { ssr: false }
);

const EditPage: NextPage = () => {
  const [isLayerDrawerOpen, setLayerDrawerOpen] = useState(false);
  const [isFlowerSelectOverlayOpen, setFlowerSelectOverlayOpen] = useState(
    false
  );
  const [editingTextPartId, setEditingTextPartId] = useState<string | null>(
    null
  );

  const {
    texts: textParts,
    addRectanglePart,
    addTextPart,
    changeTextPart,
  } = useParts();
  const {
    hierarchy,
    addObject,
    removeObject,
    updateObject,
    changeOrder,
    changeScale,
  } = useHierarchy();

  const editingText = useMemo(() => {
    return textParts.find((part) => part.id === editingTextPartId)?.text;
  }, [textParts, editingTextPartId]);

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

  const closeTextObjectEditDialog = () => {
    setEditingTextPartId(null);
  };

  const openEditTextDialog = (objectId: string) => {
    const partId = hierarchy.find((object) => object.objectId === objectId)
      ?.partId;
    if (!partId) {
      return;
    }
    setEditingTextPartId(partId);
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

  const moveObject = (params: {
    objectId: string;
    pointer: { x: number; y: number };
  }) => {
    const { objectId, pointer } = params;

    updateObject({ objectId, key: "pointer", value: pointer });
  };

  const changeVisible = (params: { objectId: string; visible: boolean }) => {
    const { objectId, visible } = params;

    updateObject({ objectId, key: "visible", value: visible });
  };

  const transformObject = (params: {
    objectId: string;
    newScaleRatio: number;
    angle: number;
  }) => {
    const { objectId, newScaleRatio, angle } = params;

    changeScale({ objectId, rate: newScaleRatio });
    updateObject({ objectId, key: "angle", value: angle });
  };

  const bringObject = (params: { objectId: string }) => {
    const { objectId } = params;

    changeOrder({ objectId, to: "front" });
  };

  const createCustomPart = (type: "rectangle" | "text") => {
    if (type === "text") {
      // TODO default valueをここに定義するのはいかがなものかと、、、
      const partId = addTextPart("おめでとう");
      addObject({
        partId,
      });
    }

    if (type === "rectangle") {
      const partId = addRectanglePart();
      addObject({
        partId,
      });
    }

    handleFlowerSelectOverlay();
  };

  const onChangeTextPart = (text: string) => {
    if (!editingTextPartId) {
      return;
    }

    changeTextPart({
      partId: editingTextPartId,
      text,
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
          <RendererWithNoSSR
            hierarchy={hierarchy}
            onMove={moveObject}
            onEditTextObject={openEditTextDialog}
            onBringToFront={bringObject}
            onTransform={transformObject}
          />
        </div>
        <EditorBottomNavigation onClick={onBottomNavigationClicked} />
      </div>
      <EditorPartSelectOverlay
        open={isFlowerSelectOverlayOpen}
        handleClose={handleFlowerSelectOverlay}
        onSelectItem={handleSelectItem}
        onCreateCustomPart={createCustomPart}
      />
      <EditorHierarchyDrawerWithNoSsr
        open={isLayerDrawerOpen}
        hierarchy={hierarchy}
        onClose={handleLayerDrawer}
        onChangeOrder={changeOrder}
        onChangeVisible={changeVisible}
        onRemoveObject={removeObject}
      />
      <TextObjectEditDialog
        text={editingText}
        onChange={onChangeTextPart}
        handleClose={closeTextObjectEditDialog}
      />
    </>
  );
};

export default EditPage;
