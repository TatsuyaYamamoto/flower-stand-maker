import { useState } from "react";

const useRemoteObjects = () => {
  const [flowers] = useState<{ id: string; url: string }[]>([
    { id: `flower_0`, url: `/assets/images/flower0141.png` },
    { id: `flower_1`, url: `/assets/images/flower0145.png` },
    { id: `flower_2`, url: `/assets/images/flower0221.png` },
    { id: `flower_3`, url: `/assets/images/flower0245.png` },
    { id: `flower_4`, url: `/assets/images/flower0141.png` },
    { id: `flower_5`, url: `/assets/images/flower0145.png` },
    { id: `flower_6`, url: `/assets/images/flower0221.png` },
    { id: `flower_7`, url: `/assets/images/flower0245.png` },
    { id: `flower_8`, url: `/assets/images/flower0141.png` },
    { id: `flower_9`, url: `/assets/images/flower0145.png` },
    { id: `flower_10`, url: `/assets/images/flower0221.png` },
    { id: `flower_11`, url: `/assets/images/flower0245.png` },
    { id: `flower_12`, url: `/assets/images/flower0141.png` },
    { id: `flower_13`, url: `/assets/images/flower0145.png` },
    { id: `flower_14`, url: `/assets/images/flower0221.png` },
    { id: `flower_15`, url: `/assets/images/flower0245.png` },
  ]);

  const [balloons] = useState<{ id: string; url: string }[]>([
    { id: `balloon_0`, url: `/assets/images/flower0221.png` },
    { id: `balloon_0`, url: `/assets/images/flower0245.png` },
    { id: `balloon_0`, url: `/assets/images/flower0141.png` },
    { id: `balloon_0`, url: `/assets/images/flower0145.png` },
    { id: `balloon_0`, url: `/assets/images/flower0221.png` },
    { id: `balloon_0`, url: `/assets/images/flower0245.png` },
    { id: `balloon_0`, url: `/assets/images/flower0141.png` },
    { id: `balloon_0`, url: `/assets/images/flower0145.png` },
    { id: `balloon_0`, url: `/assets/images/flower0221.png` },
    { id: `balloon_0`, url: `/assets/images/flower0245.png` },
    { id: `balloon_0`, url: `/assets/images/flower0141.png` },
    { id: `balloon_0`, url: `/assets/images/flower0145.png` },
    { id: `balloon_0`, url: `/assets/images/flower0221.png` },
    { id: `balloon_0`, url: `/assets/images/flower0245.png` },
    { id: `balloon_0`, url: `/assets/images/flower0141.png` },
    { id: `balloon_0`, url: `/assets/images/flower0145.png` },
    { id: `balloon_0`, url: `/assets/images/flower0221.png` },
    { id: `balloon_0`, url: `/assets/images/flower0245.png` },
    { id: `balloon_0`, url: `/assets/images/flower0141.png` },
    { id: `balloon_0`, url: `/assets/images/flower0145.png` },
    { id: `balloon_0`, url: `/assets/images/flower0221.png` },
    { id: `balloon_0`, url: `/assets/images/flower0245.png` },
    { id: `balloon_0`, url: `/assets/images/flower0141.png` },
    { id: `balloon_0`, url: `/assets/images/flower0145.png` },
    { id: `balloon_0`, url: `/assets/images/flower0221.png` },
    { id: `balloon_0`, url: `/assets/images/flower0245.png` },
    { id: `balloon_0`, url: `/assets/images/flower0141.png` },
    { id: `balloon_0`, url: `/assets/images/flower0145.png` },
    { id: `balloon_0`, url: `/assets/images/flower0221.png` },
    { id: `balloon_0`, url: `/assets/images/flower0245.png` },
  ]);

  return {
    flowers,
    balloons,
  };
};

export default useRemoteObjects;
