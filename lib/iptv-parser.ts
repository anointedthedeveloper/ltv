/**
 * IPTV M3U Parser
 * Parses M3U playlist format from IPTV-org and extracts channel data
 */

export interface ParsedChannel {
  name: string;
  logo: string;
  group: string;
  tvgId: string;
  streamUrl: string;
  duration: string;
}

/**
 * Parse M3U format string into structured channel data
 * M3U format: #EXTINF:-1 tvg-id="id" tvg-name="name" tvg-logo="logo" group-title="group",Name
 * Stream URL on next line
 */
export function parseM3U(content: string): ParsedChannel[] {
  const lines = content.split('\n').map(line => line.trim());
  const channels: ParsedChannel[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Look for EXTINF lines (channel metadata)
    if (line.startsWith('#EXTINF:')) {
      const nextLine = lines[i + 1];
      
      // Skip if next line is also metadata or empty
      if (!nextLine || nextLine.startsWith('#')) {
        continue;
      }

      // Extract metadata from EXTINF line
      const name = extractAttribute(line, 'tvg-name') || extractChannelName(line);
      const logo = extractAttribute(line, 'tvg-logo') || '';
      const group = extractAttribute(line, 'group-title') || 'Unknown';
      const tvgId = extractAttribute(line, 'tvg-id') || '';

      // The stream URL is on the next line
      const streamUrl = nextLine.trim();

      if (name && streamUrl && !streamUrl.startsWith('#')) {
        channels.push({
          name,
          logo,
          group,
          tvgId,
          streamUrl,
          duration: '-1',
        });
      }

      i++; // Skip the next line as we've already processed it
    }
  }

  return channels;
}

/**
 * Extract attribute value from M3U metadata line
 * Example: tvg-id="123" tvg-name="Channel" → extractAttribute(line, 'tvg-name') → "Channel"
 */
function extractAttribute(line: string, attribute: string): string {
  const regex = new RegExp(`${attribute}="([^"]*)"`, 'i');
  const match = line.match(regex);
  return match ? match[1] : '';
}

/**
 * Extract channel name from EXTINF line (last part after comma)
 * Example: #EXTINF:-1,Channel Name → "Channel Name"
 */
function extractChannelName(line: string): string {
  const parts = line.split(',');
  return parts.length > 1 ? parts.slice(1).join(',').trim() : '';
}

/**
 * Fetch M3U playlist from URL and parse it
 */
export async function fetchAndParseM3U(url: string): Promise<ParsedChannel[]> {
  try {
    const response = await fetch(url, { 
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch M3U from ${url}: ${response.statusText}`);
      return [];
    }

    const content = await response.text();
    return parseM3U(content);
  } catch (error) {
    console.error(`Error fetching M3U from ${url}:`, error);
    return [];
  }
}

/**
 * Filter out low-quality or duplicate channels
 */
export function filterChannels(
  channels: ParsedChannel[],
  options: {
    minNameLength?: number;
    excludePatterns?: RegExp[];
    deduplicateByName?: boolean;
  } = {}
): ParsedChannel[] {
  const {
    minNameLength = 2,
    excludePatterns = [],
    deduplicateByName = true,
  } = options;

  let filtered = channels.filter(channel => {
    // Filter by minimum name length
    if (channel.name.length < minNameLength) {
      return false;
    }

    // Filter by exclusion patterns
    for (const pattern of excludePatterns) {
      if (pattern.test(channel.name)) {
        return false;
      }
    }

    // Filter out channels with invalid stream URLs
    if (!channel.streamUrl || !isValidStreamUrl(channel.streamUrl)) {
      return false;
    }

    return true;
  });

  // Deduplicate by channel name (keep first occurrence)
  if (deduplicateByName) {
    const seen = new Set<string>();
    filtered = filtered.filter(channel => {
      if (seen.has(channel.name.toLowerCase())) {
        return false;
      }
      seen.add(channel.name.toLowerCase());
      return true;
    });
  }

  return filtered;
}

/**
 * Check if a stream URL appears to be valid
 */
function isValidStreamUrl(url: string): boolean {
  // Should start with http(s) or be an M3U8 file
  return /^https?:\/\/.+|^rtmp:\/\/.+|\.m3u8$/i.test(url);
}

/**
 * Normalize channel name (remove extra spaces, special characters)
 */
export function normalizeChannelName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/[^\w\s-&]/g, '') // Remove special characters except &
    .trim();
}

/**
 * Create URL-safe slug from channel name
 */
export function createSlug(name: string): string {
  return normalizeChannelName(name)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
