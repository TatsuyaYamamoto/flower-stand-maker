import { useMemo, useState } from "react";
import useParts, { PartId } from "./useParts";

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
  const { all: allParts } = useParts();

  /**
   * @private
   */
  const [hierarchyState, setHierarchyState] = useState<HierarchyState>({});

  /**
   * @private
   */
  const objectIds = useMemo(() => {
    return Object.keys(hierarchyState);
  }, [hierarchyState]);

  /**
   * @private
   */
  const maxOrderNumber = useMemo(() => {
    return Object.keys(hierarchyState).length - 1;
  }, [hierarchyState]);

  /**
   * @private
   * @param partId
   */
  const createObjectId = (partId: PartId) => {
    return `${partId}_${Date.now()}`;
  };

  const hierarchy = useMemo<Hierarchy>(() => {
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
      return {
        ...object,
        url: allParts.find((p) => p.id === object.partId)?.url ?? "",
      };
    });
  }, [hierarchyState]);

  const addObject = (params: { partId: string }) => {
    const { partId } = params;
    const objectId = createObjectId(partId);

    const newMaxOrderNumber = maxOrderNumber + 1;

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
  };

  const updateObject = (params: {
    objectId: string;
    key: keyof Hierarchy[0];
    value: any;
  }) => {
    setHierarchyState((prev) => {
      return {
        ...prev,
        [params.objectId]: {
          ...prev[params.objectId],
          [params.key]: params.value,
        },
      };
    });
  };

  const changeOrder = (params: { objectId: string; to: number | "front" }) => {
    if (params.to === "front") {
      setHierarchyState((prev) => {
        const from = prev[params.objectId].order;
        const newState: HierarchyState = {};

        objectIds.forEach((objectId) => {
          const prevObjectState = prev[objectId];

          if (prevObjectState.objectId === params.objectId) {
            newState[objectId] = {
              ...prevObjectState,
              order: maxOrderNumber,
            };
            return;
          }

          if (from < prevObjectState.order) {
            newState[objectId] = {
              ...prevObjectState,
              order: prevObjectState.order - 1,
            };
            return;
          }

          newState[objectId] = {
            ...prevObjectState,
          };
        });

        return newState;
      });

      return;
    }

    throw new Error("not implemented.");
  };

  return { hierarchy, addObject, updateObject, changeOrder };
};

export default useHierarchy;
