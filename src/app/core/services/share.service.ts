import { Injectable } from '@angular/core';
import { Platform } from '../types/platform';
import { FACEBOOK_SHARE_LINK, TWITTER_TWEET_LINK } from '../constants/socials';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  handleShare(text: string, platform: Platform): void {
    if (!text) {
      return;
    }

    const encodedText = encodeURIComponent(text);
    switch (platform) {
      case 'twitter':
        window.open(`${TWITTER_TWEET_LINK}${encodedText}`, '_blank');
        break;
      case 'facebook':
        window.open(
          `${FACEBOOK_SHARE_LINK}${encodeURIComponent(window.location.href)}&quote=${encodedText}`,
          '_blank',
        );
        break;
      default:
        return;
    }
  }
}
