import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/server/utils/response';
import { eventService } from '@/lib/server/services/eventService';
import { EventCategory } from '@/types';

// Disallow SSRF to private/internal networks
function isPrivateIpOrHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    return true;
  }

  // IPv4 private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = host.match(ipv4Regex);
  if (match) {
    const [, b1, b2] = match.map(Number);
    if (b1 === 10) return true;
    if (b1 === 127) return true;
    if (b1 === 169 && b2 === 254) return true;
    if (b1 === 172 && b2 >= 16 && b2 <= 31) return true;
    if (b1 === 192 && b2 === 168) return true;
    if (b1 === 0) return true;
  }

  return false;
}

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function cleanTitle(rawTitle: string): string {
  if (!rawTitle) return '';
  let clean = decodeHtmlEntities(rawTitle);
  // Strip common platform suffixes
  clean = clean.replace(/\s*[|\-–—]\s*(Unstop|Devfolio|Eventbrite|Google Forms|HackerEarth|Meetup|Luma|Townscript).*$/i, '');
  return clean.trim();
}

function inferCategory(text: string): EventCategory {
  const lower = text.toLowerCase();
  if (lower.includes('hackathon') || lower.includes('hack ') || lower.includes('hack-')) return 'Hackathons';
  if (lower.includes('workshop') || lower.includes('bootcamp') || lower.includes('hands-on')) return 'Workshops';
  if (lower.includes('coding competition') || lower.includes('contest') || lower.includes('algorithmic') || lower.includes('code challenge')) return 'Coding Competitions';
  if (lower.includes('webinar') || lower.includes('virtual session') || lower.includes('online session')) return 'Webinars';
  if (lower.includes('tech talk') || lower.includes('keynote') || lower.includes('panel discussion')) return 'Tech Talks';
  if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('artificial intelligence') || lower.includes('llm') || lower.includes('neural')) return 'AI Events';
  if (lower.includes('conference') || lower.includes('summit') || lower.includes('symposium') || lower.includes('con 20')) return 'Conferences';
  if (lower.includes('college') || lower.includes('campus') || lower.includes('university') || lower.includes('fest')) return 'College Events';
  if (lower.includes('career') || lower.includes('job fair') || lower.includes('hiring') || lower.includes('internship fair')) return 'Career Events';
  return 'Workshops';
}

function extractTechSkills(combinedText: string): string[] {
  const commonSkills = [
    'React', 'Next.js', 'Python', 'AI/ML', 'Machine Learning', 'Deep Learning',
    'Node.js', 'TypeScript', 'JavaScript', 'Cloud Computing', 'AWS', 'GCP', 'Azure',
    'Docker', 'Kubernetes', 'Web3', 'Blockchain', 'Cybersecurity', 'Ethical Hacking',
    'Data Science', 'Data Structures', 'Algorithms', 'Java', 'C++', 'Go', 'Rust',
    'Mobile Development', 'Flutter', 'React Native', 'DevOps', 'UI/UX Design', 'Figma'
  ];

  const found: string[] = [];
  const lower = combinedText.toLowerCase();

  for (const skill of commonSkills) {
    const sLower = skill.toLowerCase();
    if (lower.includes(sLower) && !found.includes(skill)) {
      found.push(skill);
      if (found.length >= 6) break;
    }
  }

  return found.length > 0 ? found : ['Computer Science', 'Software Engineering', 'Full Stack'];
}

