/** @jsx jsx */
import React, { FC, useState } from "react";
import { Stage, Sprite } from "@inlet/react-pixi";
import { InteractionEvent } from "pixi.js";
import { jsx, css } from "@emotion/core";

import { Hierarchy } from "@/components/hooks/useHierarchy";

interface RendererProps {
  hierarchy: Hierarchy;
  onMove: (params: {
    hierarchyId: string;
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

  const onDragStart = (hierarchyId: string) => ({ data }: InteractionEvent) => {
    setSelectedHierarchyId(hierarchyId);
  };

  const onDragMove = (hierarchyId: string) => ({ data }: InteractionEvent) => {
    if (hierarchyId === selectedHierarchyId) {
      const { x, y } = data.global;

      onMove({
        hierarchyId,
        pointer: {
          x: x / stageWidth,
          y: y / stageHeight,
        },
      });
    }
  };

  const onDragEnd = (hierarchyId: string) => ({ data }: InteractionEvent) => {
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
        {hierarchy
          .map(({ hierarchyId, url, pointer, type }) => {
            if (type === "image") {
              return (
                <Sprite
                  key={hierarchyId}
                  image={url}
                  x={stageWidth * pointer.x}
                  y={stageHeight * pointer.y}
                  width={100}
                  height={100}
                  anchor={0.5}
                  interactive={true}
                  buttonMode={true}
                  pointerdown={onDragStart(hierarchyId)}
                  pointermove={onDragMove(hierarchyId)}
                  pointerup={onDragEnd(hierarchyId)}
                  pointerupoutside={onDragEnd(hierarchyId)}
                />
              );
            }

            return null;
          })
          .filter(Boolean)}
      </Stage>
    </div>
  );
};

export default Renderer;
