import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const artisan = await prisma.user.findUnique({
      where: { id },
      include: {
        artisanProfile: {
          include: {
            portfolioItems: true,
            services: true,
          },
        },
        reviews: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!artisan || artisan.role !== 'ARTISAN') {
      return NextResponse.json(
        { error: 'Artisan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      artisan,
    });
  } catch (error) {
    console.error('Error fetching artisan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artisan' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if user exists and is an artisan
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { artisanProfile: true },
    });

    if (!existingUser || existingUser.role !== 'ARTISAN') {
      return NextResponse.json(
        { error: 'Artisan not found' },
        { status: 404 }
      );
    }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        phone: body.phone,
        location: body.location,
        bio: body.bio,
        profileImage: body.profileImage,
      },
      include: {
        artisanProfile: {
          include: {
            portfolioItems: true,
            services: true,
          },
        },
      },
    });

    // Update artisan profile if provided
    if (body.artisanProfile && existingUser.artisanProfile) {
      await prisma.artisanProfile.update({
        where: { id: existingUser.artisanProfile.id },
        data: {
          specialty: body.artisanProfile.specialty,
          category: body.artisanProfile.category,
          experienceYears: body.artisanProfile.experienceYears,
          responseTime: body.artisanProfile.responseTime,
          startingPrice: body.artisanProfile.startingPrice,
          skills: body.artisanProfile.skills,
          languages: body.artisanProfile.languages,
          availabilityStatus: body.artisanProfile.availabilityStatus,
        },
      });
    }

    return NextResponse.json({
      success: true,
      artisan: updatedUser,
      message: 'Artisan profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating artisan:', error);
    return NextResponse.json(
      { error: 'Failed to update artisan' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if user exists and is an artisan
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { artisanProfile: true },
    });

    if (!existingUser || existingUser.role !== 'ARTISAN') {
      return NextResponse.json(
        { error: 'Artisan not found' },
        { status: 404 }
      );
    }

    // Delete artisan profile first (due to foreign key constraints)
    if (existingUser.artisanProfile) {
      await prisma.artisanProfile.delete({
        where: { id: existingUser.artisanProfile.id },
      });
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Artisan deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting artisan:', error);
    return NextResponse.json(
      { error: 'Failed to delete artisan' },
      { status: 500 }
    );
  }
}