function formatDate(isoStr?: string): { dateStr: string; timeStr: string } {
  if (!isoStr) return { dateStr: '', timeStr: '' };
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return { dateStr: '', timeStr: '' };
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dateStr = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeStr = `${hours}:${minutes} ${ampm} IST`;

    return { dateStr, timeStr };
  } catch {
    return { dateStr: '', timeStr: '' };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawUrl = (body.url || '').trim();

    if (!rawUrl) {
      return apiError('Event URL is required.', 400);
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return apiError('Invalid URL format. Please provide a full link starting with http:// or https://', 400);
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return apiError('Only HTTP and HTTPS links are allowed.', 400);
    }

    if (isPrivateIpOrHost(parsedUrl.hostname)) {
      return apiError('Access to local or private networks is restricted.', 400);
    }

    // Check for existing event registration link duplicate
    const duplicateCheck = await eventService.checkDuplicateRegistrationUrl(rawUrl);

    // Fetch the external web page securely with a reasonable 8-second timeout
    let html = '';
    try {
      const response = await fetch(rawUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(8000),
        redirect: 'follow',
      });

      if (response.ok) {
        html = await response.text();
      }
    } catch (fetchErr: any) {
      console.warn('Metadata extraction fetch failed or timed out:', fetchErr?.message);
      // Graceful fallback according to requirement 5
      return apiSuccess({
        success: false,
        warning: 'Unable to automatically extract some details from this website. Please enter the remaining information manually.',
        data: {
          registrationUrl: rawUrl,
          eventWebsiteUrl: rawUrl,
        },
        duplicateWarning: duplicateCheck.isDuplicate ? {
          message: `This registration link may already be associated with event: "${duplicateCheck.matchedEvent?.title}"`,
          matchedEventId: duplicateCheck.matchedEvent?.id
        } : null,
      });
    }

    if (!html || html.length < 50) {
      return apiSuccess({
        success: false,
        warning: 'Unable to automatically extract some details from this website. Please enter the remaining information manually.',
        data: {
          registrationUrl: rawUrl,
          eventWebsiteUrl: rawUrl,
        },
        duplicateWarning: duplicateCheck.isDuplicate ? {
          message: `This registration link may already be associated with event: "${duplicateCheck.matchedEvent?.title}"`,
          matchedEventId: duplicateCheck.matchedEvent?.id
        } : null,
      });
    }

    // Extract OpenGraph tags
    const getMeta = (prop: string): string => {
      // Matches both property="og:..." and name="og:..." with content="..."
      const reg = new RegExp(`<meta\\s+[^>]*(?:property|name)=["']${prop}["'][^>]*content=["']([^"']*)["']`, 'i');
      const match = html.match(reg);
      if (match) return decodeHtmlEntities(match[1]);

      // Reverse attribute order: content="..." property="..."
      const revReg = new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${prop}["']`, 'i');
      const revMatch = html.match(revReg);
      return revMatch ? decodeHtmlEntities(revMatch[1]) : '';
    };

    let title = getMeta('og:title') || getMeta('twitter:title') || '';
    if (!title) {
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) title = decodeHtmlEntities(titleMatch[1]);
    }

    let description = getMeta('og:description') || getMeta('twitter:description') || getMeta('description') || '';
    let siteName = getMeta('og:site_name') || getMeta('author') || '';
    let image = getMeta('og:image:secure_url') || getMeta('og:image') || getMeta('twitter:image') || '';
    let canonicalUrl = getMeta('og:url') || rawUrl;

    // Resolve relative image URL
    if (image && !image.startsWith('http://') && !image.startsWith('https://')) {
      try {
        image = new URL(image, parsedUrl.origin).href;
      } catch {
        image = '';
      }
    }

    // Parse Schema.org JSON-LD scripts
    let schemaEvent: any = null;
    const jsonLdMatches = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of jsonLdMatches) {
      try {
        const parsed = JSON.parse(match[1].trim());
        const candidates = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
        for (const item of candidates) {
          const type = (item['@type'] || '').toLowerCase();
          if (type.includes('event') || type.includes('hackathon') || type.includes('competition')) {
            schemaEvent = item;
            break;
          }
        }
        if (schemaEvent) break;
      } catch {
        // ignore malformed JSON-LD
      }
    }

    let extractedDate = '';
    let extractedTime = '';
    let extractedDeadline = '';
    let locationStr = 'Online / Virtual Stream';
    let isOnline = true;
    let organizer = siteName || '';

    if (schemaEvent) {
      if (!title && schemaEvent.name) title = schemaEvent.name;
      if (!description && schemaEvent.description) description = schemaEvent.description;
      if (!image && schemaEvent.image) {
        image = typeof schemaEvent.image === 'string' ? schemaEvent.image : schemaEvent.image.url || '';
      }

      if (schemaEvent.organizer) {
        organizer = typeof schemaEvent.organizer === 'string' 
          ? schemaEvent.organizer 
          : schemaEvent.organizer.name || organizer;
      }

      if (schemaEvent.startDate) {
        const { dateStr, timeStr } = formatDate(schemaEvent.startDate);
        if (dateStr) extractedDate = dateStr;
        if (timeStr) extractedTime = timeStr;
      }

      if (schemaEvent.location) {
        if (typeof schemaEvent.location === 'string') {
          locationStr = schemaEvent.location;
          isOnline = /online|virtual|webinar|discord|zoom|remote/i.test(locationStr);
        } else if (schemaEvent.location.name || schemaEvent.location.address) {
          locationStr = schemaEvent.location.name || schemaEvent.location.address;
          isOnline = /online|virtual|webinar|discord|zoom|remote/i.test(locationStr);
        }
      }
    }

    // Fallback organizer from domain
    if (!organizer) {
      const hostParts = parsedUrl.hostname.split('.');
      if (hostParts.length >= 2) {
        const domainName = hostParts[hostParts.length - 2];
        organizer = domainName.charAt(0).toUpperCase() + domainName.slice(1);
      }
    }

    const cleanEventTitle = cleanTitle(title);
    const category = inferCategory(`${cleanEventTitle} ${description}`);
    const skills = extractTechSkills(`${cleanEventTitle} ${description}`);

    const hasExtractedInfo = Boolean(cleanEventTitle || description || image || extractedDate);

    return apiSuccess({
      success: hasExtractedInfo,
      warning: hasExtractedInfo 
        ? null 
        : 'Unable to automatically extract some details from this website. Please enter the remaining information manually.',
      data: {
        title: cleanEventTitle || undefined,
        description: description ? description.slice(0, 1000) : undefined,
        organizer: organizer || undefined,
        category,
        date: extractedDate || undefined,
        time: extractedTime || undefined,
        location: locationStr,
        isOnline,
        registrationDeadline: extractedDeadline || undefined,
        skills,
        registrationUrl: rawUrl,
        eventWebsiteUrl: canonicalUrl || rawUrl,
        posterUrl: image || undefined,
      },
      duplicateWarning: duplicateCheck.isDuplicate ? {
        message: 'This registration link may already be associated with another event.',
        matchedEvent: duplicateCheck.matchedEvent,
      } : null,
    });
  } catch (err: any) {
    return apiError(err.message || 'Server error during URL extraction', 500);
  }
}
