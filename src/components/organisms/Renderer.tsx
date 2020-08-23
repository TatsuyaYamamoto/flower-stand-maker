/** @jsx jsx */
import React, { FC, useEffect, useState } from "react";
import { jsx, css } from "@emotion/core";
import { animated, useSpring } from "react-spring";
import { useGesture } from "react-use-gesture";

import { Hierarchy } from "@/components/hooks/useHierarchy";

interface GestureImageProps {
  url: string;
  selected: boolean;
  dragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const GestureImage: FC<GestureImageProps> = (props) => {
  const { url, selected, dragging, onSelect, onDragStart, onDragEnd } = props;

  const [{ x, y, rotateZ }, setSpring] = useSpring(() => ({
    rotateZ: 0,
    scale: 1,
    zoom: 0,
    x: 0,
    y: 0,
  }));

  const bind = useGesture(
    {
      onDragStart: ({ event }) => {
        event?.stopPropagation();

        onDragStart();
        onSelect();
      },
      onDragEnd: ({}) => {
        onDragEnd();
      },
      onDrag: ({ offset: [x, y] }) => {
        console.log(`onDrag x: ${x}, y: ${y}`);
        setSpring({ x, y });
      },
      onPinch: ({ args: [], offset: [d, a] }) => {
        setSpring({
          zoom: d / 200,
          rotateZ: a,
        });
      },
    },
    { eventOptions: { passive: false } }
  );

  return (
    <animated.img
      src={url}
      draggable={false}
      style={{ x, y, rotateZ }}
      {...bind()}
      css={css`
        position: absolute;
        width: 30vw;
        height: 30vw;
        transition: box-shadow 0.5s, opacity 0.5s;
        will-change: transform;
        overflow: hidden;
        touch-action: none;
        box-sizing: content-box;

        cursor: ${dragging ? "grabbing" : "grab"};
        ${selected &&
        `
          border: solid 1px black;
        `}
      `}
    />
  );
};

interface RendererProps {
  hierarchy: Hierarchy;
  onMove: (params: {
    objectId: string;
    pointer: { x: number; y: number };
  }) => void;
  onTransform: (params: {
    objectId: string;
    newScaleRatio: number;
    angle: number;
  }) => void;
  onBringToFront: (params: { objectId: string }) => void;
}

const Renderer: FC<RendererProps> = (props) => {
  const { hierarchy, onMove, onBringToFront, onTransform } = props;
  const stageWidth = 300;
  const stageHeight = 400;

  const touchstartOrMousedownOnWindow = (e: MouseEvent | TouchEvent) => {
    if (e instanceof MouseEvent && e.target instanceof HTMLCanvasElement) {
      // ignore.
      // fired target element is canvas and this target has pointer event.
      // window is listening to touchstart or mousedown event to get TouchEvent.
      // pointerdown of canvas can NOT stop propagation to window.
      return;
    }

    console.log(`${e.type} window`);
    pointerdownOutsideObject(e);
  };

  const pointerdownOnRootContainer = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    // prevent to fire event of document and window
    e.stopPropagation();

    console.log(`${e.type} root container`);
    pointerdownOutsideObject(e.nativeEvent);
  };

  const pointerdownOutsideObject = (e: Event) => {
    setSelectedObjectId(null);
  };

  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [draggingObjectId, setDraggingObjectId] = useState<string | null>(null);

  const onSelected = (objectId: string) => () => {
    setSelectedObjectId(objectId);
  };

  const onDragStart = (objectId: string) => () => {
    setDraggingObjectId(objectId);
  };

  const onDragEnd = (objectId: string) => () => {
    setDraggingObjectId(null);
  };

  useEffect(() => {
    if ("ontouchstart" in window) {
      window.addEventListener("touchstart", touchstartOrMousedownOnWindow);
    } else {
      window.addEventListener("mousedown", touchstartOrMousedownOnWindow);
    }
    return () => {
      if ("ontouchstart" in window) {
        window.removeEventListener("touchstart", touchstartOrMousedownOnWindow);
      } else {
        window.removeEventListener("mousedown", touchstartOrMousedownOnWindow);
      }
    };
  }, []);

  return (
    <div
      css={css`
        width: ${stageWidth}px;
        height: ${stageHeight}px;
        background-color: floralwhite;
        box-shadow: 10px 10px 30px rgba(18, 47, 61, 0.5),
          -10px -10px 30px rgba(248, 253, 255, 0.9),
          inset 10px 10px 30px transparent, inset -10px -10px 30px transparent;
      `}
    >
      <div
        css={css`
          width: 100%;
          height: 100%;
        `}
        onPointerDown={pointerdownOnRootContainer}
      >
        {hierarchy.map(({ objectId, url }) => {
          return (
            <GestureImage
              key={objectId}
              url={url}
              selected={selectedObjectId === objectId}
              dragging={draggingObjectId === objectId}
              onSelect={onSelected(objectId)}
              onDragStart={onDragStart(objectId)}
              onDragEnd={onDragEnd(objectId)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Renderer;
