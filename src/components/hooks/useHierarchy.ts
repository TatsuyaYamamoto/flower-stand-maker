import { useCallback, useEffect, useMemo, useState } from "react";
import useRemoteObjects from "./useRemoteObjects";

export type ObjectType = "image";

type ObjectId = string;

export interface ObjectState {
  objectId: ObjectId;
  hierarchyId: HierarchyId;
  type: ObjectType;
  order: number;
  pointer: {
    x: number;
    y: number;
  };
}

type HierarchyId = string;

export interface HierarchyState {
  [HierarchyId: string]: ObjectState;
}

export type Hierarchy = {
  objectId: ObjectId;
  hierarchyId: HierarchyId;
  type: "image";
  url: string;
  pointer: {
    x: number;
    y: number;
  };
}[];

const useHierarchy = () => {
  const { flowers, balloons } = useRemoteObjects();
  const [hierarchyState, setHierarchyState] = useState<HierarchyState>({});

  const hierarchy = useMemo<Hierarchy>(() => {
    const hierarchyIds = Object.keys(hierarchyState);
    const randomOrderedHierarchy = hierarchyIds.map((hierarchyId) => {
      return hierarchyState[hierarchyId];
    });
    const orderedHierarchy = randomOrderedHierarchy.sort((a, b) => {
      if (a.order < b.order) {
        return -1;
      }
      if (b.order < a.order) {
        return 1;
      }
      return 0;
    });

    return orderedHierarchy.map((object) => {
      if (object.type === "image") {
        return {
          objectId: object.objectId,
          hierarchyId: object.hierarchyId,
          type: object.type,
          // TODO type-safe
          url: [...flowers, ...balloons].find(
            ({ id }) => id === object.objectId
          )?.url as string,
          pointer: object.pointer,
        };
      }

      return {
        objectId: object.objectId,
        hierarchyId: object.hierarchyId,
        type: object.type,
        url: "dummy",
        pointer: object.pointer,
      };
    });
  }, [hierarchyState, flowers, balloons]);

  const addObject = useCallback(
    (params: { id: string; type: ObjectType }) => {
      const objectId = params.id;
      const hierarchyId = createHierarchyId(objectId);

      const prevMaxOrderNumber = Object.keys(hierarchyState).length - 1;
      const newMaxOrderNumber = prevMaxOrderNumber + 1;
      const newHierarchyState: HierarchyState = {
        ...hierarchyState,
        [hierarchyId]: {
          objectId,
          hierarchyId,
          type: params.type,
          order: newMaxOrderNumber,
          pointer: {
            x: 0.5,
            y: 0.5,
          },
        },
      };

      setHierarchyState(newHierarchyState);
    },
    [hierarchyState]
  );

  const updateObject = useCallback(
    (params: { hierarchyId: string; key: keyof Hierarchy[0]; value: any }) => {
      setHierarchyState((prev) => ({
        ...prev,
        [params.hierarchyId]: {
          ...prev[params.hierarchyId],
          [params.key]: params.value,
        },
      }));
    },
    []
  );

  const createHierarchyId = (objectId: ObjectId) => {
    return `${objectId}_${Date.now()}`;
  };

  return { hierarchy, addObject, updateObject };
};

export default useHierarchy;
