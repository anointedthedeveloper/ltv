#!/usr/bin/env node

/**
 * Script to fetch and curate IPTV channels from IPTV-org repository
 * Generates curated-channels.json with selected high-quality streams
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = __filename.split('/').slice(0, -1).join('/');

// IPTV-org playlist URLs
const PLAYLISTS = {
  kids: 'https://iptv-org.github.io/iptv/categories/kids.m3u',
  news: 'https://iptv-org.github.io/iptv/categories/news.m3u',
  music: 'https://iptv-org.github.io/iptv/categories/music.m3u',
  religious: 'https://iptv-org.github.io/iptv/categories/religious.m3u',
  sports: 'https://iptv-org.github.io/iptv/categories/sports.m3u',
  entertainment: 'https://iptv-org.github.io/iptv/categories/entertainment.m3u',
  movies: 'https://iptv-org.github.io/iptv/categories/movies.m3u',
  nigeria: 'https://iptv-org.github.io/iptv/countries/ng.m3u',
};

// Curated list of preferred channels by category
const CURATED_CHANNELS = {
  kids: [
    'Nickelodeon',
    'NickToons',
    'Cartoon Network',
    'Disney Channel',
    'Disney Junior',
    'Boomerang',
    'Cartoon Network HD',
    'Kids Central',
  ],
  news: [
    'BBC News',
    'CNN',
    'Al Jazeera',
    'France 24',
    'NHK World',
    'Sky News',
    'CNBC',
    'Reuters',
  ],
  music: [
    'MTV',
    'VH1',
    'Trace Urban',
    'Trace Toca',
    'Music Box',
    'M1',
  ],
  religious: [
    'Dove TV',
    'Emmanuel TV',
    'God TV',
    'Victory Channel',
    'Trinity Broadcasting',
    'Daystar',
  ],
  sports: [
    'SuperSport Action',
    'SuperSport Football',
    'SuperSport Cricket',
    'ESPN',
    'Fox Sports',
    'Eurosport',
  ],
  entertainment: [
    'eTV',
    'M-Net',
    'SABC2',
    'TVC',
    'Channels TV',
    'AIT',
  ],
  nigeria: [
    'NTA',
    'Channels TV',
    'TVC',
    'AIT',
    'Silverbird TV',
    'WAPBC TV',
  ],
  movies: [
    'African Magic Showcase',
    'African Magic Urban',
    'African Magic Family',
    'African Magic Movies',
  ],
};

// Helper function to parse M3U format
function parseM3U(content) {
  const lines = content.split('\n').map(line => line.trim());
  const channels = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('#EXTINF:')) {
      const nextLine = lines[i + 1];

      if (!nextLine || nextLine.startsWith('#')) continue;

      const name = extractAttribute(line, 'tvg-name') || extractChannelName(line);
      const logo = extractAttribute(line, 'tvg-logo') || '';
      const group = extractAttribute(line, 'group-title') || 'Unknown';
      const streamUrl = nextLine.trim();

      if (name && streamUrl && !streamUrl.startsWith('#') && isValidStreamUrl(streamUrl)) {
        channels.push({ name, logo, group, streamUrl });
      }

      i++;
    }
  }

  return channels;
}

function extractAttribute(line, attribute) {
  const regex = new RegExp(`${attribute}="([^"]*)"`, 'i');
  const match = line.match(regex);
  return match ? match[1] : '';
}

function extractChannelName(line) {
  const parts = line.split(',');
  return parts.length > 1 ? parts.slice(1).join(',').trim() : '';
}

function isValidStreamUrl(url) {
  return /^https?:\/\/.+|^rtmp:\/\/.+/i.test(url);
}

function normalizeChannelName(name) {
  return name.trim().replace(/\s+/g, ' ').toLowerCase();
}

function createSlug(name) {
  return normalizeChannelName(name)
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Fetch and parse playlists
async function fetchPlaylists() {
  const allChannels = {};

  for (const [category, url] of Object.entries(PLAYLISTS)) {
    console.log(`Fetching ${category} channels from ${url}...`);
    try {
      const response = await fetch(url);
      const content = await response.text();
      const channels = parseM3U(content);
      allChannels[category] = channels;
      console.log(`  ✓ Found ${channels.length} ${category} channels`);
    } catch (error) {
      console.error(`  ✗ Error fetching ${category}:`, error.message);
      allChannels[category] = [];
    }
  }

  return allChannels;
}

// Curate channels based on preferred list
function curateChannels(allChannels) {
  const curatedList = [];
  let idCounter = 1;

  for (const [category, channelList] of Object.entries(CURATED_CHANNELS)) {
    const sourceChannels = allChannels[category] || [];

    for (const preferredName of channelList) {
      // Find channel that matches preferred name (fuzzy match)
      const match = sourceChannels.find(ch =>
        ch.name.toLowerCase().includes(preferredName.toLowerCase()) ||
        preferredName.toLowerCase().includes(ch.name.toLowerCase())
      );

      if (match) {
        const channel = {
          id: idCounter.toString().padStart(3, '0'),
          name: match.name,
          slug: createSlug(match.name),
          category: mapCategory(category),
          country: getCountryCode(category, match.group),
          language: 'en', // Default to English
          logo: match.logo,
          streamUrl: match.streamUrl,
          featured: false,
          active: true,
        };

        // Mark some as featured for homepage
        if (idCounter <= 8) {
          channel.featured = true;
        }

        curatedList.push(channel);
        idCounter++;
      }
    }
  }

  return curatedList;
}

function mapCategory(category) {
  const mapping = {
    kids: 'Kids',
    news: 'News',
    music: 'Music',
    religious: 'Religious',
    sports: 'Sports',
    entertainment: 'Entertainment',
    movies: 'Movies',
    nigeria: 'Nigerian',
  };
  return mapping[category] || 'Entertainment';
}

function getCountryCode(category, group) {
  const countryMap = {
    kids: 'US',
    news: 'GB',
    music: 'US',
    religious: 'US',
    sports: 'ZA',
    entertainment: 'ZA',
    movies: 'ZA',
    nigeria: 'NG',
  };
  return countryMap[category] || 'US';
}

// Main execution
async function main() {
  console.log('Fetching IPTV channels from IPTV-org...\n');

  const allChannels = await fetchPlaylists();
  const curatedChannels = curateChannels(allChannels);

  // Create data directory if it doesn't exist
  const dataDir = join(__dirname, '..', 'data');
  mkdirSync(dataDir, { recursive: true });

  // Write curated channels to JSON file
  const outputPath = join(dataDir, 'curated-channels.json');
  writeFileSync(outputPath, JSON.stringify(curatedChannels, null, 2));

  console.log(`\n✓ Successfully created ${outputPath}`);
  console.log(`✓ Total curated channels: ${curatedChannels.length}`);
  console.log('\nChannel breakdown:');
  const grouped = {};
  curatedChannels.forEach(ch => {
    grouped[ch.category] = (grouped[ch.category] || 0) + 1;
  });
  Object.entries(grouped).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} channels`);
  });
}

main().catch(console.error);
