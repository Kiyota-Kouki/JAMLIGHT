
let host = location.hostname;
let ws = new WebSocket("ws://" + host + ":7777");

const modelURL = 'https://teachablemachine.withgoogle.com/models/ZDzUCrz3x/';
// the json file (model topology) has a reference to the bin file (model weights)
const modelJson = modelURL + "model.json";
// the metatadata json file contains the text labels of your model and additional information
const metadataJson = modelURL + "metadata.json";

const recognizer = speechCommands.create(
  'BROWSER_FFT',
  undefined,
  modelJson,
  metadataJson
);

const prob0 = document.getElementById('prob0');
const prob1 = document.getElementById('prob1');
const prob2 = document.getElementById('prob2');
const prob3 = document.getElementById('prob3');

loadMyModel();

async function loadMyModel() {
  // Make sure that the underlying model and metadata are loaded via HTTPS
  // requests.
  await recognizer.ensureModelLoaded();

  // See the array of words that the recognizer is trained to recognize.
  console.log(recognizer.wordLabels());

  // listen() takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields such a
  //    - includeSpectrogram
  //    - probabilityThreshold
  //    - includeEmbedding

  recognizer.listen(async (result) => {
    showResult(result);
    // - result.scores contains the probability scores that correspond to
    //   recognizer.wordLabels().
    // - result.spectrogram contains the spectrogram of the recognized word.

  }, {
    includeSpectrogram: true,
    probabilityThreshold: 0.75,
    invokeCallbackOnNoiseAndUnknown: true,
    overlapFactor: 0.60 // probably want between 0.5 and 0.75. More info in README
  });

}

function showResult(result) {
  console.log('result: ', result.scores);

  let message = result.scores[0];
  let message_2 = result.scores[2];

  prob0.innerHTML = message;
  prob1.innerHTML = result.scores[1];
  prob2.innerHTML = message_2;
  prob3.innerHTML = result.scores[3];

  ws.send(message);
  ws.send(message_2);
}
