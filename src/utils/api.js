/**
 * Fetches emojis from GitHub API and returns a randomly selected subset.
 * @param {number} count Total unique emojis to return.
 * @returns {Promise<string[]>} Array of image URLs.
 */
export const fetchEmojis = async (count = 8) => {
  try {
    const response = await fetch('https://api.github.com/emojis');
    if (!response.ok) throw new Error('Failed to fetch emojis');
    
    const emojisMap = await response.json();
    const emojiUrls = Object.values(emojisMap);
    
    // Fisher-Yates shuffle
    const shuffled = [...emojiUrls];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Error fetching emojis:', error);
    // Fallback static emojis if API fails
    return [
      'https://github.githubassets.com/images/icons/emoji/unicode/1f600.png',
      'https://github.githubassets.com/images/icons/emoji/unicode/1f601.png',
      'https://github.githubassets.com/images/icons/emoji/unicode/1f602.png',
      'https://github.githubassets.com/images/icons/emoji/unicode/1f603.png',
      'https://github.githubassets.com/images/icons/emoji/unicode/1f604.png',
      'https://github.githubassets.com/images/icons/emoji/unicode/1f605.png',
      'https://github.githubassets.com/images/icons/emoji/unicode/1f606.png',
      'https://github.githubassets.com/images/icons/emoji/unicode/1f607.png',
    ].slice(0, count);
  }
};
