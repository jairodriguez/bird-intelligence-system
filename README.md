# 🐦 Bird Intelligence System

Automate your Twitter competitive research in 30 seconds. Zero cost, maximum insights.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

## What This Does

Automatically analyzes competitors, influencers, and trending topics on Twitter/X, then generates actionable intelligence reports with:

- ✅ Competitor tweet analysis
- ✅ Influencer engagement tracking
- ✅ Trending topic identification
- ✅ Content gap analysis
- ✅ Strategic recommendations

**Total Time**: 30 seconds
**Total Cost**: $0 per run
**Output**: Structured JSON intelligence report

---

## Quick Start

```bash
# 1. Install Bird CLI
brew tap steipete/tap && brew install bird

# 2. Clone this repo
git clone https://github.com/jairodriguez/bird-intelligence-system.git
cd bird-intelligence-system

# 3. Configure Bird authentication
mkdir -p ~/.config/bird
cat > ~/.config/bird/config.json5 << 'EOF'
{
  chromeProfile: "Default",
  cookieTimeoutMs: 5000,
  timeoutMs: 30000,
  quoteDepth: 1
}
EOF

# 4. Configure your brand
cp scripts/social/bird-config.example.json scripts/social/bird-config.json
# Edit bird-config.json with your competitors/influencers

# 5. Create output directory
mkdir -p brands/your-brand/content/06-analytics/twitter-insights

# 6. Run first report
node scripts/social/bird-competitive-intel.js your-brand
```

**That's it!** Your intelligence report is saved in `brands/your-brand/content/06-analytics/twitter-insights/`

---

## Prerequisites

- Mac or Linux (Windows requires WSL)
- Node.js 18+ ([install](https://nodejs.org))
- Google Chrome with active Twitter login
- Twitter/X account

---

## Configuration

Edit `scripts/social/bird-config.json`:

```json
{
  "your-brand": {
    "enabled": true,
    "keywords": [
      "AI automation",
      "Claude Code",
      "newsletter growth"
    ],
    "competitors": [
      "competitor1",
      "competitor2",
      "competitor3"
    ],
    "influencers": [
      "influencer1",
      "influencer2",
      "influencer3"
    ],
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

## Example Output

```json
{
  "competitors": [
    {
      "handle": "competitor",
      "tweetsAnalyzed": 5,
      "contentThemes": ["AI automation", "productivity"],
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
  "recommendations": [
    {
      "type": "content-opportunity",
      "content": "tactical how-to guides",
      "priority": "high"
    }
  ]
}
```

---

## Daily Automation

### Option 1: Cron (Mac/Linux)

```bash
# Run at 6am daily
crontab -e

# Add this line:
0 6 * * * cd /path/to/bird-intelligence-system && node scripts/social/bird-competitive-intel.js your-brand
```

### Option 2: GitHub Actions

See `.github/workflows/bird-daily-intel.yml` for automated runs (requires auth setup).

---

## Troubleshooting

### "bird: command not found"
```bash
brew reinstall steipete/tap/bird
echo $PATH  # Should include /opt/homebrew/bin
```

### "GraphQL error 400"
```bash
bird query-ids --fresh
# Then re-run intelligence gathering
```

### "Authentication failed"
- Ensure you're logged into Twitter in Chrome
- Check Chrome profile name in `~/.config/bird/config.json5`
- Try clearing Chrome cache and re-logging into Twitter

### "No tweets found"
- Verify Twitter handles are public
- Test manually: `bird search "test" -n 5`
- Some accounts may have privacy settings blocking automated access

---

## Advanced Usage

### Analyze Single Competitor
```bash
# Focus on one account
bird search "from:username" -n 10 --json
```

### Custom Time Ranges
```bash
# Recent tweets only
bird search "AI automation since:2026-01-01" -n 10 --json
```

### Export to CSV
```bash
# Convert JSON to spreadsheet format
cat report.json | jq -r '.competitors[] | [.handle, .tweetsAnalyzed] | @csv' > competitors.csv
```

---

## What to Do With Intelligence

1. **Content Gaps** → Create content filling identified gaps
2. **Trending Topics** → Write timely posts on trending keywords
3. **Competitor Themes** → Differentiate your messaging
4. **Influencer Collaboration** → Reach out to high-potential accounts
5. **Posting Strategy** → Match or exceed competitor frequency

---

## Cost Breakdown

| Item | Cost |
|------|------|
| Bird CLI | $0 (open source) |
| Node.js | $0 (open source) |
| Twitter API | $0 (browser authentication) |
| Storage | ~27KB per report |
| **Monthly Total** | **$0** |

**Time Saved**: ~2 hours per day on manual research
**ROI**: Infinite

---

## Tech Stack

- **Bird CLI** - Twitter GraphQL access
- **Node.js** - Script execution
- **Chrome** - Authentication
- Pure JavaScript (no dependencies)

---

## Support

- **Issues**: [GitHub Issues](https://github.com/jairodriguez/bird-intelligence-system/issues)
- **Bird CLI Issues**: [steipete/bird](https://github.com/steipete/bird/issues)
- **Twitter**: [@aiwithjai](https://twitter.com/aiwithjai)

---

## License

MIT License - Free for personal and commercial use.

---

## Credits

- **Bird CLI**: [steipete/bird](https://github.com/steipete/bird)
- **Built by**: [@aiwithjai](https://twitter.com/aiwithjai)
- **Powered by**: Claude Code

---

## Quick Reference

**Setup**: 15-20 minutes
**Per Run**: 30 seconds
**Frequency**: Daily recommended
**Output**: JSON intelligence report
**Dependencies**: None (pure Node.js)

---

**Ready to automate your competitive intelligence?**

```bash
git clone https://github.com/jairodriguez/bird-intelligence-system.git
cd bird-intelligence-system
node scripts/social/bird-competitive-intel.js your-brand
```

**That's it.** Welcome to automated intelligence. 🚀
