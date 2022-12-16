// @ts-nocheck --- todo: fix type

const POINTS_MAP = {
  atmiyata: 100,
  management: 100,
};

export const processPoints = (data) => {
  return Object.keys(data).reduce((acc, cur) => {
    const [type, teamId, name] = cur.split("_");

    // if value is boolean return points from POINTS_MAP
    // otherwise return original value
    const value =
      typeof data[cur] === "boolean"
        ? data[cur] === true
          ? POINTS_MAP[name]
          : 0
        : data[cur];

    return [...acc, { name, type, teamId: parseInt(teamId), value }];
  }, []);
};
