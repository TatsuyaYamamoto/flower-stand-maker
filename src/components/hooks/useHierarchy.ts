import { useCallback, useMemo, useState } from "react";
import useRemoteObjects from "./useRemoteObjects";

export type ObjectType = "image";

export interface ObjectState {
  objectId: string;
  type: ObjectType;
  order: number;
}

export interface HierarchyState {
  [objectId: string]: ObjectState;
}

export type Hierarchy = {
  id: string;
  type: "image";
  url: string;
}[];

const useHierarchy = () => {
  const { flowers } = useRemoteObjects();
  const [hierarchyState, setHierarchyState] = useState<HierarchyState>({});

  const hierarchy = useMemo<Hierarchy>(() => {
    const objectIds = Object.keys(hierarchyState);
    const randomOrderedHierarchy = objectIds.map((objectId) => {
      return hierarchyState[objectId];
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
          id: object.objectId,
          type: object.type,
          // TODO type-safe
          url: flowers.find(({ id }) => id === object.objectId)?.url as string,
        };
      }

      return {
        id: object.objectId,
        type: object.type,
        url: "dummy",
      };
    });
  }, [hierarchyState]);

  const addObject = useCallback(
    (params: { id: string; type: ObjectType }) => {
      const prevMaxOrderNumber = Object.keys(hierarchyState).length - 1;
      const newMaxOrderNumber = prevMaxOrderNumber + 1;
      const newHierarchyState: HierarchyState = {
        ...hierarchyState,
        [params.id]: {
          objectId: params.id,
          type: params.type,
          order: newMaxOrderNumber,
        },
      };

      setHierarchyState(newHierarchyState);
    },
    [hierarchyState]
  );

  return { hierarchy, addObject };
};

export default useHierarchy;
