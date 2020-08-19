/** @jsx jsx */
import React, { FC, useCallback, useEffect, useState } from "react";
import { Stage, Sprite, Graphics, Container } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";
import { InteractionEvent } from "pixi.js";
import { jsx, css } from "@emotion/core";

import { Hierarchy } from "@/components/hooks/useHierarchy";

// https://github.com/bfanger/pixi-inspector/issues/35#issuecomment-517811412
// @ts-ignore
window.__PIXI_INSPECTOR_GLOBAL_HOOK__?.register({ PIXI: PIXI });

interface RendererProps {
  hierarchy: Hierarchy;
  onMove: (params: {
    objectId: string;
    pointer: { x: number; y: number };
  }) => void;
}

const Renderer: FC<RendererProps> = (props) => {
  const { hierarchy, onMove } = props;
  const stageWidth = 300;
  const stageHeight = 400;

  const [handlingObjectIds, setHandlingObjectIds] = useState<{
    selected: string | null;
    held: string | null;
  }>({
    selected: null,
    held: null,
  });

  const handleWindowClick = useCallback(() => {
    console.log("pointerdown window");

    if (handlingObjectIds.selected) {
      setHandlingObjectIds((prev) => ({
        ...prev,
        selected: null,
      }));
    }
  }, [handlingObjectIds]);

  const onTapContainer = (e: PIXI.InteractionEvent) => {
    console.log("pointerdown root container");

    // prevent to fire event of document and window
    e.data.originalEvent.stopPropagation();

    if (handlingObjectIds.selected) {
      setHandlingObjectIds((prev) => ({
        ...prev,
        selected: null,
      }));
    }
  };

  const onPointerDown = (objectId: string) => (e: InteractionEvent) => {
    console.log("pointerdown", objectId, e.stopped);

    // prevent to fire root container event
    e.stopPropagation();
    // prevent to fire window event
    e.data.originalEvent.stopPropagation();

    setHandlingObjectIds({
      selected: objectId,
      held: objectId,
    });
  };

  const onPointerMove = (e: InteractionEvent) => {
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

  const onPointerUp = (objectId: string) => ({ data }: InteractionEvent) => {
    setHandlingObjectIds((prev) => ({
      ...prev,
      held: null,
    }));
  };

  useEffect(() => {
    window.addEventListener("pointerdown", handleWindowClick);

    return () => {
      window.removeEventListener("pointerdown", handleWindowClick);
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
          pointerdown={onTapContainer}
          hitArea={new PIXI.Rectangle(0, 0, stageWidth, stageHeight)}
          pointermove={onPointerMove}
        >
          {hierarchy.map(({ objectId, url, pointer }) => {
            const x = stageWidth * pointer.x;
            const y = stageHeight * pointer.y;
            const width = 100;
            const height = 100;

            return (
              <React.Fragment key={objectId}>
                {handlingObjectIds.selected === objectId && (
                  <Graphics
                    draw={(g) => {
                      g.clear();
                      g.lineStyle(1, 0x111111, 0.5);
                      // g.beginFill(0xff700b, 1);
                      g.drawRect(x - width / 2, y - height / 2, width, height);
                      g.endFill();
                    }}
                  />
                )}
                <Sprite
                  image={url}
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  anchor={0.5}
                  interactive={true}
                  buttonMode={true}
                  pointerdown={onPointerDown(objectId)}
                  pointerup={onPointerUp(objectId)}
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
