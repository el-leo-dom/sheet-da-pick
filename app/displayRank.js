export const displayRank = (lp) => {
    if (lp >= 0 && lp < 100) {
      return "Iron IV";
    } else if (lp >= 100 && lp < 200) {
      return "Iron III";
    } else if (lp >= 200 && lp < 300) {
      return "Iron II";
    } else if (lp >= 300 && lp < 400) {
      return "Iron I";
    } else if (lp >= 400 && lp < 500) {
      return "Bronze IV";
    } else if (lp >= 500 && lp < 600) {
      return "Bronze III";
    } else if (lp >= 600 && lp < 700) {
      return "Bronze II";
    } else if (lp >= 700 && lp < 800) {
      return "Bronze I";
    } else if (lp >= 800 && lp < 900) {
      return "Silver IV";
    } else if (lp >= 900 && lp < 1000) {
      return "Silver III";
    } else if (lp >= 1000 && lp < 1100) {
      return "Silver II";
    } else if (lp >= 1100 && lp < 1200) {
      return "Silver I";
    } else if (lp >= 1200 && lp < 1300) {
      return "Gold IV";
    } else if (lp >= 1300 && lp < 1400) {
      return "Gold III";
    } else if (lp >= 1400 && lp < 1500) {
      return "Gold II";
    } else if (lp >= 1500 && lp < 1600) {
      return "Gold I";
    } else if (lp >= 1600 && lp < 1700) {
      return "Platinum IV";
    } else if (lp >= 1700 && lp < 1800) {
      return "Platinum III";
    } else if (lp >= 1800 && lp < 1900) {
      return "Platinum II";
    } else if (lp >= 1900 && lp < 2000) {
      return "Platinum I";
    } else if (lp >= 2000 && lp < 2100) {
      return "Emerald IV";
    } else if (lp >= 2100 && lp < 2200) {
      return "Emerald III";
    } else if (lp >= 2200 && lp < 2300) {
      return "Emerald II";
    } else if (lp >= 2300 && lp < 2400) {
      return "Emerald I";
    } else if (lp >= 2400 && lp < 2500) {
      return "Diamond IV";
    } else if (lp >= 2500 && lp < 2600) {
      return "Diamond III";
    } else if (lp >= 2600 && lp < 2700) {
      return "Diamond II";
    } else if (lp >= 2700) {
      return "Diamond I";
    } else {
      return "Unranked";
    }
  };
  