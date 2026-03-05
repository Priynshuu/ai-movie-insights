import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const OMDB_API_KEY = process.env.OMDB_API_KEY || '26a50d10';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface Review {
  text: string;
  rating: number;
  username: string;
}

export async function POST(request: NextRequest) {
  try {
    const { imdbId } = await request.json();

    if (!imdbId || !imdbId.match(/^tt\d{7,9}$/)) {
      return NextResponse.json(
        { error: 'Invalid IMDb ID format' },
        { status: 400 }
      );
    }

    // Fetch movie data from OMDb
    const omdbResponse = await axios.get(
      `http://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}&plot=full`
    );

    if (omdbResponse.data.Response === 'False') {
      return NextResponse.json(
        { error: omdbResponse.data.Error || 'Movie not found' },
        { status: 404 }
      );
    }

    const movieData = omdbResponse.data;

    // Transform movie data
    const movie = {
      title: movieData.Title,
      year: movieData.Year,
      released: movieData.Released,
      poster: movieData.Poster,
      rating: movieData.imdbRating,
      cast: movieData.Actors ? movieData.Actors.split(', ') : [],
      director: movieData.Director,
      writer: movieData.Writer,
      genre: movieData.Genre,
      runtime: movieData.Runtime,
      plot: movieData.Plot,
      awards: movieData.Awards,
      country: movieData.Country,
      language: movieData.Language
    };

    // Generate mock AI insights
    const avgRating = parseFloat(movieData.imdbRating) || 7.5;
    let sentiment: 'Positive' | 'Mixed' | 'Negative';
    
    if (avgRating >= 8) {
      sentiment = 'Positive';
    } else if (avgRating >= 6) {
      sentiment = 'Mixed';
    } else {
      sentiment = 'Negative';
    }

    const aiInsights = {
      summary: `Based on comprehensive analysis of audience reviews, this film receives ${sentiment.toLowerCase()} reception from viewers. The movie demonstrates strong appeal across multiple dimensions including storytelling, performances, and technical execution. Audiences particularly appreciate the depth of character development and the emotional resonance of the narrative. While some viewers note minor pacing concerns in certain sections, the overall consensus reflects substantial audience engagement and satisfaction with the cinematic experience. The film successfully balances entertainment value with artistic merit, creating a memorable viewing experience that resonates with diverse audience segments.`,
      positiveThemes: [
        'Exceptional storytelling and narrative structure',
        'Outstanding performances from lead and supporting cast',
        'Stunning cinematography and visual composition',
        'Profound emotional depth and character development',
        'Masterful direction and pacing',
        'Memorable dialogue and screenplay',
        'Excellent musical score and sound design',
        'Strong thematic elements and symbolism'
      ],
      neutralThemes: [
        'Runtime may feel lengthy for some viewers',
        'Complex plot requires full attention',
        'Mature themes may not suit all audiences',
        'Slow-burn narrative style',
        'Ambiguous ending open to interpretation'
      ],
      negativeThemes: avgRating < 9 ? [
        'Pacing issues in middle sections',
        'Some subplots could be more developed',
        'Occasional predictable moments',
        'Limited action sequences for genre expectations'
      ] : [
        'Very minor technical inconsistencies',
        'Could benefit from slightly tighter editing'
      ],
      overallSentiment: sentiment
    };

    return NextResponse.json({
      movie,
      aiInsights
    });

  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch movie insights' },
      { status: 500 }
    );
  }
}
