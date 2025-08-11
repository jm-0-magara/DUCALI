import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

    if (!query.trim()) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Build search conditions
    const whereConditions: any = {
      role: 'ARTISAN',
      artisanProfile: {
        isNot: null,
      },
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          artisanProfile: {
            specialty: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
        {
          artisanProfile: {
            skills: {
              hasSome: [query],
            },
          },
        },
      ],
    };

    // Add filters
    if (category) {
      whereConditions.artisanProfile = {
        ...whereConditions.artisanProfile,
        category: {
          contains: category,
          mode: 'insensitive',
        },
      };
    }

    if (location) {
      whereConditions.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    if (minRating) {
      whereConditions.artisanProfile = {
        ...whereConditions.artisanProfile,
        rating: {
          gte: minRating,
        },
      };
    }

    // Search for artisans
    const artisans = await prisma.user.findMany({
      where: whereConditions,
      include: {
        artisanProfile: {
          include: {
            portfolioItems: {
              take: 3,
              orderBy: {
                featured: 'desc',
              },
            },
            services: {
              where: maxPrice ? {
                OR: [
                  { minPrice: { lte: maxPrice } },
                  { maxPrice: { lte: maxPrice } },
                ],
              } : undefined,
              take: 5,
            },
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: [
        {
          artisanProfile: {
            rating: 'desc',
          },
        },
        {
          artisanProfile: {
            totalOrders: 'desc',
          },
        },
      ],
    });

    // Search for services
    const services = await prisma.service.findMany({
      where: {
        active: true,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            category: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
        ...(maxPrice && {
          OR: [
            { minPrice: { lte: maxPrice } },
            { maxPrice: { lte: maxPrice } },
          ],
        }),
        ...(category && {
          category: {
            contains: category,
            mode: 'insensitive',
          },
        }),
      },
      include: {
        artisan: {
          include: {
            artisanProfile: {
              select: {
                rating: true,
                totalOrders: true,
                location: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: [
        {
          artisan: {
            artisanProfile: {
              rating: 'desc',
            },
          },
        },
      ],
    });

    // Search for portfolio items
    const portfolioItems = await prisma.portfolioItem.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            tags: {
              hasSome: [query.toLowerCase()],
            },
          },
        ],
        ...(maxPrice && {
          price: {
            lte: maxPrice,
          },
        }),
        ...(category && {
          category: {
            contains: category,
            mode: 'insensitive',
          },
        }),
      },
      include: {
        artisan: {
          include: {
            user: {
              select: {
                name: true,
                location: true,
                profileImage: true,
              },
            },
            artisanProfile: {
              select: {
                rating: true,
                totalOrders: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: [
        {
          featured: 'desc',
        },
        {
          views: 'desc',
        },
      ],
    });

    return NextResponse.json({
      success: true,
      results: {
        artisans: artisans.map((artisan: any) => ({
          id: artisan.id,
          name: artisan.name,
          location: artisan.location,
          profileImage: artisan.profileImage,
          rating: artisan.artisanProfile?.rating || 0,
          totalOrders: artisan.artisanProfile?.totalOrders || 0,
          specialty: artisan.artisanProfile?.specialty,
          category: artisan.artisanProfile?.category,
          startingPrice: artisan.artisanProfile?.startingPrice,
          portfolioItems: artisan.artisanProfile?.portfolioItems || [],
          services: artisan.artisanProfile?.services || [],
        })),
        services: services.map((service: any) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          category: service.category,
          minPrice: service.minPrice,
          maxPrice: service.maxPrice,
          timeframe: service.timeframe,
          artisan: {
            id: service.artisan.id,
            name: service.artisan.name,
            location: service.artisan.location,
            profileImage: service.artisan.profileImage,
            rating: service.artisan.artisanProfile?.rating || 0,
            totalOrders: service.artisan.artisanProfile?.totalOrders || 0,
          },
        })),
        portfolioItems: portfolioItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          price: item.price,
          timeframe: item.timeframe,
          images: item.images,
          tags: item.tags,
          featured: item.featured,
          views: item.views,
          likes: item.likes,
          artisan: {
            id: item.artisan.id,
            name: item.artisan.user.name,
            location: item.artisan.user.location,
            profileImage: item.artisan.user.profileImage,
            rating: item.artisan.artisanProfile?.rating || 0,
            totalOrders: item.artisan.artisanProfile?.totalOrders || 0,
          },
        })),
      },
      pagination: {
        limit,
        offset,
        total: {
          artisans: artisans.length,
          services: services.length,
          portfolioItems: portfolioItems.length,
        },
      },
    });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
