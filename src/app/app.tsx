"use client";

import { useEffect, useRef, useState } from "react";

const resourceMangMeta = {
  woodScaler: 0.2,
  hutCost: {
    base: 10,
    scaler: 0.4,
    populationCount: 2,
  },
  maxPopulationBase: 10,
};

/**
 * An incremental game, where we control a "player" progressing through time.
 * They must build up their time settlement each time, but each time it helps them make it farther
 * and farther before needing to reset and start their settlement over.
 */
// Time Travel Tycoon: Players control a time-traveling company, sending agents to different historical eras to gather resources and influence pivotal events. Manage resources like chronotons, historical artifacts, and knowledge points to upgrade time machines, hire historical figures, and alter the timeline to your advantage. Be careful of paradoxes that could disrupt the fabric of reality!
export default function TimeTravelTycoon() {
  // In game clock.
  // TODO: Need to calc the since last loaded. A starting point. Maybe that is all collected in "resources" from local storage.
  const inGameTimerRef = useRef(0);
  let intervalId;
  // Rearouses state
  const [woodCount, setWood] = useState(0);
  const woodGathered = useRef(0);
  const [populationCount, setPopulationCount] = useState(1);

  const [time, setTime] = useState(Date.now());
  const interval = setInterval(() => {
    handleGameTick();
    setTime(Date.now());
  }, 1000);
  // useEffect(() => {
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     handleGameTick({
  //       woodCount,
  //     });
  //     setTime(Date.now());
  //   }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  // intervalId = setInterval(() => {
  //   handleGameTick();
  // });
  // function handleGameTick(resources: { woodCount: number }) {
  function handleGameTick() {
    // Only set the states if there are worker populations to do so.
    if (populationCount) {
      woodGathered.current =
        woodGathered.current + populationCount * resourceMangMeta.woodScaler;

      console.log(woodGathered);
      if (Math.floor(woodGathered.current) >= 1) {
        console.log("trigger: ", Math.floor(woodGathered.current));
        console.log("wood: ", woodCount);
        // console.log("resources.woodCount: ", resources.woodCount);
        // setWood(resources.woodCount + Math.floor(woodGathered.current));
        setWood(woodCount + Math.floor(woodGathered.current));
        woodGathered.current = 0;
      }
    }

    clearInterval(interval);
  }

  function handleWoodButtonClick() {
    setWood(woodCount + 1);
  }

  function handleHutButtonClick() {
    if (woodCount > resourceMangMeta.hutCost.base) {
      setPopulationCount(
        populationCount + resourceMangMeta.hutCost.populationCount
      );
    }
  }

  return (
    <>
      <button onClick={handleWoodButtonClick}>Collect Wood</button>
      <h3>Wood: {woodCount}</h3>
      <button onClick={handleHutButtonClick}>Build A Hut</button>
      <h4>Costs: {resourceMangMeta.hutCost.base}</h4>
      <h3>Population: {populationCount}</h3>
    </>
  );
}
