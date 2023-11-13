
type Resource = {
  key: string;
  data: {
    default: string;
  };
};

export class Tools {
  static massiveRequire(req:__WebpackModuleApi.RequireContext) {
    const files: Resource[] = [];

    req.keys().forEach((key: string) => {
      files.push({
        key,
        data: req(key),
      });
    });

    return files;
  }
}
