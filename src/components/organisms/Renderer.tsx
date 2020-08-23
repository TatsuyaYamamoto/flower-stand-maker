/** @jsx jsx */
import React, { FC, useEffect, useRef, useState } from "react";
import { jsx, css } from "@emotion/core";
import { animated, useSpring, to } from "react-spring";
import { useGesture } from "react-use-gesture";

import { Hierarchy } from "@/components/hooks/useHierarchy";

/**
 * todo: move util file
 */
const isMultiTapEvent = (e: Event): e is TouchEvent => {
  return e instanceof TouchEvent && 2 <= e.touches.length;
};

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

  const [{x,y,zoom,scale,rotateZ}, setSpring] = useSpring(() => ({
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
      onDragEnd: ({ event }) => {
        event?.stopPropagation();

        onDragEnd();
      },
      onDrag: ({ offset: [x, y], event }) => {
        event?.stopPropagation();

        setSpring({ x, y });
      },
      onPinch: ({ args: [], offset: [d, a], event }) => {
        event?.stopPropagation();

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
      style={{ x, y, rotateZ, scale: to([scale, zoom], (s, z) => s + z) }}
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

  const rootContainerRef = useRef<HTMLDivElement>(null);

  const pointerdownOutsideObject = (e: Event) => {
    if (isMultiTapEvent(e)) {
      return;
    }

    /**
     * 配下の img要素をクリックした場合、img要素のイベントより、この要素のイベントが先にトリガーされるため、
     * `e.stopPropagation();` ではなく、return でこのイベントハンドラーを終了させる。
     * react-use-gesture の実装の問題？
     */
    // @ts-ignore
    if (e.target.tagName === "IMG") {
      return;
    }

    // prevent to fire event of document and window
    e.stopPropagation();

    // @ts-ignore
    console.log(`${e.type} ${e.target.tagName}`);

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
    const rootContainer = rootContainerRef.current;
    const type = "ontouchstart" in window ? "touchstart" : "mousedown";

    rootContainer?.addEventListener(type, pointerdownOutsideObject);
    window.addEventListener(type, pointerdownOutsideObject);

    return () => {
      rootContainer?.removeEventListener(type, pointerdownOutsideObject);
      window.removeEventListener(type, pointerdownOutsideObject);
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
        ref={rootContainerRef}
        css={css`
          width: 100%;
          height: 100%;
        `}
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
