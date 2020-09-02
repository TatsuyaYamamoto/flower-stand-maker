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
  visible: boolean;
  selected: boolean;
  dragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const GestureImage: FC<GestureImageProps> = (props) => {
  const {
    url,
    visible,
    selected,
    dragging,
    onSelect,
    onDragStart,
    onDragEnd,
  } = props;

  const [{ x, y, zoom, scale, rotateZ }, setSpring] = useSpring(() => ({
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

        if (!selected) {
          return;
        }

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
        will-change: transform;
        overflow: hidden;
        touch-action: none;
        box-sizing: content-box;

        opacity: ${visible ? 1 : 0};
        cursor: ${dragging ? "grabbing" : "grab"};
        ${selected &&
        `
          border: solid 1px black;
        `}
      `}
    />
  );
};

interface GestureTextProps {
  text: string;
  visible: boolean;
  selected: boolean;
  dragging: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const GestureText: FC<GestureTextProps> = (props) => {
  const {
    text,
    visible,
    selected,
    dragging,
    onSelect,
    onEdit,
    onDragStart,
    onDragEnd,
  } = props;

  const clickCount = useRef(0);
  const domTarget = useRef(null);
  const [{ x, y, zoom, scale, rotateZ }, setSpring] = useSpring(() => ({
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

        if (!selected) {
          return;
        }

        setSpring({
          zoom: d / 200,
          rotateZ: a,
        });
      },
      onClick: () => {
        clickCount.current += 1;

        setTimeout(() => {
          if (clickCount.current === 0) {
            // ignore
            return;
          }

          if (clickCount.current === 1) {
            // single click
          } else {
            // double click
            onEdit();
          }
          clickCount.current = 0;
        }, 200);
      },
    },
    {
      // react-spring#animated.div に対して直接 {...bind()}してもイベントがセットされないため(原因未調査）
      // useRefによる実装にしている
      domTarget,
      eventOptions: { passive: false },
    }
  );

  // @ts-ignore
  useEffect(bind, [bind]);

  return (
    <animated.div
      ref={domTarget}
      style={{
        x,
        y,
        rotateZ,
        scale: to([scale, zoom], (s, z) => s + z),
      }}
      css={css`
        position: absolute;
        will-change: transform;
        overflow: hidden;
        box-sizing: content-box;

        touch-action: none;
        user-select: none;
        outline: none;
        white-space: pre;

        opacity: ${visible ? 1 : 0};
        cursor: ${dragging ? "grabbing" : "grab"};
        ${selected &&
        `
          border: solid 1px black;
        `}
      `}
    >
      {text}
    </animated.div>
  );
};

interface GestureRectangleProps {
  visible: boolean;
  selected: boolean;
  dragging: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const GestureRectangle: FC<GestureRectangleProps> = (props) => {
  const {
    visible,
    selected,
    dragging,
    onSelect,
    onEdit,
    onDragStart,
    onDragEnd,
  } = props;

  const clickCount = useRef(0);
  const domTarget = useRef(null);
  const [{ x, y, zoom, scale, rotateZ }, setSpring] = useSpring(() => ({
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

        if (!selected) {
          return;
        }

        setSpring({
          zoom: d / 200,
          rotateZ: a,
        });
      },
      onClick: () => {
        clickCount.current += 1;

        setTimeout(() => {
          if (clickCount.current === 0) {
            // ignore
            return;
          }

          if (clickCount.current === 1) {
            // single click
          } else {
            // double click
            onEdit();
          }
          clickCount.current = 0;
        }, 200);
      },
    },
    {
      // react-spring#animated.div に対して直接 {...bind()}してもイベントがセットされないため(原因未調査）
      // useRefによる実装にしている
      domTarget,
      eventOptions: { passive: false },
    }
  );

  // @ts-ignore
  useEffect(bind, [bind]);

  return (
    <animated.div
      ref={domTarget}
      style={{
        x,
        y,
        rotateZ,
        scale: to([scale, zoom], (s, z) => s + z),
      }}
      css={css`
        position: absolute;
        will-change: transform;
        overflow: hidden;
        box-sizing: content-box;

        width: 120px;
        height: 90px;
        background-color: white;

        filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.2));

        touch-action: none;
        user-select: none;
        outline: none;
        white-space: pre;

        opacity: ${visible ? 1 : 0};
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
  onEditTextObject: (objectId: string) => void;
}

const Renderer: FC<RendererProps> = (props) => {
  const {
    hierarchy,
    onMove,
    onBringToFront,
    onTransform,
    onEditTextObject,
  } = props;
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
    onBringToFront({ objectId });
  };

  const onEditText = (objectId: string) => () => {
    onEditTextObject(objectId);
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
    const preventDefault = (e: Event) => e.preventDefault();

    rootContainer?.addEventListener(type, pointerdownOutsideObject);
    window.addEventListener(type, pointerdownOutsideObject);

    document.addEventListener("gesturestart", preventDefault);
    document.addEventListener("gesturechange", preventDefault);

    return () => {
      rootContainer?.removeEventListener(type, pointerdownOutsideObject);
      window.removeEventListener(type, pointerdownOutsideObject);

      document.removeEventListener("gesturestart", preventDefault);
      document.removeEventListener("gesturechange", preventDefault);
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
        {hierarchy.map((object) => {
          if (object.type === "image") {
            const { objectId, url, visible } = object;
            return (
              <GestureImage
                key={objectId}
                url={url}
                visible={visible}
                selected={selectedObjectId === objectId}
                dragging={draggingObjectId === objectId}
                onSelect={onSelected(objectId)}
                onDragStart={onDragStart(objectId)}
                onDragEnd={onDragEnd(objectId)}
              />
            );
          }

          if (object.type === "text") {
            const { objectId, text, visible } = object;
            return (
              <GestureText
                key={objectId}
                text={text}
                visible={visible}
                selected={selectedObjectId === objectId}
                dragging={draggingObjectId === objectId}
                onSelect={onSelected(objectId)}
                onEdit={onEditText(objectId)}
                onDragStart={onDragStart(objectId)}
                onDragEnd={onDragEnd(objectId)}
              />
            );
          }

          if (object.type === "rectangle") {
            const { objectId, visible } = object;
            return (
              <GestureRectangle
                key={objectId}
                visible={visible}
                selected={selectedObjectId === objectId}
                dragging={draggingObjectId === objectId}
                onSelect={onSelected(objectId)}
                onEdit={onEditText(objectId)}
                onDragStart={onDragStart(objectId)}
                onDragEnd={onDragEnd(objectId)}
              />
            );
          }

          return <></>;
        })}
      </div>
    </div>
  );
};

export default Renderer;
