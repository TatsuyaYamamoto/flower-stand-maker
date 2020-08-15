import React, { FC } from "react";
import { Stage, Sprite } from "@inlet/react-pixi";
import { Hierarchy } from "../hooks/useHierarchy";

interface RendererProps {
  hierarchy: Hierarchy;
}

const Renderer: FC<RendererProps> = (props) => {
  const { hierarchy } = props;

  return (
    <Stage width={300} height={300} options={{ transparent: true }}>
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
  );
};

export default Renderer;
