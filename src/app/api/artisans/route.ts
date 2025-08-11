import { NextRequest, NextResponse } from 'next/server';
import { findArtisans, prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

    // Validate parameters
    if (limit > 100) {
      return NextResponse.json(
        { error: 'Limit cannot exceed 100' },
        { status: 400 }
      );
    }

    // Find artisans with filters
    const artisans = await findArtisans({
      category: category || undefined,
      location: location || undefined,
      minRating,
      maxPrice,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      artisans,
      pagination: {
        limit,
        offset,
        total: artisans.length, // Note: This is just the current page count
      }
    });
  } catch (error) {
    console.error('Error fetching artisans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artisans' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      specialty, 
      category, 
      experienceYears, 
      responseTime, 
      startingPrice, 
      skills, 
      languages 
    } = body;

    // Validate required fields
    if (!userId || !specialty || !category) {
      return NextResponse.json(
        { error: 'User ID, specialty, and category are required' },
        { status: 400 }
      );
    }

    // Create artisan profile
    const artisanProfile = await prisma.artisanProfile.create({
      data: {
        userId,
        specialty,
        category,
        experienceYears: experienceYears || null,
        responseTime: responseTime || 'Within 24 hours',
        startingPrice: startingPrice || null,
        skills: skills || [],
        languages: languages || ['English'],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            location: true,
            bio: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      artisanProfile,
      message: 'Artisan profile created successfully'
    });
  } catch (error) {
    console.error('Error creating artisan profile:', error);
    return NextResponse.json(
      { error: 'Failed to create artisan profile' },
      { status: 500 }
    );
  }
}
