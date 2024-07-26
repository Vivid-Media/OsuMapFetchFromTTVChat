import tmi from "tmi.js";
import open from "open";


const opts = {
  identity: {
    username: "channelName,
    password: "TwitchOAuthClient",
  },
  channels: ["nameOfCHannel"],
};

const client = new tmi.client(opts);


client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch
client.connect();

// Called every time a message comes in
function onMessageHandler(channel, tags, message, self) {
    if (self) return; 
  
    
    const urlPattern = 'https://osu.ppy.sh/beatmapsets/';
    if (message.includes(urlPattern)) {
      console.log(`[${tags['display-name']}] ${message}`);
  
      
      const urlStart = message.indexOf(urlPattern);
      const urlEnd = message.indexOf(' ', urlStart);
      const baseUrl = urlEnd === -1 ? message.slice(urlStart) : message.slice(urlStart, urlEnd);
      
      
      const setIdMatch = baseUrl.match(/beatmapsets\/(\d+)/);
      if (setIdMatch) {
        const setId = setIdMatch[1];
        const downloadUrl = `https://osu.ppy.sh/beatmapsets/${setId}/download`;
        
        // Open the URL
        import('open').then(module => {
          const open = module.default;
          open(downloadUrl)
            .then(() => {
              console.log(`Opened URL: ${downloadUrl}`);
              client.say(channel, 'Thanks for the map mate! I really appriciate that!');
            })
            .catch(err => console.error(`Error opening URL: ${err}`));
        }).catch(err => console.error(`Error loading 'open' module: ${err}`));
      } else {
        console.log('No valid beatmap set ID found in message.');
      }
    }
  }

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
