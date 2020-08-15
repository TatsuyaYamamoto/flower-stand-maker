import { useState } from "react";

const useRemoteObjects = () => {
  const [flowers] = useState<{ id: string; url: string }[]>([
    { id: `nami_flower_0`, url: `/assets/images/flower_sunflower.png` },
    { id: `nami_flower_1`, url: `/assets/images/flower_rose_blue.png` },
    { id: `nami_flower_2`, url: `/assets/images/flower_rose_red.png` },
    { id: `nami_flower_3`, url: `/assets/images/flower_rose_white.png` },
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
    { id: `nami_happa_0`, url: `/assets/images/happa_happa_1.png` },
    { id: `nami_happa_1`, url: `/assets/images/happa_kasumisou.png` },
    { id: `balloon_0`, url: `/assets/images/flower0221.png` },
    { id: `balloon_1`, url: `/assets/images/flower0245.png` },
    { id: `balloon_2`, url: `/assets/images/flower0141.png` },
    { id: `balloon_3`, url: `/assets/images/flower0145.png` },
    { id: `balloon_4`, url: `/assets/images/flower0221.png` },
    { id: `balloon_5`, url: `/assets/images/flower0245.png` },
    { id: `balloon_6`, url: `/assets/images/flower0141.png` },
    { id: `balloon_7`, url: `/assets/images/flower0145.png` },
    { id: `balloon_8`, url: `/assets/images/flower0221.png` },
    { id: `balloon_9`, url: `/assets/images/flower0245.png` },
    { id: `balloon_10`, url: `/assets/images/flower0141.png` },
  ]);

  return {
    flowers,
    balloons,
  };
};

export default useRemoteObjects;
