/** @jsx jsx */
import React, { FC, useRef, useEffect, useState } from "react";
import { Stage, Sprite, Graphics, Container } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";
import { InteractionEvent } from "pixi.js";
import { jsx, css } from "@emotion/core";

import { Hierarchy } from "@/components/hooks/useHierarchy";

// https://github.com/bfanger/pixi-inspector/issues/35#issuecomment-517811412
// @ts-ignore
window.__PIXI_INSPECTOR_GLOBAL_HOOK__?.register({ PIXI: PIXI });

/**
 * todo: move util file
 */
const isMultiTapEvent = (e: Event): e is TouchEvent => {
  return e instanceof TouchEvent && 2 <= e.touches.length;
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

  const multiTapTimeline = useRef<
    | {
        distance: number;
        angle: number;
      }[]
    | null
  >(null);

  const [handlingObjectIds, setHandlingObjectIds] = useState<{
    selected: string | null;
    held: string | null;
  }>({
    selected: null,
    held: null,
  });

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

  const touchendOrMouseupOnWindow = (e: MouseEvent | TouchEvent) => {
    console.log(`${e.type} window`);
    pointerupOutsideObject(e);
  };

  const pointerdownOnRootContainer = (e: PIXI.InteractionEvent) => {
    // prevent to fire event of document and window
    e.data.originalEvent.stopPropagation();

    console.log(`${e.type} root container`);
    pointerdownOutsideObject(e.data.originalEvent);
  };

  const pointerupOnRootContainer = (e: PIXI.InteractionEvent) => {
    // prevent to fire event of document and window
    e.data.originalEvent.stopPropagation();

    console.log(`${e.type} root container`);
    pointerupOutsideObject(e.data.originalEvent);
  };

  const pointerdownOutsideObject = (e: Event) => {
    if (isMultiTapEvent(e)) {
      multiTapTimeline.current = [];
      return;
    }

    if (handlingObjectIds.selected) {
      setHandlingObjectIds((prev) => ({
        ...prev,
        selected: null,
      }));
    }
  };

  const pointerupOutsideObject = (e: Event) => {
    if (isMultiTapEvent(e)) {
      multiTapTimeline.current = null;
      return;
    }
  };

  const pointerdownOnObject = (objectId: string) => (e: InteractionEvent) => {
    // prevent to fire root container event
    e.stopPropagation();
    // prevent to fire window event
    e.data.originalEvent.stopPropagation();

    console.log(`${e.type} object ${objectId}`);

    if (isMultiTapEvent(e.data.originalEvent)) {
      console.log("multiple!!!!");
      return;
    }

    setHandlingObjectIds({
      selected: objectId,
      held: objectId,
    });
    onBringToFront({ objectId });
  };

  const pointerupOnObject = (objectId: string) => (e: InteractionEvent) => {
    // prevent to fire root container event
    e.stopPropagation();
    // prevent to fire window event
    e.data.originalEvent.stopPropagation();

    console.log(`${e.type} object ${objectId}`);

    if (isMultiTapEvent(e.data.originalEvent)) {
      console.log("multiple!!!!");
      return;
    }

    setHandlingObjectIds((prev) => ({
      ...prev,
      held: null,
    }));
  };

  const onPointerMove = (e: InteractionEvent) => {
    const { originalEvent } = e.data;

    if (handlingObjectIds.selected && isMultiTapEvent(originalEvent)) {
      const finger1st = originalEvent.touches[0];
      const finger2nd = originalEvent.touches[1];
      if (multiTapTimeline.current) {
        multiTapTimeline.current.push({
          distance: Math.sqrt(
            Math.pow(finger2nd.clientX - finger1st.clientX, 2) +
              Math.pow(finger2nd.clientY - finger1st.clientY, 2)
          ),
          angle:
            Math.atan2(
              finger2nd.clientY - finger1st.clientY,
              finger2nd.clientX - finger1st.clientX
            ) *
            (180 / Math.PI),
        });

        const length = multiTapTimeline.current.length;
        if (2 <= length) {
          const distanceDiff =
            multiTapTimeline.current[length - 1].distance -
            multiTapTimeline.current[length - 2].distance;
          const newScaleRatio = 1 + distanceDiff * 0.01;

          const angleDiff =
            multiTapTimeline.current[length - 2].angle -
            multiTapTimeline.current[length - 1].angle;

          onTransform({
            objectId: handlingObjectIds.selected,
            newScaleRatio,
            angle: angleDiff * 0.5,
          });
        }
      }

      return;
    }

    if (!e.target) {
      // fired outside canvas
      return;
    }

    if (!handlingObjectIds.held) {
      // ignore because user don't hold any sprite.
      return;
    }

    const { x, y } = e.data.global;
    onMove({
      objectId: handlingObjectIds.held,
      pointer: {
        x: x / stageWidth,
        y: y / stageHeight,
      },
    });
  };

  useEffect(() => {
    if ("ontouchstart" in window) {
      window.addEventListener("touchstart", touchstartOrMousedownOnWindow);
      window.addEventListener("touchend", touchendOrMouseupOnWindow);
      window.addEventListener("touchcancel", touchendOrMouseupOnWindow);
    } else {
      window.addEventListener("mousedown", touchstartOrMousedownOnWindow);
      window.addEventListener("mouseup", touchendOrMouseupOnWindow);
    }

    return () => {
      if ("ontouchstart" in window) {
        window.removeEventListener("touchstart", touchstartOrMousedownOnWindow);
        window.removeEventListener("touchend", touchendOrMouseupOnWindow);
        window.removeEventListener("touchcancel", touchendOrMouseupOnWindow);
      } else {
        window.removeEventListener("mousedown", touchstartOrMousedownOnWindow);
        window.removeEventListener("mouseup", touchendOrMouseupOnWindow);
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
      <Stage
        width={stageWidth}
        height={stageHeight}
        options={{ transparent: true, autoDensity: true }}
      >
        {/* PIXI.app.stage に 同じevent, hitAreaを設定しても発火しないため、Stageと同じサイズのPIXI.Containerを独自で設定する */}
        <Container
          interactive={true}
          pointerdown={pointerdownOnRootContainer}
          pointerup={pointerupOnRootContainer}
          hitArea={new PIXI.Rectangle(0, 0, stageWidth, stageHeight)}
          pointermove={onPointerMove}
        >
          {hierarchy.map(({ objectId, url, pointer, scale, angle }) => {
            const x = stageWidth * pointer.x;
            const y = stageHeight * pointer.y;
            const width = 100;
            const height = 100;

            return (
              <React.Fragment key={objectId}>
                {handlingObjectIds.selected === objectId && (
                  <Graphics
                    scale={scale}
                    anchor={0.5}
                    x={x}
                    y={y}
                    draw={(g) => {
                      g.clear();
                      g.lineStyle(1, 0x111111, 0.5);
                      // g.beginFill(0xff700b, 1);
                      g.drawRect(
                        -1 * (width / 2),
                        -1 * (height / 2),
                        width,
                        height
                      );
                      g.endFill();
                    }}
                  />
                )}
                <Sprite
                  image={url}
                  x={x}
                  y={y}
                  scale={scale}
                  anchor={0.5}
                  interactive={true}
                  buttonMode={true}
                  pointerdown={pointerdownOnObject(objectId)}
                  pointerup={pointerupOnObject(objectId)}
                />
              </React.Fragment>
            );
          })}
        </Container>
      </Stage>
    </div>
  );
};

export default Renderer;
