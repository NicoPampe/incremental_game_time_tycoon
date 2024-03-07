"use client";

import { useEffect, useRef, useState } from "react";
import styled, { DefaultTheme } from "styled-components";

import {
  resourceMangMeta as res,
  resourcesI,
  travelersI,
} from "./resourceService/resourcesService";

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
  // const woodCount = useRef(0);
  const woodGathered = useRef(0);
  const [travelers, setTravelers] = useState<Array<travelersI>>([]);
  // const [populationCount, setPopulationCount] = useState(1);

  // TODO: use local
  const populationDistribution = useRef({
    unemployed: 1,
    woodCutters: 0,
    timeResourceInvestor: 0,
  });

  const [time, setTime] = useState(Date.now());
  const interval = setInterval(() => {
    handleGameTick();
    setTime(Date.now());
  }, 1000);
  function handleGameTick() {
    // console.log(interval);

    // Only set the states if there are worker populations to do so.
    if (populationDistribution.current.woodCutters) {
      woodGathered.current +=
        populationDistribution.current.woodCutters * res.woodScaler;
      if (Math.floor(woodGathered.current) >= 1) {
        setWood(woodCount + Math.floor(woodGathered.current));
        woodGathered.current = 0;
      }
    }
    if (
      populationDistribution.current.timeResourceInvestor &&
      woodCount > res.travelersCost.baseWoodLoad
    ) {
      // Rules for a Time investor:
      //  An investor can only take X total resources. Weight.
      //  Once taken, the investor is stuck in Time.
      //  There must be some kind of "future" pay out.
      if (travelers.length) {
        travelers.map((traveler, i) => {
          traveler.timeInTransit += 1;
          // TODO: set to a value the user can change. Gives weight to their choice for "idle" time
          const logOfTime = Math.log10(traveler.timeInTransit + 1);
          if (logOfTime > res.travelersCost.baseMaxTransitTime) {
            // TODO: make a functional component for in game dialog
            console.log(
              "A traveler from the past has appear! The brought with time trade from long ago that is more valuable."
            );
            const woodGatheredInTime =
              traveler.trade.wood * res.travelersCost.baseTradeMultiplier;
            setWood(woodCount + woodGatheredInTime);
            traveler.timeInTransit = 0;
          }
        });
      }
      if (
        travelers.length < populationDistribution.current.timeResourceInvestor
      ) {
        setTravelers([
          ...travelers,
          {
            trade: {
              wood: res.travelersCost.baseWoodLoad,
            },
            timeInTransit: 0,
          },
        ]);
        setWood(woodCount - res.travelersCost.baseWoodLoad);
      }
    }
    clearInterval(interval);
  }

  // TODO: create function module for displaying the Job Board
  const addWoodCutterJob = (): void => {
    populationDistribution.current.unemployed -= 1;
    populationDistribution.current.woodCutters += 1;
  };
  const removeWoodCutterJob = (): void => {
    populationDistribution.current.unemployed += 1;
    populationDistribution.current.woodCutters -= 1;
  };

  const addTimeInvestorJob = (): void => {
    populationDistribution.current.unemployed -= 1;
    populationDistribution.current.timeResourceInvestor += 1;
  };
  const removeTimeInvestorJob = (): void => {
    populationDistribution.current.unemployed += 1;
    populationDistribution.current.timeResourceInvestor -= 1;
  };

  function handleWoodButtonClick() {
    console.log("wood click more");
    setWood(woodCount + 1);
  }

  function handleHutButtonClick() {
    const hutTotalCost = res.hutCost.base;
    if (woodCount >= hutTotalCost) {
      populationDistribution.current.unemployed += res.hutCost.populationCount;
      setWood(woodCount - hutTotalCost);
    }
  }

  const getTotalPopulation = (): number =>
    Object.values(populationDistribution.current).reduce(
      (acc, cur) => acc + cur
    );

  return (
    <>
      <Button onClick={handleWoodButtonClick}>Collect Wood</Button>
      <h3>Wood: {woodCount}</h3>
      <Button onClick={handleHutButtonClick}>Build A Hut</Button>
      <h4>Costs: {res.hutCost.base}</h4>
      <h3>Population: {getTotalPopulation()}</h3>

      <view
        style={{
          flexDirection: "row",
          marginLeft: 20,
          justifyContent: "space-evenly",
        }}
      >
        Wood cutters {populationDistribution.current.woodCutters}:
        <button
          onClick={addWoodCutterJob}
          disabled={populationDistribution.current.unemployed == 0}
        >
          +
        </button>
        <button
          onClick={removeWoodCutterJob}
          disabled={populationDistribution.current.woodCutters == 0}
        >
          -
        </button>
      </view>
      <view
        style={{
          flexDirection: "row",
          marginLeft: 20,
          justifyContent: "space-evenly",
        }}
      >
        Time Investors {populationDistribution.current.timeResourceInvestor}:
        <button
          onClick={addTimeInvestorJob}
          disabled={populationDistribution.current.unemployed == 0}
        >
          +
        </button>
        <button
          onClick={removeTimeInvestorJob}
          disabled={populationDistribution.current.timeResourceInvestor == 0}
        >
          -
        </button>
      </view>
      <div></div>
    </>
  );
}
