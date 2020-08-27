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
  scale: number;
  angle: number;
  order: number;
  visible: boolean;
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
        visible: true,
        scale: 1,
        angle: 0,
        pointer: {
          x: 0.5,
          y: 0.5,
        },
      },
    }));
  };

  const removeObject = (params: { objectId: string }) => {
    const removeObjectId = params.objectId;

    setHierarchyState((prev) => {
      const removeObjectOrder = prev[removeObjectId].order;
      const newState: HierarchyState = {};

      objectIds.forEach((objectId) => {
        const prevObjectState = prev[objectId];

        if (objectId !== removeObjectId) {
          newState[objectId] = {
            ...prevObjectState,
            order:
              removeObjectOrder < prevObjectState.order
                ? prevObjectState.order - 1
                : prevObjectState.order,
          };
        }
      });

      return newState;
    });
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

  const changeScale = (params: { objectId: string; rate: number }) => {
    const currentScale = hierarchyState[params.objectId].scale;
    const newScale = currentScale * params.rate;

    updateObject({
      objectId: params.objectId,
      key: "scale",
      value: newScale,
    });
  };

  const changeOrder = (params: { objectId: string; to: number | "front" }) => {
    const newIndex = params.to === "front" ? maxOrderNumber : params.to;

    setHierarchyState((prev) => {
      const prevIndex = prev[params.objectId].order;
      console.log(
        `change order ${params.objectId} prev:${prevIndex}, new ${newIndex}`
      );

      if (prevIndex === newIndex) {
        return prev;
      }

      const newState: HierarchyState = {};

      objectIds.forEach((objectId) => {
        const prevObjectState = prev[objectId];

        if (prevObjectState.objectId === params.objectId) {
          newState[objectId] = {
            ...prevObjectState,
            order: newIndex,
          };
          return;
        }

        if (
          prevIndex <= prevObjectState.order &&
          prevObjectState.order <= newIndex
        ) {
          newState[objectId] = {
            ...prevObjectState,
            order: prevObjectState.order - 1,
          };
          return;
        }

        if (
          newIndex <= prevObjectState.order &&
          prevObjectState.order <= prevIndex
        ) {
          newState[objectId] = {
            ...prevObjectState,
            order: prevObjectState.order + 1,
          };
          return;
        }

        newState[objectId] = {
          ...prevObjectState,
        };
      });

      return newState;
    });
  };

  return {
    hierarchy,
    addObject,
    removeObject,
    updateObject,
    changeOrder,
    changeScale,
  };
};

export default useHierarchy;
