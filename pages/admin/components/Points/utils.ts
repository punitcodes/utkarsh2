// @ts-nocheck --- todo: fix type

const POINTS_MAP = {
  atmiyata: 100,
  management: 100,
};

export const processPoints = (data) => {
  return Object.keys(data).reduce((acc, cur) => {
    const [type, teamOrYuvakId, name, newOrExisting, id] = cur.split("_");

    // if value is boolean return points from POINTS_MAP
    // otherwise return original value
    const getValue = () => {
      const value = data[cur];

      if (!value) return 0;

      return typeof value === "boolean" ? 1 : parseInt(value);
    };

    return {
      ...acc,
      [newOrExisting]: [
        ...(acc[newOrExisting] || []),
        {
          name,
          type,
          value: getValue(),
          ...(newOrExisting === "existing" ? { id: parseInt(id) } : {}),
          ...(teamOrYuvakId
            ? {
                [type === "yuvak" ? "yuvakId" : "teamId"]:
                  parseInt(teamOrYuvakId),
              }
            : {}),
        },
      ],
    };
  }, {});
};
