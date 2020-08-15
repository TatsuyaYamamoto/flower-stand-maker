/** @jsx jsx */
import React, { FC } from "react";
import { Stage, Sprite } from "@inlet/react-pixi";
import { jsx, css } from "@emotion/core";

import { Hierarchy } from "@/components/hooks/useHierarchy";

interface RendererProps {
  hierarchy: Hierarchy;
}

const Renderer: FC<RendererProps> = (props) => {
  const { hierarchy } = props;
  const width = 300;
  const height = 400;

  return (
    <div
      css={css`
        width: ${width}px;
        height: ${height}px;
        background-color: mintcream;
        box-shadow: 10px 10px 30px rgba(18, 47, 61, 0.5),
          -10px -10px 30px rgba(248, 253, 255, 0.9),
          inset 10px 10px 30px transparent, inset -10px -10px 30px transparent;
      `}
    >
      <Stage
        width={width}
        height={height}
        options={{ transparent: true, autoDensity: true }}
      >
        {hierarchy
          .map((object) => {
            if (object.type === "image") {
              return (
                <Sprite
                  key={object.hierarchyId}
                  image={object.url}
                  x={100}
                  y={100}
                  width={100}
                  height={100}
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
