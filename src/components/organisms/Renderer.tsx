/** @jsx jsx */
import React, { FC, useState } from "react";
import { Stage, Sprite, Graphics } from "@inlet/react-pixi";
import { InteractionEvent } from "pixi.js";
import { jsx, css } from "@emotion/core";

import { Hierarchy } from "@/components/hooks/useHierarchy";

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

  const [selectedHierarchyId, setSelectedHierarchyId] = useState<string | null>(
    null
  );

  const onDragStart = (objectId: string) => ({ data }: InteractionEvent) => {
    setSelectedHierarchyId(objectId);
  };

  const onDragMove = (objectId: string) => ({ data }: InteractionEvent) => {
    if (objectId === selectedHierarchyId) {
      const { x, y } = data.global;

      onMove({
        objectId,
        pointer: {
          x: x / stageWidth,
          y: y / stageHeight,
        },
      });
    }
  };

  const onDragEnd = (objectId: string) => ({ data }: InteractionEvent) => {
    setSelectedHierarchyId(null);
  };

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
        {hierarchy.map(({ objectId, url, pointer }) => {
          const x = stageWidth * pointer.x;
          const y = stageHeight * pointer.y;
          const width = 100;
          const height = 100;

          return (
            <React.Fragment key={objectId}>
              {selectedHierarchyId === objectId && (
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
                pointerdown={onDragStart(objectId)}
                pointermove={onDragMove(objectId)}
                pointerup={onDragEnd(objectId)}
                pointerupoutside={onDragEnd(objectId)}
              />
            </React.Fragment>
          );
        })}
      </Stage>
    </div>
  );
};

export default Renderer;
