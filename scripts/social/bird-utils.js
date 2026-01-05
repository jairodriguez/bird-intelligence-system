#!/usr/bin/env node

/**
 * Bird CLI Utilities
 * Shared utilities for bird CLI integration including auth, execution, and parsing
 */

const { execFile } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execFileAsync = promisify(execFile);

class BirdUtils {
  constructor(brand = 'ai.withjai') {
    this.brand = brand;
    this.retryAttempts = 3;
    this.retryDelay = 1000; // ms
  }

  /**
   * Check if bird CLI is installed and accessible
   */
  static checkBirdInstalled() {
    try {
      execFile('bird', ['--version'], { stdio: 'pipe' }, (error) => {
        return !error;
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify authentication is set up
   */
  static async verifyAuth() {
    try {
      const result = await execFileAsync('bird', ['whoami']);
      return {
        authenticated: true,
        username: result.stdout.trim()
      };
    } catch (error) {
      return {
        authenticated: false,
        error: error.message
      };
    }
  }

  /**
   * Execute bird CLI command with retry logic
   * Chrome profile is configured in ~/.config/bird/config.json5
   * @param {string} command - Bird CLI command (without 'bird' prefix)
   * @param {Array} args - Command arguments
   * @param {Object} options - Execution options
   * @returns {Promise<string>} Command output
   */
  static async executeCommand(command, args = [], options = {}) {
    const { retries = 3, delay = 1000, format = 'json' } = options;

    // Add --json flag if requesting JSON format
    const jsonArgs = format === 'json' && !args.includes('--json')
      ? ['--json']
      : [];

    // Build arguments: [command, ...args, --json]
    const finalArgs = [command, ...args, ...jsonArgs];

    let lastError;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        // Use local patched bird wrapper with GraphQL fix
        const birdPath = path.join(__dirname, 'bird');
        const result = await execFileAsync(birdPath, finalArgs);
        return result.stdout;
      } catch (error) {
        lastError = error;

        // Don't retry on auth errors
        if (error.message.includes('auth') || error.message.includes('cookie')) {
          throw new Error(`Authentication error: ${error.message}`);
        }

        // Wait before retrying
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error(`Command failed after ${retries} retries: ${command} ${finalArgs.join(' ')}`);
  }

  /**
   * Parse bird JSON output
   * @param {string} jsonString - JSON output from bird
   * @returns {Object} Parsed JSON
   */
  static parseJSON(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error(`Failed to parse bird JSON output: ${error.message}`);
    }
  }

  /**
   * Search for tweets
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Search results
   */
  static async search(query, options = {}) {
    const { limit = 10 } = options;

    try {
      const result = await this.executeCommand('search', ['-n', String(limit), query], { format: 'json' });
      const parsed = this.parseJSON(result);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error(`Search failed for query "${query}": ${error.message}`);
      return [];
    }
  }

  /**
   * Get mentions
   * @param {Object} options - Mention options
   * @returns {Promise<Array>} Mentions
   */
  static async getMentions(options = {}) {
    const { limit = 10 } = options;

    try {
      const result = await this.executeCommand('mentions', ['-n', String(limit)], { format: 'json' });
      const parsed = this.parseJSON(result);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error(`Failed to get mentions: ${error.message}`);
      return [];
    }
  }

  /**
   * Get bookmarks
   * @param {Object} options - Bookmark options
   * @returns {Promise<Array>} Bookmarks
   */
  static async getBookmarks(options = {}) {
    const { limit = 10 } = options;

    try {
      const result = await this.executeCommand('bookmarks', ['-n', String(limit)], { format: 'json' });
      const parsed = this.parseJSON(result);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error(`Failed to get bookmarks: ${error.message}`);
      return [];
    }
  }

  /**
   * Read a tweet
   * @param {string} tweetId - Tweet ID or URL
   * @returns {Promise<Object>} Tweet data
   */
  static async readTweet(tweetId) {
    try {
      const result = await this.executeCommand('read', [tweetId], { format: 'json' });
      return this.parseJSON(result);
    } catch (error) {
      console.error(`Failed to read tweet ${tweetId}: ${error.message}`);
      return null;
    }
  }

  /**
   * Get replies to a tweet
   * @param {string} tweetId - Tweet ID
   * @returns {Promise<Array>} Replies
   */
  static async getReplies(tweetId, options = {}) {
    const { limit = 10 } = options;

    try {
      const result = await this.executeCommand('replies', ['-n', String(limit), tweetId], { format: 'json' });
      const parsed = this.parseJSON(result);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error(`Failed to get replies for ${tweetId}: ${error.message}`);
      return [];
    }
  }

  /**
   * Get thread
   * @param {string} tweetId - Tweet ID
   * @returns {Promise<Array>} Thread tweets
   */
  static async getThread(tweetId, options = {}) {
    try {
      const result = await this.executeCommand('thread', [tweetId], { format: 'json' });
      const parsed = this.parseJSON(result);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error(`Failed to get thread for ${tweetId}: ${error.message}`);
      return [];
    }
  }

  /**
   * Format tweet for storage
   * @param {Object} tweet - Raw tweet data
   * @returns {Object} Formatted tweet
   */
  static formatTweet(tweet) {
    return {
      id: tweet.id || tweet.id_str,
      text: tweet.text || tweet.full_text,
      author: tweet.author_id || tweet.user?.id,
      authorName: tweet.author_name || tweet.user?.name,
      authorHandle: tweet.author_handle || tweet.user?.screen_name,
      createdAt: tweet.created_at,
      engagement: {
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        replies: tweet.public_metrics?.reply_count || 0,
        quotes: tweet.public_metrics?.quote_count || 0
      },
      url: `https://twitter.com/${tweet.author_handle}/status/${tweet.id}`
    };
  }

  /**
   * Save results to JSON file
   * @param {string} filename - Output filename
   * @param {Object|Array} data - Data to save
   * @param {string} brand - Brand name
   */
  static async saveResults(filename, data, brand = 'ai.withjai') {
    const dir = `brands/${brand}/content/06-analytics/twitter-insights`;

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`✅ Saved to: ${filepath}`);

    return filepath;
  }

  /**
   * Load bird config
   * @returns {Object} Configuration
   */
  static loadConfig() {
    const configPath = path.join(__dirname, 'bird-config.json');

    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }

    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  /**
   * Get brand configuration
   * @param {string} brand - Brand name
   * @returns {Object} Brand config
   */
  static getBrandConfig(brand) {
    const config = this.loadConfig();

    if (!config[brand]) {
      throw new Error(`Brand not found in config: ${brand}`);
    }

    return config[brand];
  }
}

// Export for use as module
module.exports = BirdUtils;

// CLI Interface for direct usage
if (require.main === module) {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  (async () => {
    try {
      // Check if bird is installed
      if (!BirdUtils.checkBirdInstalled()) {
        console.error('❌ bird CLI not found. Please install bird first.');
        process.exit(1);
      }

      // Check authentication
      const auth = await BirdUtils.verifyAuth();
      if (!auth.authenticated) {
        console.error('❌ Bird authentication failed:', auth.error);
        process.exit(1);
      }

      console.log(`✅ Authenticated as: @${auth.username}`);

      switch (command) {
        case 'search': {
          const query = args.join(' ');
          const results = await BirdUtils.search(query, { limit: 10 });
          console.log(`\n📌 Search results for "${query}":\n`);
          results.forEach((tweet, i) => {
            const formatted = BirdUtils.formatTweet(tweet);
            console.log(`${i + 1}. @${formatted.authorHandle}: ${formatted.text.substring(0, 80)}...`);
            console.log(`   ❤️ ${formatted.engagement.likes} | 🔄 ${formatted.engagement.retweets} | 💬 ${formatted.engagement.replies}`);
          });
          break;
        }

        case 'mentions': {
          const mentions = await BirdUtils.getMentions({ limit: 10 });
          console.log(`\n💬 Your mentions:\n`);
          mentions.forEach((mention, i) => {
            const formatted = BirdUtils.formatTweet(mention);
            console.log(`${i + 1}. @${formatted.authorHandle}: ${formatted.text.substring(0, 80)}...`);
          });
          break;
        }

        case 'bookmarks': {
          const bookmarks = await BirdUtils.getBookmarks({ limit: 10 });
          console.log(`\n🔖 Your bookmarks:\n`);
          bookmarks.forEach((bookmark, i) => {
            const formatted = BirdUtils.formatTweet(bookmark);
            console.log(`${i + 1}. @${formatted.authorHandle}: ${formatted.text.substring(0, 80)}...`);
          });
          break;
        }

        case 'check': {
          console.log('\n✅ Bird CLI is installed and configured');
          console.log(`   Authenticated as: @${auth.username}`);
          break;
        }

        default:
          console.log(`
Bird Utilities CLI

Commands:
  check                    Verify bird CLI setup and authentication
  search <query>           Search for tweets
  mentions                 Get your mentions
  bookmarks                Get your bookmarks
  read <tweet-id>          Read a specific tweet
  replies <tweet-id>       Get replies to a tweet

Examples:
  node bird-utils.js check
  node bird-utils.js search "AI automation"
  node bird-utils.js mentions
  node bird-utils.js read 123456789
  node bird-utils.js replies 123456789
          `);
      }
    } catch (error) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  })();
}
