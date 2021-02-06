//! Only gets run when the CAD gets detected as out of date
const { exec } = require("child_process");

const GIT_PULL_STRING = "git pull origin main";

function autoUpdate() {
  console.log("Trying to auto update");

  exec(GIT_PULL_STRING, (err, out) => {
    if (err) {
      console.error("Tried to auto-update but didn't work, please manually update the CAD");
      return;
    }

    // CAD is already up to date
    if (out.includes("Already up to date")) return console.log("CAD is already up to date!");

    console.log("Fetching new code..");
    console.log("Updating dependencies..\n");

    require("./install");
  });
}

autoUpdate();
