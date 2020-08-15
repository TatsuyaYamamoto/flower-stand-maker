import React, { FC } from "react";
import { Stage, Sprite } from "@inlet/react-pixi";
import { Hierarchy } from "../hooks/useHierarchy";

interface RendererProps {
  hierarchy: Hierarchy;
}

const Renderer: FC<RendererProps> = (props) => {
  const { hierarchy } = props;

  return (
    <Stage>
      {hierarchy.map((object) => {
        if (object.type === "image") {
          return <Sprite image={object.url} x={100} y={100} />;
        }

        return <>{/* empty */}</>;
      })}
    </Stage>
  );
};
