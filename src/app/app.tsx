"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./components/utils/button";
import {
  resourceMangMeta as res,
  travelersI,
} from "./resourceService/resourcesService";

import Wood from "./components/wood";

// Inspiration for timer loop: https://medium.com/projector-hq/writing-a-run-loop-in-javascript-react-9605f74174b
const useFrameTime = () => {
  const [frameTime, setFrameTime] = useState(performance.now());
  useEffect(() => {
    // TODO: time should be typed
    let frameId: any;
    const frame = (time: any) => {
      setFrameTime(time);
      frameId = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);
  return frameTime;
};

const Timer = () => {
  // Use state if need be later. But currently I have no need to reRender
  const startTime = useRef(performance.now());
  const frameTime = useFrameTime();
  const resetTimer = () => {
    startTime.current = performance.now();
  };

  const time = frameTime - startTime.current;
  return { time, resetTimer };
};

/**
 * An incremental game, where we control a "player" progressing through time.
 * They must build up their time settlement each time, but each time it helps them make it farther
 * and farther before needing to reset and start their settlement over.
 */
// Time Travel Tycoon: Players control a time-traveling company, sending agents to different historical eras to gather resources and influence pivotal events. Manage resources like chronotons, historical artifacts, and knowledge points to upgrade time machines, hire historical figures, and alter the timeline to your advantage. Be careful of paradoxes that could disrupt the fabric of reality!
export default function TimeTravelTycoon() {
  // Rearouses state
  const [woodCount, setWood] = useState({ count: 0 });
  const woodGathered = useRef(0);
  const [travelers, setTravelers] = useState<Array<travelersI>>([]);

  // TODO: use local
  const populationDistribution = useRef({
    unemployed: 1,
    woodCutters: 0,
    timeResourceInvestor: 0,
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Set Up the Game Timer loop
  // Set Up all our resource value changes on a Game Tick.
  const tickTime = 1000; // about 1 sec
  const timer = Timer();
  if (timer.time > tickTime) {
    handleGameTick();
    timer.resetTimer();
  }

  function handleGameTick() {
    if (populationDistribution.current.woodCutters) {
      handleWoodCutter();
    }
    if (populationDistribution.current.timeResourceInvestor) {
      handleTimeTravelers();
    }
  }

  function handleWoodCutter() {
    woodGathered.current +=
      populationDistribution.current.woodCutters * res.woodScaler;
    if (Math.floor(woodGathered.current) >= 1) {
      handleWoodChange(Math.floor(woodGathered.current));
      woodGathered.current = 0;
    }
  }

  function handleWoodChange(delta: number) {
    setWood((prevState) => {
      return {
        ...{
          count: prevState.count + delta,
        },
      };
    });
  }

  function handleTimeTravelers() {
    if (woodCount.count > res.travelersCost.baseWoodLoad) {
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
            const woodGatheredMultipliedInTime =
              traveler.trade.wood * res.travelersCost.baseTradeMultiplier;
            console.log(
              "A traveler from the past has appear! The brought with time trade from long ago that is more valuable. They gathered: ",
              woodGatheredMultipliedInTime
            );
            handleWoodChange(woodGatheredMultipliedInTime);
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
        handleWoodChange(-res.travelersCost.baseWoodLoad);
      }
    }
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
    handleWoodChange(1);
  }

  function handleHutButtonClick() {
    const hutTotalCost = res.hutCost.base;
    if (woodCount.count >= hutTotalCost) {
      populationDistribution.current.unemployed += res.hutCost.populationCount;
      handleWoodChange(-hutTotalCost);
    }
  }

  const getTotalPopulation = (): number =>
    Object.values(populationDistribution.current).reduce(
      (acc, cur) => acc + cur
    );

  return (
    <>
      <Button onClick={handleWoodButtonClick}>Collect Wood</Button>
      <Wood woodCount={woodCount.count} />
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
