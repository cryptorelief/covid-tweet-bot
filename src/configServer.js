const fs = require("fs");

const express = require("express");
const startConfig = require("../startConfig.json");

const CONFIG_FILE_PATH = "./runConfig.json";

const expressApp = express();

let runConfig = {
  enabled: true,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
};

if (fs.existsSync(CONFIG_FILE_PATH)) {
  const raw = fs.readFileSync(CONFIG_FILE_PATH).toString();
  const parsed = JSON.parse(raw);

  try {
    runConfig = {
      ...runConfig,
      ...parsed,
    };
  } catch (error) {
    console.error(error);
  }
} else {
  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(runConfig));
}

expressApp
  .route("/config")
  .get((_, res) => {
    res.json(runConfig);
  })
  .put((req, res) => {
    console.log("request to edit", {
      url: req.url,
      auth: req.headers.authorization,
    });

    if (req.query?.enabled) {
      const enabled = req.query?.enabled === "true";
      runConfig = {
        ...runConfig,
        enabled,
      };
    }

    if (req.query?.startTime) {
      const startTime = new Date(req.query?.startTime);
      runConfig = {
        ...runConfig,
        startTime,
      };
    }

    if (req.query?.endTime) {
      const endTime = new Date(req.query?.endTime);
      runConfig = {
        ...runConfig,
        endTime,
      };
    }

    fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(runConfig), () => {
      console.log("updated config", runConfig);
    });

    res.json({ updated: true, config: runConfig });
  });

module.exports = {
  getRunConfig: () => runConfig,
  runConfigServer: () => {
    console.log("config server listening to port", startConfig.port);

    expressApp.listen(startConfig.port);
  },
};
