function isCorrectUrl(urlString) {
  const url = new URL(urlString);
  return url.hostname === "chess.com";
}

// https://www.chess.com/callback/user/games?locale=en_US&all=1&userId=2457472&gameType=chess

function gotoUrl() {
  const { redirect } = Host.getFunctions();
  const mem = Memory.fromString("https://www.chess.com/stats/daily/chess/");
  redirect(mem.offset);
}

function start() {
  if (!isCorrectUrl(Config.get("tabUrl"))) {
    gotoUrl();
    Host.outputString(JSON.stringify(false));
    return;
  }
  Host.outputString(JSON.stringify(true));
}

function two() {
  const cookies = JSON.parse(Config.get("cookies"))["x.com"];
  const headers = JSON.parse(Config.get("headers"))["x.com"];
  // console.log("TLSN cookies");
  // console.log(JSON.stringify(cookies));
  // console.log("TLSN headers");
  // console.log(JSON.stringify(headers));

  Host.outputString(
    JSON.stringify({
      url:
        `https://www.chess.com/callback/user/games?locale=en_US&all=1&userId=2457472&gameType=chess`,
      method: "GET",
      headers: {
        Host: "chess.com",
        Connection: "close",
      },
    }),
  );
}

function three() {
  const params = JSON.parse(Host.inputString());
  const { notarize } = Host.getFunctions();

  if (!params) {
    Host.outputString(JSON.stringify(false));
  } else {
    const mem = Memory.fromString(JSON.stringify(params));
    const idOffset = notarize(mem.offset);
    const id = Memory.find(idOffset).readString();
    Host.outputString(JSON.stringify(id));
  }
}

function config() {
  Host.outputString(
    JSON.stringify({
      title: "Chess Game results",
      description: "Notarize a Chess game results",
      icon:
        "data:image/png;base64,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GHRFWHRleGlmOlBpeGVsWURpbWVuc2lvbgAzNjJg7bPfAAAALnRFWHRleGlmOlNvZnR3YXJlAEFkb2JlIFBob3Rvc2hvcCAyMS4yIChNYWNpbnRvc2gp7KPJiwAAABR0RVh0dGlmZjpJbWFnZUxlbmd0aAA3MzILSegBAAAAFHRFWHR0aWZmOkltYWdlV2lkdGgAMTI4MGs14DUAAAASdEVYdHRpZmY6T3JpZW50YXRpb24AMber/DsAAAAwdEVYdHhtcDpDcmVhdG9yVG9vbABBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKa1d3PwAAABMdEVYdHhtcE1NOkRlcml2ZWRGcm9tAGFkb2JlOmRvY2lkOnBob3Rvc2hvcDozODllNzc4Mi0yNDFhLWI2NDYtOWU2ZC03MTZhNTJjMTgxMzh8PH40AAAAOXRFWHR4bXBNTTpEb2N1bWVudElEAHhtcC5kaWQ6NDlGMjNCRkExMzJEMTFFQkFDRTY5MUYzQ0Y4QzhEQUZe7I9yAAAAOXRFWHR4bXBNTTpJbnN0YW5jZUlEAHhtcC5paWQ6NDlGMjNCRjkxMzJEMTFFQkFDRTY5MUYzQ0Y4QzhEQUac4S47AAAARXRFWHR4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQAeG1wLmRpZDpkOWM5OWQyZS0zMTM4LTQxNjAtYjllMC1mYThlMzI4ZTY3MzLrZD4KAAAAAElFTkSuQmCC",
      steps: [
        {
          title: "Visit Chess Games",
          description: "Log in to your account if you haven't already",
          cta: "Go to chess.com",
          action: "start",
        },
        {
          title: "Select game want to notarize",
          description:
            "Pick a chess game (to meet current size limits)",
          cta: "Check",
          action: "two",
        },
        {
          title: "Notarize conversation",
          cta: "Notarize",
          action: "three",
          prover: true,
        },
      ],
      hostFunctions: ["redirect", "notarize"],
      cookies: ["chess.com"],
      headers: ["chess.com"],
      requests: [
        {
          url: `https://www.chess.com/callback/user/games?locale=en_US&all=1&userId=*&gameType=chess`,
          method: "GET",
        },
      ],
    }),
  );
}

module.exports = { start, config, two, three };