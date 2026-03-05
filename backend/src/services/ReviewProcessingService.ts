import { Review } from '../types';
import { logger } from '../utils/logger';

export class ReviewProcessingService {
  sanitizeReviews(reviews: Review[]): Review[] {
    return reviews.map(review => ({
      ...review,
      text: this.sanitizeText(review.text)
    }));
  }

  private sanitizeText(text: string): string {
    // Remove HTML tags
    let sanitized = text.replace(/<[^>]*>/g, '');
    
    // Remove special characters but preserve sentiment-relevant punctuation
    sanitized = sanitized.replace(/[^\w\s.,!?;:'"()-]/g, '');
    
    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
    
    return sanitized;
  }

  filterShortReviews(reviews: Review[]): Review[] {
    return reviews.filter(review => {
      const wordCount = review.text.split(/\s+/).length;
      return wordCount >= 10;
    });
  }

  truncateLongReviews(reviews: Review[]): Review[] {
    return reviews.map(review => ({
      ...review,
      text: review.text.length > 1000 
        ? review.text.substring(0, 1000) + '...' 
        : review.text
    }));
  }

  deduplicateReviews(reviews: Review[]): Review[] {
    const seen = new Set<string>();
    return reviews.filter(review => {
      const normalized = review.text.toLowerCase().trim();
      if (seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    });
  }

  normalizeRatings(reviews: Review[]): Review[] {
    return reviews.map(review => ({
      ...review,
      rating: this.normalizeRating(review.rating)
    }));
  }

  private normalizeRating(rating: number): number {
    // Normalize to 0-10 scale
    if (rating <= 5) {
      return rating * 2; // Assume 0-5 scale
    }
    return Math.min(rating, 10); // Assume already 0-10 scale
  }

  processReviews(reviews: Review[]): Review[] {
    logger.info('Processing reviews', { count: reviews.length });
    
    let processed = this.sanitizeReviews(reviews);
    processed = this.filterShortReviews(processed);
    processed = this.truncateLongReviews(processed);
    processed = this.deduplicateReviews(processed);
    processed = this.normalizeRatings(processed);
    
    logger.info('Reviews processed', { 
      original: reviews.length, 
      processed: processed.length 
    });
    
    return processed;
  }
}
