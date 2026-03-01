import { PrismaClient, Role, BookingStatus, TourStatus, Status } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Users
  const tourist = await prisma.user.create({
    data: {
      email: 'tourist@daleelah.com',
      password: '123456',
      fullName: 'أحمد السائح',
      role: Role.TOURIST,
      phone: '+966501234567',
    },
  });

  const guide = await prisma.user.create({
    data: {
      email: 'guide@daleelah.com',
      password: '123456',
      fullName: 'محمد المرشد',
      role: Role.GUIDE,
      phone: '+966509876543',
    },
  });

  await prisma.guideProfile.create({
    data: {
      userId: guide.id,
      bio: 'مرشد سياحي متخصص في المواقع التاريخية',
      specialties: JSON.stringify(['تراث', 'تاريخ']),
      languages: JSON.stringify(['العربية', 'الإنجليزية']),
      pricePerHour: 100,
      experienceYears: 5,
    },
  });

  // إضافة المرشدين الموجودين في الصور
  const guides = [
    {
      email: 'bushra@daleelah.com',
      fullName: 'Bushra AlKasel',
      phone: '+966501111111',
      bio: "Diriyah: Historic mud-brick architecture, At-Turaif's UNESCO heritage charm, and palm-lined wadi views—perfect for cultural walks.",
      specialties: ['City', 'Mountains'],
      languages: ['Arabic', 'English'],
      pricePerHour: 210,
      experienceYears: 8,
      rating: 4.9,
    },
    {
      email: 'faitma@daleelah.com',
      fullName: 'Faitma Aloasay',
      phone: '+966502222222',
      bio: 'Pristine Red Sea coast on the Gulf of Aqaba, dramatic desert-and-mountain landscapes.',
      specialties: ['City', 'Mountains'],
      languages: ['Arabic', 'English'],
      pricePerHour: 210,
      experienceYears: 6,
      rating: 4.9,
    },
    {
      email: 'sera@daleelah.com',
      fullName: 'Sera alnasm',
      phone: '+966503333333',
      bio: 'UNESCO sites + desert experiences in AlUla. I can help you plan the best time and route.',
      specialties: ['Nature', 'UNESCO'],
      languages: ['Arabic', 'English'],
      pricePerHour: 220,
      experienceYears: 7,
      rating: 4.9,
    },
    {
      email: 'feras@daleelah.com',
      fullName: 'Feras AlGasm',
      phone: '+966504444444',
      bio: 'Abha: Cool mountain air, morning fog, and the forests of As-Soudah.',
      specialties: ['City'],
      languages: ['Arabic', 'English'],
      pricePerHour: 180,
      experienceYears: 4,
      rating: 4.2,
    },
    {
      email: 'fahd@daleelah.com',
      fullName: 'Fahd Alqahtan',
      phone: '+966505555555',
      bio: 'Jeddah corniche, historic Al-Balad vibes, and sea-side routes. Perfect for chill evening tours.',
      specialties: ['City'],
      languages: ['Arabic', 'English'],
      pricePerHour: 190,
      experienceYears: 5,
      rating: 4.6,
    },
    {
      email: 'ahmed@daleelah.com',
      fullName: 'Ahmed Almutairi',
      phone: '+966506666666',
      bio: 'Heritage-focused guide in Diriyah & central Riyadh. Great for photo walks and family trips.',
      specialties: ['Heritage'],
      languages: ['Arabic', 'English'],
      pricePerHour: 200,
      experienceYears: 6,
      rating: 4.8,
    },
  ];

  for (const guideData of guides) {
    const user = await prisma.user.create({
      data: {
        email: guideData.email,
        password: '123456',
        fullName: guideData.fullName,
        role: Role.GUIDE,
        phone: guideData.phone,
      },
    });

    await prisma.guideProfile.create({
      data: {
        userId: user.id,
        bio: guideData.bio,
        specialties: JSON.stringify(guideData.specialties),
        languages: JSON.stringify(guideData.languages),
        pricePerHour: guideData.pricePerHour,
        experienceYears: guideData.experienceYears,
        rating: guideData.rating,
      },
    });
  }

  const company = await prisma.user.create({
    data: {
      email: 'company@daleelah.com',
      password: '123456',
      fullName: 'شركة السياحة الذهبية',
      role: Role.COMPANY,
      phone: '+966507777777',
    },
  });

  const ministry = await prisma.user.create({
    data: {
      email: 'ministry@daleelah.com',
      password: '123456',
      fullName: 'وزارة السياحة',
      role: Role.MINISTRY,
    },
  });

  console.log('✅ Users & Guides created');

  // Destinations
  const alula = await prisma.destination.create({
    data: {
      slug: 'alula-hegra',
      title: 'العلا - مدائن صالح',
      city: 'AlUla',
      region: 'Madinah Region',
      category: 'Heritage',
      summary: 'موقع تراث عالمي يضم مقابر نبطية منحوتة في الصخور',
      description: 'العلا هي موطن مدائن صالح، أول موقع سعودي يُدرج في قائمة اليونسكو للتراث العالمي.',
      images: JSON.stringify(['/images/alula_2.jpeg']),
      tags: JSON.stringify(['UNESCO', 'تاريخ', 'صحراء']),
      rating: 4.9,
      status: Status.APPROVED,
    },
  });

  const diriyah = await prisma.destination.create({
    data: {
      slug: 'diriyah',
      title: 'الدرعية التاريخية',
      city: 'Riyadh',
      region: 'Riyadh Region',
      category: 'Heritage',
      summary: 'مهد الدولة السعودية الأولى',
      description: 'الدرعية التاريخية هي مهد الدولة السعودية وموقع تراث عالمي.',
      images: JSON.stringify(['/images/diriyah_1.webp']),
      tags: JSON.stringify(['UNESCO', 'تراث']),
      rating: 4.8,
      status: Status.APPROVED,
    },
  });

  console.log('✅ Destinations created');

  // Booking
  await prisma.booking.create({
    data: {
      touristId: tourist.id,
      guideId: guide.id,
      destinationId: alula.id,
      startDate: new Date('2026-03-15'),
      endDate: new Date('2026-03-17'),
      status: BookingStatus.CONFIRMED,
      totalPrice: 1200,
      participants: 2,
    },
  });

  console.log('✅ Bookings created');

  // Tour
  await prisma.tour.create({
    data: {
      guideId: guide.id,
      title: 'جولة تراثية في الدرعية',
      description: 'استكشف التاريخ النجدي',
      location: 'الدرعية التاريخية',
      date: new Date('2026-02-18'),
      time: '09:00 AM',
      duration: '4 ساعات',
      price: 600,
      maxParticipants: 15,
      status: TourStatus.UPCOMING,
    },
  });

  console.log('✅ Tours created');
  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });