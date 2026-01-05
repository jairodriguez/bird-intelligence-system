#!/usr/bin/env node

/**
 * Bird Competitive Intelligence Gatherer
 *
 * Tracks competitor and influencer activity in your niche
 * Generates daily intelligence reports for content strategy
 *
 * Usage:
 *   node scripts/social/bird-competitive-intel.js ai.withjai
 *   node scripts/social/bird-competitive-intel.js ai.withjai --output report
 *   node scripts/social/bird-competitive-intel.js ai.withjai --competitors only
 */

const BirdUtils = require('./bird-utils');
const fs = require('fs');
const path = require('path');

class CompetitiveIntelligence {
  constructor(brand = 'ai.withjai') {
    this.brand = brand;
    this.config = BirdUtils.getBrandConfig(brand);
    this.timestamp = new Date().toISOString();
    this.report = {
      brand: brand,
      timestamp: this.timestamp,
      competitors: [],
      influencers: [],
      trends: [],
      insights: [],
      recommendations: []
    };
  }

  /**
   * Run full competitive intelligence gathering
   */
  async run(options = {}) {
    const { competitorsOnly = false, influencersOnly = false } = options;

    console.log(`\n🔍 Gathering competitive intelligence for ${this.brand}...`);
    console.log(`   Timestamp: ${this.timestamp}\n`);

    try {
      // Gather competitor data
      if (!influencersOnly) {
        console.log('📊 Analyzing competitors...');
        await this.analyzeCompetitors();
      }

      // Gather influencer data
      if (!competitorsOnly) {
        console.log('⭐ Analyzing influencers...');
        await this.analyzeInfluencers();
      }

      // Identify trends
      console.log('📈 Identifying trends...');
      await this.identifyTrends();

      // Generate insights
      console.log('💡 Generating insights...');
      this.generateInsights();

      // Generate recommendations
      console.log('🎯 Creating recommendations...');
      this.generateRecommendations();

      // Save report
      await this.saveReport();

      return this.report;
    } catch (error) {
      console.error(`❌ Error gathering intelligence: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze competitor activity
   */
  async analyzeCompetitors() {
    const competitors = this.config.competitors || [];

    for (const competitor of competitors) {
      try {
        // Search for competitor's recent tweets
        const query = `from:${competitor}`;
        const tweets = await BirdUtils.search(query, { limit: 5 });

        if (tweets.length > 0) {
          const analysis = {
            handle: competitor,
            tweetsAnalyzed: tweets.length,
            topTweets: tweets.map(t => ({
              text: t.text || t.full_text,
              engagement: {
                likes: t.public_metrics?.like_count || 0,
                retweets: t.public_metrics?.retweet_count || 0,
                replies: t.public_metrics?.reply_count || 0
              },
              createdAt: t.created_at
            })),
            averageEngagement: this.calculateAverageEngagement(tweets),
            contentThemes: this.extractThemes(tweets)
          };

          this.report.competitors.push(analysis);
          console.log(`   ✅ @${competitor}: ${tweets.length} tweets analyzed`);
        }
      } catch (error) {
        console.warn(`   ⚠️  Failed to analyze @${competitor}: ${error.message}`);
      }
    }
  }

  /**
   * Analyze influencer activity
   */
  async analyzeInfluencers() {
    const influencers = this.config.influencers || [];

    for (const influencer of influencers) {
      try {
        // Search for influencer's recent tweets
        const query = `from:${influencer}`;
        const tweets = await BirdUtils.search(query, { limit: 5 });

        if (tweets.length > 0) {
          const analysis = {
            handle: influencer,
            tweetsAnalyzed: tweets.length,
            topTweets: tweets.map(t => ({
              text: t.text || t.full_text,
              engagement: {
                likes: t.public_metrics?.like_count || 0,
                retweets: t.public_metrics?.retweet_count || 0,
                replies: t.public_metrics?.reply_count || 0
              },
              createdAt: t.created_at
            })),
            averageEngagement: this.calculateAverageEngagement(tweets),
            contentThemes: this.extractThemes(tweets),
            collaborationPotential: this.assessCollaborationPotential(tweets)
          };

          this.report.influencers.push(analysis);
          console.log(`   ✅ @${influencer}: ${tweets.length} tweets analyzed`);
        }
      } catch (error) {
        console.warn(`   ⚠️  Failed to analyze @${influencer}: ${error.message}`);
      }
    }
  }

  /**
   * Identify trending topics in niche
   */
  async identifyTrends() {
    const keywords = this.config.keywords || [];

    for (const keyword of keywords.slice(0, 3)) {
      // Limit to 3 searches to avoid rate limiting
      try {
        const tweets = await BirdUtils.search(keyword, { limit: 5 });

        if (tweets.length > 0) {
          const trend = {
            keyword: keyword,
            tweetsFound: tweets.length,
            topTweets: tweets.map(t => ({
              text: t.text || t.full_text,
              author: t.author_handle || t.user?.screen_name,
              engagement: {
                likes: t.public_metrics?.like_count || 0,
                retweets: t.public_metrics?.retweet_count || 0,
                replies: t.public_metrics?.reply_count || 0
              },
              createdAt: t.created_at
            })),
            trendStrength: this.calculateTrendStrength(tweets),
            contentGaps: this.identifyContentGaps(tweets)
          };

          this.report.trends.push(trend);
          console.log(`   ✅ Trend "${keyword}": ${tweets.length} tweets found`);
        }
      } catch (error) {
        console.warn(`   ⚠️  Failed to analyze trend "${keyword}": ${error.message}`);
      }
    }
  }

  /**
   * Calculate average engagement for tweets
   */
  calculateAverageEngagement(tweets) {
    if (tweets.length === 0) return { likes: 0, retweets: 0, replies: 0 };

    const totals = tweets.reduce((acc, t) => ({
      likes: acc.likes + (t.public_metrics?.like_count || 0),
      retweets: acc.retweets + (t.public_metrics?.retweet_count || 0),
      replies: acc.replies + (t.public_metrics?.reply_count || 0)
    }), { likes: 0, retweets: 0, replies: 0 });

    return {
      likes: Math.round(totals.likes / tweets.length),
      retweets: Math.round(totals.retweets / tweets.length),
      replies: Math.round(totals.replies / tweets.length)
    };
  }

  /**
   * Extract themes from tweets
   */
  extractThemes(tweets) {
    const themes = {};
    const keywords = this.config.keywords || [];

    tweets.forEach(tweet => {
      const text = (tweet.text || tweet.full_text).toLowerCase();
      keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          themes[keyword] = (themes[keyword] || 0) + 1;
        }
      });
    });

    return Object.entries(themes)
      .map(([theme, count]) => ({ theme, frequency: count }))
      .sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Assess collaboration potential for influencer
   */
  assessCollaborationPotential(tweets) {
    const avgEngagement = this.calculateAverageEngagement(tweets);
    const score = Math.min(100, Math.round(
      (avgEngagement.likes * 0.3 +
       avgEngagement.retweets * 0.4 +
       avgEngagement.replies * 0.3) / 10
    ));

    return {
      score: score,
      level: score > 70 ? 'high' : score > 40 ? 'medium' : 'low',
      reasoning: score > 70
        ? 'Strong engagement - excellent collaboration target'
        : score > 40
          ? 'Moderate engagement - consider for partnerships'
          : 'Lower engagement - monitor before outreach'
    };
  }

  /**
   * Calculate trend strength
   */
  calculateTrendStrength(tweets) {
    const avgEngagement = this.calculateAverageEngagement(tweets);
    const strength = (avgEngagement.likes + avgEngagement.retweets) / 2;

    return {
      score: Math.round(strength),
      level: strength > 100 ? 'strong' : strength > 50 ? 'moderate' : 'weak'
    };
  }

  /**
   * Identify content gaps
   */
  identifyContentGaps(tweets) {
    // Look for angles that aren't covered
    const angles = [
      { keyword: 'how to', weight: 'tactical' },
      { keyword: 'why', weight: 'educational' },
      { keyword: 'case study', weight: 'proof' },
      { keyword: 'mistake', weight: 'contrarian' },
      { keyword: 'framework', weight: 'systematic' }
    ];

    const found = {};
    const text = tweets.map(t => (t.text || t.full_text).toLowerCase()).join(' ');

    angles.forEach(angle => {
      if (!text.includes(angle.keyword)) {
        found[angle.weight] = true;
      }
    });

    return Object.keys(found);
  }

  /**
   * Generate strategic insights
   */
  generateInsights() {
    // Insight 1: Competitor positioning
    if (this.report.competitors.length > 0) {
      const competitorThemes = this.report.competitors
        .flatMap(c => c.contentThemes)
        .reduce((acc, t) => {
          acc[t.theme] = (acc[t.theme] || 0) + t.frequency;
          return acc;
        }, {});

      const topTheme = Object.entries(competitorThemes)
        .sort((a, b) => b[1] - a[1])[0];

      this.report.insights.push({
        type: 'competitor-positioning',
        description: `Competitors heavily focus on "${topTheme?.[0] || 'unknown'}" (${topTheme?.[1] || 0} mentions)`,
        actionable: 'Consider differentiating with other angles like frameworks, case studies, or contrarian takes'
      });
    }

    // Insight 2: Influencer collaboration potential
    if (this.report.influencers.length > 0) {
      const highPotential = this.report.influencers.filter(i =>
        i.collaborationPotential.score > 70
      );

      if (highPotential.length > 0) {
        this.report.insights.push({
          type: 'collaboration-opportunity',
          description: `${highPotential.length} influencer(s) with high collaboration potential`,
          targets: highPotential.map(i => `@${i.handle}`),
          actionable: 'Prioritize outreach to high-potential influencers'
        });
      }
    }

    // Insight 3: Trend opportunities
    if (this.report.trends.length > 0) {
      const strongTrends = this.report.trends.filter(t =>
        t.trendStrength.level === 'strong'
      );

      if (strongTrends.length > 0) {
        this.report.insights.push({
          type: 'trend-opportunity',
          description: `${strongTrends.length} strong trend(s) in niche`,
          trends: strongTrends.map(t => `"${t.keyword}" (strength: ${t.trendStrength.score})`),
          actionable: 'Create content around strong trends for higher engagement'
        });
      }
    }
  }

  /**
   * Generate content recommendations
   */
  generateRecommendations() {
    // Recommendation 1: Content types to create
    const gaps = this.report.trends.flatMap(t => t.contentGaps);
    const gapCounts = gaps.reduce((acc, g) => {
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});

    Object.entries(gapCounts).forEach(([gap, count]) => {
      if (count > 0) {
        this.report.recommendations.push({
          type: 'content-opportunity',
          content: gap,
          priority: count > 1 ? 'high' : 'medium',
          reasoning: `Missing "${gap}" angle across ${count} trends`
        });
      }
    });

    // Recommendation 2: Engagement optimization
    const avgEngagement = this.calculateAverageEngagement(
      this.report.competitors.flatMap(c => c.topTweets) || []
    );

    if (avgEngagement.replies > avgEngagement.likes) {
      this.report.recommendations.push({
        type: 'engagement-strategy',
        strategy: 'question-driven',
        priority: 'high',
        reasoning: 'High reply rate suggests question-based content works well'
      });
    }

    // Recommendation 3: Posting cadence
    this.report.recommendations.push({
      type: 'posting-strategy',
      frequency: 'daily',
      priority: 'high',
      reasoning: 'Competitors maintain daily posting for niche relevance'
    });
  }

  /**
   * Save intelligence report
   */
  async saveReport() {
    const date = new Date().toISOString().split('T')[0];
    const filename = `competitor-intel-${date}.json`;

    // Add summary to report
    this.report.summary = {
      competitorsTracked: this.report.competitors.length,
      influencersTracked: this.report.influencers.length,
      trendsIdentified: this.report.trends.length,
      insightsGenerated: this.report.insights.length,
      recommendationsProvided: this.report.recommendations.length
    };

    await BirdUtils.saveResults(filename, this.report, this.brand);

    console.log(`\n✅ Intelligence report saved`);
    console.log(`   Summary:`);
    console.log(`   - Competitors tracked: ${this.report.summary.competitorsTracked}`);
    console.log(`   - Influencers tracked: ${this.report.summary.influencersTracked}`);
    console.log(`   - Trends identified: ${this.report.summary.trendsIdentified}`);
    console.log(`   - Insights generated: ${this.report.summary.insightsGenerated}`);
    console.log(`   - Recommendations: ${this.report.summary.recommendationsProvided}`);
  }
}

// CLI Interface
async function main() {
  const brand = process.argv[2] || 'ai.withjai';
  const outputMode = process.argv.find(arg => arg.startsWith('--output='))?.split('=')[1];
  const filter = process.argv.find(arg => arg.startsWith('--'))?.split('=')[0]?.substring(2);

  try {
    const intel = new CompetitiveIntelligence(brand);

    const options = {
      competitorsOnly: filter === 'competitors',
      influencersOnly: filter === 'influencers'
    };

    const report = await intel.run(options);

    if (outputMode === 'console') {
      console.log('\n📊 Full Intelligence Report:\n');
      console.log(JSON.stringify(report, null, 2));
    } else if (outputMode === 'summary') {
      console.log('\n📊 Intelligence Summary:\n');
      console.log(`Competitors: ${report.summary.competitorsTracked}`);
      console.log(`Influencers: ${report.summary.influencersTracked}`);
      console.log(`Trends: ${report.summary.trendsIdentified}`);
      console.log(`\nTop Insights:`);
      report.insights.slice(0, 3).forEach((insight, i) => {
        console.log(`${i + 1}. [${insight.type}] ${insight.description}`);
      });
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = CompetitiveIntelligence;
