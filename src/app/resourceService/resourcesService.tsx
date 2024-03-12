// TODO: build a graph for more relation.
export interface resourcesI {
  wood: number;
}

export interface travelersI {
  trade: resourcesI;
  timeInTransit: number;
}

// I want a CRUD style for managing what values.
export const resourceMangMeta = {
  woodScaler: 0.1,
  hutCost: {
    base: 10,
    scaler: 0.4,
    populationCount: 2,
  },
  travelersCost: {
    baseWoodLoad: 10,
    baseMaxTransitTime: 2,
    baseTradeMultiplier: 1.5,
  },
  maxPopulationBase: 10,
  buildings: {
    huts: 0,
  },
};
