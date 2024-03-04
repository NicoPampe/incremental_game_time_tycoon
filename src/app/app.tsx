"use client";

import { useEffect, useRef, useState } from "react";
import styled, { DefaultTheme } from "styled-components";

const resourceMangMeta = {
  woodScaler: 0.2,
  hutCost: {
    base: 10,
    scaler: 0.4,
    populationCount: 2,
  },
  maxPopulationBase: 10,
};

interface ThemeInterface {
  blue: {
    default: string;
    hover: string;
  };
  pink: {
    default: string;
    hover: string;
  };
}

const theme: ThemeInterface = {
  blue: {
    default: "#3f51b5",
    hover: "#283593",
  },
  pink: {
    default: "#e91e63",
    hover: "#ad1457",
  },
};

const Button = styled.button`
  background-color: ${(props) => props.theme.default};
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  border: 0;
  text-transform: uppercase;
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
`;

Button.defaultProps = {
  theme: theme.blue,
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
  function handleGameTick() {
    // Only set the states if there are worker populations to do so.
    if (populationCount) {
      woodGathered.current =
        woodGathered.current + populationCount * resourceMangMeta.woodScaler;

      console.log(woodGathered);
      if (Math.floor(woodGathered.current) >= 1) {
        // console.log("trigger: ", Math.floor(woodGathered.current));
        // console.log("wood: ", woodCount);
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
      <Button onClick={handleWoodButtonClick}>Collect Wood</Button>
      <h3>Wood: {woodCount}</h3>
      <Button onClick={handleHutButtonClick}>Build A Hut</Button>
      <h4>Costs: {resourceMangMeta.hutCost.base}</h4>
      <h3>Population: {populationCount}</h3>
    </>
  );
}
