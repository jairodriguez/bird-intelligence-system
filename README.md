# 🐦 Bird Intelligence System

Automate your Twitter competitive research in 30 seconds with Claude Code. Zero cost, maximum insights.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![Built with Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-5B4FFF)](https://claude.com/claude-code)

## What This Does

AI-powered competitive intelligence that automatically analyzes competitors, influencers, and trending topics on Twitter/X:

- ✅ **Competitor Analysis** - Track 5+ competitors' content and engagement
- ✅ **Influencer Monitoring** - Identify collaboration opportunities
- ✅ **Trend Detection** - Catch viral topics before they peak
- ✅ **Content Gap Analysis** - Find opportunities competitors are missing
- ✅ **Strategic Recommendations** - Get actionable insights, not just data

**Total Time**: 30 seconds | **Total Cost**: $0 per run | **Output**: Structured JSON intelligence

---

## 🚀 Quick Start with Claude Code (Recommended)

**The easiest way** - Let Claude Code set everything up for you:

1. **Install Claude Code**: [Get it here](https://claude.com/claude-code)

2. **Clone this repo** (or let Claude Code do it):
   ```bash
   git clone https://github.com/jairodriguez/bird-intelligence-system.git
   cd bird-intelligence-system
   ```

3. **Ask Claude Code to set it up**:
   ```
   Set up the bird intelligence system for my brand.
   My competitors are: [list 3-5 Twitter handles]
   My influencers to track: [list 3-5 Twitter handles]
   My keywords: [list 3-5 topics]
   ```

**That's it.** Claude Code will:
- ✅ Install Bird CLI via Homebrew
- ✅ Configure authentication
- ✅ Set up your brand config
- ✅ Create necessary directories
- ✅ Run your first intelligence report
- ✅ Explain the results

**Then ask for daily reports**:
```
Run my daily competitive intelligence report
```

**Or analyze specific insights**:
```
What content gaps should I focus on this week?
Which influencer has the highest collaboration potential?
Show me trending topics in my niche
```

---

## Manual Setup (If You Don't Use Claude Code)

<details>
<summary>Click to expand manual installation steps</summary>

### Prerequisites
- Mac or Linux (Windows requires WSL)
- Node.js 18+ ([install](https://nodejs.org))
- Google Chrome with active Twitter login

### Step 1: Install Bird CLI
```bash
brew tap steipete/tap && brew install bird
```

### Step 2: Configure Authentication
```bash
mkdir -p ~/.config/bird
cat > ~/.config/bird/config.json5 << 'EOF'
{
  chromeProfile: "Default",
  cookieTimeoutMs: 5000,
  timeoutMs: 30000,
  quoteDepth: 1
}
EOF
```

### Step 3: Configure Your Brand
```bash
cp scripts/social/bird-config.example.json scripts/social/bird-config.json
# Edit bird-config.json with your competitors/influencers
```

### Step 4: Create Output Directory
```bash
mkdir -p brands/your-brand/content/06-analytics/twitter-insights
```

### Step 5: Run First Report
```bash
node scripts/social/bird-competitive-intel.js your-brand
```

</details>

---

## Example Intelligence Report

```json
{
  "competitors": [
    {
      "handle": "competitor",
      "tweetsAnalyzed": 5,
      "contentThemes": ["AI automation", "Claude Code"],
      "averageEngagement": { "likes": 150, "retweets": 25 }
    }
  ],
  "trends": [
    {
      "keyword": "AI automation",
      "trendStrength": "strong",
      "contentGaps": ["tactical", "proof", "contrarian"]
    }
  ],
  "insights": [
    {
      "type": "competitor-positioning",
      "description": "Competitors heavily focus on 'Claude Code'",
      "actionable": "Differentiate with case studies and proof"
    }
  ],
  "recommendations": [
    {
      "type": "content-opportunity",
      "content": "tactical how-to guides",
      "priority": "high",
      "reasoning": "Missing across 3 trending topics"
    }
  ]
}
```

---

## Claude Code Workflows

### Daily Intelligence Routine
```
Hey Claude Code, run my daily intelligence report and summarize the key insights
```

**Claude Code will**:
1. Execute the intelligence gathering
2. Analyze the JSON report
3. Highlight top opportunities
4. Suggest content ideas based on gaps

### Content Planning
```
Based on today's intelligence report, what should I create this week?
```

**Claude Code will**:
1. Review content gaps
2. Check trending topics
3. Analyze competitor themes
4. Suggest 3-5 content ideas with reasoning

### Influencer Outreach
```
Which influencers should I reach out to based on the latest report?
```

**Claude Code will**:
1. Sort influencers by collaboration potential
2. Show engagement patterns
3. Suggest outreach timing
4. Draft personalized messages

### Competitive Analysis
```
Compare my content themes to my top 3 competitors
```

**Claude Code will**:
1. Extract your content themes
2. Compare to competitor themes
3. Identify differentiation opportunities
4. Suggest positioning strategies

---

## Why Claude Code Integration Matters

**Traditional competitive intelligence tools**:
- ❌ Manual data collection
- ❌ Generic reports you have to interpret
- ❌ No action items
- ❌ Expensive ($99-$499/month)

**Bird Intelligence + Claude Code**:
- ✅ Automated data collection
- ✅ AI-interpreted insights
- ✅ Actionable recommendations
- ✅ Free (just your time)

**The magic**: Claude Code doesn't just run the script - it **understands** your business and **interprets** the intelligence for your specific needs.

---

## Cost Breakdown

| Component | Traditional Tool | Bird + Claude Code |
|-----------|-----------------|-------------------|
| Data Collection | $99-$299/mo | $0 |
| Analysis | Manual (2 hrs) | Claude Code (30 sec) |
| Insights | Generic | Personalized |
| Action Items | DIY | AI-generated |
| **Total** | **$99-$299/mo + 2 hrs** | **$0 + 30 sec** |

**ROI**: Infinite (time saved vs $0 cost)

---

## Advanced Claude Code Commands

```
# Trend forecasting
"Based on the last 7 days of reports, which trend is gaining momentum?"

# Competitive positioning
"How should I differentiate from [competitor] based on their recent tweets?"

# Content calendar
"Create a 1-week content calendar addressing the top 3 content gaps"

# Influencer strategy
"Draft 3 collaboration proposals for high-potential influencers"

# Performance tracking
"Compare this week's intelligence to last week - what changed?"
```

---

## Daily Automation

### Option 1: Ask Claude Code
```
Set up daily automated intelligence reports at 6am
```

Claude Code will configure cron or GitHub Actions for you.

### Option 2: Manual Cron (Mac/Linux)
```bash
crontab -e
# Add: 0 6 * * * cd /path/to/bird-intelligence-system && node scripts/social/bird-competitive-intel.js your-brand
```

---

## Troubleshooting with Claude Code

**Don't debug manually** - just ask Claude Code:

```
"Bird CLI is giving a GraphQL error"
"The authentication isn't working"
"I'm not getting any tweets for competitor X"
"How do I change my tracked keywords?"
```

Claude Code will diagnose and fix issues automatically.

---

## Real-World Use Cases

### Newsletter Creator
**Ask Claude Code**:
```
"Based on competitive intelligence, what should my next newsletter be about?"
```

**Result**: Content idea backed by trending topics and content gap analysis

### Indie Developer
**Ask Claude Code**:
```
"Which influencers are talking about my product category this week?"
```

**Result**: Prioritized outreach list with collaboration potential scores

### Content Marketer
**Ask Claude Code**:
```
"My competitor just posted a viral thread. Analyze it and suggest how I should respond."
```

**Result**: Positioning strategy that differentiates while capitalizing on the trend

---

## Configuration

Edit `scripts/social/bird-config.json` (or ask Claude Code to do it):

```json
{
  "your-brand": {
    "enabled": true,
    "keywords": ["AI automation", "Claude Code", "newsletter growth"],
    "competitors": ["competitor1", "competitor2", "competitor3"],
    "influencers": ["influencer1", "influencer2", "influencer3"],
    "monitoring": {
      "mentions": true,
      "search": true,
      "bookmarks": true,
      "frequency": "daily"
    }
  }
}
```

---

## Tech Stack

- **Bird CLI** - Twitter GraphQL access (v0.6.0+)
- **Node.js** - Script execution
- **Chrome** - Browser-based authentication
- **Claude Code** - AI-powered setup and analysis
- Pure JavaScript (zero npm dependencies)

---

## What Makes This Different

**Other tools**: Collect data → You interpret → You act
**This system**: Collect data → Claude Code interprets → Claude Code suggests actions → You execute

**The competitive advantage**: While others spend 2 hours manually researching, you spend 30 seconds asking Claude Code for insights.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/jairodriguez/bird-intelligence-system/issues)
- **Bird CLI Issues**: [steipete/bird](https://github.com/steipete/bird/issues)
- **Claude Code Help**: [docs.claude.com](https://docs.claude.com)
- **Twitter**: [@aiwithjai](https://twitter.com/aiwithjai)

---

## License

MIT License - Free for personal and commercial use.

See [LICENSE](LICENSE) for details.

---

## Credits

- **Bird CLI**: [steipete/bird](https://github.com/steipete/bird) by [@steipete](https://twitter.com/steipete)
- **Intelligence System**: Built by [@aiwithjai](https://twitter.com/aiwithjai)
- **Powered By**: [Claude Code](https://claude.com/claude-code)

---

## Quick Reference

| Metric | Value |
|--------|-------|
| Setup Time | 5 min with Claude Code |
| Per Run | 30 seconds |
| Frequency | Daily recommended |
| Output | JSON intelligence report |
| Dependencies | Bird CLI only |
| Cost | $0 |

---

## Get Started Now

**With Claude Code** (Recommended):
```bash
git clone https://github.com/jairodriguez/bird-intelligence-system.git
cd bird-intelligence-system
```

Then ask Claude Code:
```
"Set up bird intelligence for my brand. Here are my competitors: [list]"
```

**Manual Setup**: See [Manual Setup](#manual-setup-if-you-dont-use-claude-code) above.

---

**Built with Claude Code. Automated with Bird CLI. Powered by AI.**

Welcome to the future of competitive intelligence. 🚀
