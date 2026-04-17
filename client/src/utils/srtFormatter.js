/**
 * Converts milliseconds to SRT timestamp format (HH:MM:SS,mmm)
 * @param {number} ms 
 * @returns {string}
 */
const formatTimeSRT = (ms) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':') + ',' + milliseconds.toString().padStart(3, '0');
};

/**
 * Converts segments to SRT string
 * @param {Array} segments 
 * @returns {string}
 */
export const segmentsToSrt = (segments) => {
  return segments.map((s, i) => {
    return `${i + 1}\n${formatTimeSRT(s.start)} --> ${formatTimeSRT(s.end)}\n${s.text}\n`;
  }).join('\n');
};
