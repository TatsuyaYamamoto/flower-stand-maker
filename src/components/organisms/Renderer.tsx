/** @jsx jsx */
import React, { FC, useEffect, useRef, useState } from "react";
import { jsx, css } from "@emotion/core";
import { animated, useSprings } from "react-spring";
import { useGesture } from "react-use-gesture";

import { Hierarchy } from "@/components/hooks/useHierarchy";

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

  const [springs, setSprings] = useSprings(hierarchy.length, () => {
    return {
      rotateZ: 0,
      scale: 1,
      zoom: 0,
      x: 0,
      y: 0,
    };
  });

  const bindGestures = useGesture(
    {
      onDragStart: ({ args: [originalIndex, objectId], event }) => {
        event?.stopPropagation();

        console.log("onDragStart", originalIndex, objectId);
        setDraggingObjectId(objectId);
        setSelectedObjectId(objectId);
      },
      onDragEnd: ({ args: [originalIndex, objectId] }) => {
        console.log("onDragEnd", originalIndex, objectId);
        setDraggingObjectId(null);
      },
      onDrag: ({
        args: [originalIndex, objectId],
        movement: [x, y],
        event,
      }) => {
        console.log(
          `onDrag originalIndex: ${originalIndex} objectId : ${objectId} x: ${x}, y: ${y}`
        );
        setSprings((index) => {
          console.log(
            `setSprings index: ${index}, x: ${x}, x2: ${999}, y: ${y}, y2: ${999}`
          );

          if (originalIndex === index) {
            return { x, y };
          } else {
            return {};
          }
        });
      },
      onPinch: ({ args: [originalIndex], offset: [d, a] }) => {
        setSprings((index) => {
          if (originalIndex === index) {
            return {
              zoom: d / 200,
              rotateZ: a,
            };
          } else {
            return {};
          }
        });
      },
    },
    { eventOptions: { passive: false } }
  );

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
        {springs.map((spring, index) => {
          const { objectId, url } = hierarchy[index];
          const { x, y, scale, rotateZ } = spring;

          return (
            <animated.img
              key={objectId}
              {...bindGestures(index, objectId)}
              src={url}
              draggable={false}
              style={{ x, y, rotateZ }}
              css={css`
                position: absolute;
                width: 30vw;
                height: 30vw;
                transition: box-shadow 0.5s, opacity 0.5s;
                will-change: transform;
                overflow: hidden;
                touch-action: none;
                box-sizing: content-box;

                cursor: ${draggingObjectId === objectId ? "grabbing" : "grab"};
                ${selectedObjectId === objectId &&
                `
                 border: solid 1px black;
                `}
              `}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Renderer;
