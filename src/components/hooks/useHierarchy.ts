import { useCallback, useMemo, useState } from "react";
import useRemoteObjects, { PartId } from "./useRemoteObjects";

export type ObjectId = string;

export type Pointer = {
  x: number;
  y: number;
};

export interface ObjectState {
  objectId: ObjectId;
  partId: PartId;
  pointer: Pointer;
  order: number;
}

export type HierarchyState = {
  [objectId in ObjectId]: ObjectState;
};

export type Hierarchy = (ObjectState & { url: string })[];

const useHierarchy = () => {
  const { all: allParts } = useRemoteObjects();
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
      return {
        ...object,
        url: allParts.find((p) => p.id === object.partId)?.url ?? "",
      };
    });
  }, [hierarchyState]);

  const addObject = useCallback(
    (params: { partId: string }) => {
      const { partId } = params;
      const objectId = createObjectId(partId);

      const prevMaxOrderNumber = Object.keys(hierarchyState).length - 1;
      const newMaxOrderNumber = prevMaxOrderNumber + 1;

      setHierarchyState((prev) => ({
        ...prev,
        [objectId]: {
          objectId,
          partId,
          order: newMaxOrderNumber,
          pointer: {
            x: 0.5,
            y: 0.5,
          },
        },
      }));
    },
    [hierarchyState]
  );

  const updateObject = useCallback(
    (params: { objectId: string; key: keyof Hierarchy[0]; value: any }) => {
      setHierarchyState((prev) => ({
        ...prev,
        [params.objectId]: {
          ...prev[params.objectId],
          [params.key]: params.value,
        },
      }));
    },
    []
  );

  const createObjectId = (partId: PartId) => {
    return `${partId}_${Date.now()}`;
  };

  return { hierarchy, addObject, updateObject };
};

export default useHierarchy;
