import axios from 'axios';

const getApiKey = () => process.env.YOUTUBE_API_KEY;

/**
 * Gets video metadata using YouTube Data API v3.
 * @param {string} videoId 
 * @returns {Promise<Object|null>}
 */
export async function getVideoMetadata(videoId) {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'your_api_key_here') return null;

  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: 'snippet,contentDetails',
        id: videoId,
        key: apiKey
      }
    });

    if (response.data.items && response.data.items.length > 0) {
      const item = response.data.items[0];
      return {
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnails: item.snippet.thumbnails,
        duration: item.contentDetails.duration
      };
    }
    return null;
  } catch (error) {
    console.error('YouTube V3 API Metadata Error:', error.response?.data || error.message);
    return null;
  }
}

/**
 * Note: Fetching actual caption content via V3 API requires OAuth2 
 * for non-owned videos. We primarily use this for metadata enrichment
 * when the "Official API" toggle is ON.
 */
export async function fetchCaptionsV3(videoId) {
  // This is a placeholder for V3 caption logic if needed later
  // For now, it returns null to trigger the fallback or metadata enrichment
  return null;
}
