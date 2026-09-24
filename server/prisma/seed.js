require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Admin from Environment Variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file before seeding.'
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail.toLowerCase().trim() },
    update: {
      password: hashedPassword
    },
    create: {
      email: adminEmail.toLowerCase().trim(),
      password: hashedPassword,
      name: 'Pastor / Administrator'
    }
  });
  console.log('✅ Admin user created/verified:', admin.email);

  // 2. Seed Site Settings
  const settingsData = [
    { key: 'site_title', value: 'Friends Garden AG Church', group: 'general' },
    { key: 'hero_title', value: 'Friends Garden AG Church', group: 'hero' },
    { key: 'hero_subtitle', value: 'A Place to Belong, Believe, and Become.', group: 'hero' },
    { key: 'hero_youtube_url', value: 'https://youtube.com/@lifeparktv?feature=shared', group: 'hero' },
    { key: 'hero_bg_image', value: '/images/church_inside_2.jpg', group: 'hero' },

    { key: 'welcome_celebrate_desc', value: 'We worship our Heavenly Father with thankfulness and reverence.', group: 'home' },
    { key: 'welcome_grow_desc', value: "We grow in love, unity, and knowledge of God's Word together.", group: 'home' },
    { key: 'welcome_uplift_desc', value: 'We learn from each other and live out God’s will with joy.', group: 'home' },
    { key: 'welcome_footer_text', value: "Whether you're new or seeking deeper connection, you're always welcome here. We're a family growing in faith and sharing Christ’s love with joy.", group: 'home' },

    { key: 'promise_year', value: '2025', group: 'promise' },
    { key: 'promise_verse', value: '"Because he loves me,” says the Lord, “I will rescue him; I will protect him, for he acknowledges my name."', group: 'promise' },
    { key: 'promise_ref', value: '— Psalm 91:14', group: 'promise' },

    { key: 'pastor_welcome_title', value: 'A Warm Welcome from Our Pastor', group: 'home' },
    { key: 'pastor_welcome_message', value: "Greetings in the precious name of our Lord and Savior Jesus Christ!\n\nAt Friends Garden A.G Church, we believe that every person is valued, loved, and called by God for a purpose. It’s our joy to welcome you into a place where you can grow in faith, connect in fellowship, and experience the transforming power of God’s Word.\n\nWe invite you to join us in worship, serve alongside us, and discover the abundant life found in Christ. May you be blessed, strengthened, and encouraged as you journey with us in faith.", group: 'home' },
    { key: 'pastor_name', value: 'Amal M. Augustine', group: 'home' },
    { key: 'pastor_role', value: 'Senior Pastor, Friends Garden A.G Church', group: 'home' },
    { key: 'pastor_image', value: '/images/Pastor_pic.jpg', group: 'home' },

    { key: 'app_title', value: '📖 Uvamaigal – Bible Short Stories App', group: 'app' },
    { key: 'app_desc', value: 'Uvamaigal is a meaningful app developed by Pastor Amal M. Augustine, filled with impactful short stories rooted in biblical teachings. These inspiring parables make spiritual lessons easy to grasp.\n\nWhether you’re reading personally or teaching others, Uvamaigal helps bring God’s Word alive in a simple, memorable, and heart-touching way.', group: 'app' },
    { key: 'app_playstore_url', value: 'https://play.google.com/store/apps/details?id=com.gnanadurai.uvamaigal', group: 'app' },
    { key: 'app_image', value: '/images/uvamaigal.jpg', group: 'app' },

    { key: 'contact_address', value: 'Friends Garden A.G church, Near Keezhvallam Railway Gate, Thaikal Via.Kollidam - 609102, Mayiladuthurai District', group: 'contact' },
    { key: 'contact_email', value: 'kollidamag@gmail.com', group: 'contact' },
    { key: 'contact_phone', value: '+91 98656 81983', group: 'contact' },
    { key: 'contact_hours', value: 'Mon–Fri: 10am–6pm', group: 'contact' },
    { key: 'contact_map_embed', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.2444780831706!2d79.7227746!3d11.316832999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a54dd02183b6739%3A0x10498d09bef5eb5c!2sAssemblies%20of%20God%20Church!5e0!3m2!1sen!2sin!4v1752774351992!5m2!1sen!2sin', group: 'contact' },
    { key: 'contact_map_link', value: 'https://goo.gl/maps/kLvnhfWSPSwtAb619', group: 'contact' },

    { key: 'social_instagram', value: 'https://instagram.com', group: 'social' },
    { key: 'social_facebook', value: 'https://facebook.com', group: 'social' },
    { key: 'social_twitter', value: 'https://twitter.com', group: 'social' },
    { key: 'social_whatsapp', value: 'https://whatsapp.com', group: 'social' },

    { key: 'about_verse', value: '“Upon this rock I will build my church...” — Matthew 16:18', group: 'about' },
    { key: 'about_story', value: "Friends Garden A.G Church is more than just a building — it’s a family of believers united in Christ. Rooted in God's Word and guided by the Holy Spirit, our church exists to glorify God, preach the Gospel, and serve the world with love and compassion. We are a welcoming community where faith grows, lives are transformed, and Jesus is the center of everything we do. Whether you're seeking hope, healing, or a place to belong, you are welcome here.\n\nAt Friends Garden AG Church, we believe the church is not just a place you go — it’s a family you belong to. We are a vibrant, Spirit-led community that seeks to reflect the love of Christ in all we do.\n\nOur foundation is built on the unchanging truth of God's Word. We believe the Bible is alive and powerful, guiding us in every step of life. Through prayer, worship, and discipleship, we grow together in faith and purpose. We exist not only to worship but to serve. Our church is active in outreach, missions, and community care.", group: 'about' },
    { key: 'pastor_family_image', value: "/images/Pastor's_Family_Pic.jpg", group: 'about' },
    { key: 'pastor_bio', value: "Pastor Amal M. Augustine is a servant leader, fully committed to the Lord’s calling. He is blessed with his wife Jasmine Shalini and two daughters — Joy Malar and Doris Mahima.\n\nHe holds a B.Th from Madras A.G. Bible College, Saidapet, Chennai, and a M.A.B.S from Hindustan Bible Institute, Purasaiwakkam, Chennai. With nearly 20 years of full-time ministry experience, he has served in multiple regions and has led Friends Garden A.G. Church for over 6 years.", group: 'about' },

    { key: 'donate_account_name', value: 'ASSEMBLY OF GOD KOLLIDAM', group: 'donate' },
    { key: 'donate_account_number', value: '0796053000004801', group: 'donate' },
    { key: 'donate_ifsc', value: 'SIBL0000796', group: 'donate' },
    { key: 'donate_micr', value: '609059002', group: 'donate' },
    { key: 'donate_swift', value: 'SOININ55XXX', group: 'donate' }
  ];

  for (const item of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: item.key },
      update: { value: item.value, group: item.group },
      create: item
    });
  }
  console.log(`✅ Seeded ${settingsData.length} site settings.`);

  // 3. Seed Ministries
  const ministriesData = [
    {
      title: 'Youth Ministry',
      description: 'Equipping and empowering the next generation to stand strong in Christ and impact the world with creativity and passion.',
      details: 'Our Youth Ministry is a vibrant and passionate community of young believers growing in faith and purpose. We equip and empower the next generation to stand strong in Christ and impact the world. Through worship, Bible study, mentoring, and outreach, youth are nurtured spiritually and socially. Join us as we pursue God’s calling with energy, creativity, and unity.',
      imageUrl: '/images/Youth_ministry.jpeg',
      order: 1,
      isActive: true
    },
    {
      title: 'Children Ministry',
      description: 'A joyful space where kids discover God’s love in fun and meaningful ways through songs, stories, and crafts.',
      details: 'Our Children’s Ministry is a joyful space where kids discover God’s love in fun and meaningful ways. We teach biblical values through songs, stories, crafts, and interactive lessons. Each child is nurtured in a safe, loving environment to grow in faith and character. We believe children are a gift from God and a vital part of His Kingdom.',
      imageUrl: '/images/Children_minstry.jpeg',
      order: 2,
      isActive: true
    },
    {
      title: 'Outreach Ministry',
      description: 'Sharing God’s love beyond church walls by serving communities through acts of compassion and practical support.',
      details: 'Our Outreach Ministry is dedicated to sharing God’s love beyond the church walls. We serve communities through acts of compassion, prayer, and practical support. By reaching the unreached and uplifting the needy, we reflect the heart of Christ. Join us in being the hands and feet of Jesus to a world in need.',
      imageUrl: '/images/Outreach_ministry.jpeg',
      order: 3,
      isActive: true
    },
    {
      title: 'Men’s Ministry',
      description: 'Empowering men to grow in faith, godly character, brotherhood, and leadership in their families and community.',
      details: 'Our Men’s Ministry empowers men to grow in faith, character, and leadership. We gather for fellowship, prayer, and teaching that strengthens spiritual foundations. Through accountability and brotherhood, men are equipped to lead their families and communities. Together, we pursue God’s purpose and become men after His own heart.',
      imageUrl: "/images/Men's_ministry.jpeg",
      order: 4,
      isActive: true
    },
    {
      title: 'Women’s Ministry',
      description: 'A nurturing community where women walk in grace, wisdom, discipleship, and spiritual sisterhood.',
      details: 'Our Women’s Ministry is a nurturing community where women grow in faith, strength, and purpose. We come together for prayer, fellowship, and encouragement rooted in God’s Word. Through discipleship and support, women are empowered to impact their homes and communities. Join us as we walk in grace, wisdom, and the beauty of God\'s calling for women.',
      imageUrl: "/images/Women's_ministry.jpeg",
      order: 5,
      isActive: true
    },
    {
      title: 'Volunteer Ministry',
      description: 'The heartbeat of church service, serving joyfully in choir, media, hospitality, and church maintenance.',
      details: 'Our Volunteer Ministry is the heartbeat of service within the church and beyond. We believe every act of service, big or small, makes a lasting impact for God’s Kingdom. Whether greeting newcomers, operating audiovisual tech, or serving during special gatherings, our volunteers shine the love of Christ.',
      imageUrl: '/images/Volunteer_ministry.jpeg',
      order: 6,
      isActive: true
    }
  ];

  for (const m of ministriesData) {
    const existing = await prisma.ministry.findFirst({ where: { title: m.title } });
    if (!existing) {
      await prisma.ministry.create({ data: m });
    }
  }
  console.log('✅ Seeded ministries.');

  // 4. Seed Leadership
  const leaderCount = await prisma.leadership.count();
  if (leaderCount === 0) {
    await prisma.leadership.create({
      data: {
        name: 'Pastor Amal M. Augustine',
        role: 'Senior Pastor',
        bio: 'Pastor Amal has served in full-time ministry for nearly two decades, holding B.Th and M.A.B.S degrees, leading Friends Garden A.G. Church with vision and heart.',
        imageUrl: '/images/Pastor_pic.jpg',
        order: 1
      }
    });
    console.log('✅ Seeded leadership.');
  }

  // 5. Seed Events
  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    await prisma.event.create({
      data: {
        title: 'Sunday Worship & Word Celebration',
        summary: 'Join us for a dynamic, Spirit-filled Sunday service with vibrant praise, worship, and an inspiring message.',
        time: 'Every Sunday | 9:00 AM - 11:30 AM',
        location: 'FGAG Main Sanctuary, Kollidam',
        details: 'Experience the transforming presence of God in our weekly Sunday gathering. Special Sunday School sessions are available for kids, followed by fellowship and prayer ministry.',
        imageUrl: '/images/Sunday_service.png',
        isFeatured: true
      }
    });
    console.log('✅ Seeded featured event.');
  }

  // 6. Seed Gallery Images
  const galleryCount = await prisma.galleryImage.count();
  if (galleryCount === 0) {
    const galleryItems = [
      { title: 'Sunday Worship Service', category: 'sunday service', imageUrl: '/Gallery_images/sunday service/sunday_img_2.jpg' },
      { title: 'Praise and Fellowship', category: 'sunday service', imageUrl: '/Gallery_images/sunday service/sunday_img_3.jpg' },
      { title: 'Word of God Ministration', category: 'sunday service', imageUrl: '/Gallery_images/sunday service/sunday_img_4.jpg' },
      { title: 'Sunday School Joy', category: 'kids', imageUrl: '/Gallery_images/Kids/kids_image_1.jpg' },
      { title: 'Children Bible Activity', category: 'kids', imageUrl: '/Gallery_images/Kids/kids_image_2.jpg' },
      { title: 'Kids Action Songs', category: 'kids', imageUrl: '/Gallery_images/Kids/kids_image_3.jpg' },
      { title: 'Youth Fellowship Gathering', category: 'youth', imageUrl: '/Gallery_images/Youth/youth_img_1.jpg' },
      { title: 'Young Believers in Praise', category: 'youth', imageUrl: '/Gallery_images/Youth/youth_img_2.jpg' },
      { title: 'Youth Retreat & Prayer', category: 'youth', imageUrl: '/Gallery_images/Youth/youth_img_3.jpg' },
      { title: 'Village Gospel Outreach', category: 'outreach', imageUrl: '/Gallery_images/outreach/outreach_img_1.jpg' },
      { title: 'Community Blessing Service', category: 'outreach', imageUrl: '/Gallery_images/outreach/outreach_img_2.jpg' },
      { title: 'Serving the Needy', category: 'outreach', imageUrl: '/Gallery_images/outreach/outreach_img_3.jpg' },
      { title: 'Christmas Carol Evening', category: 'christmas', imageUrl: '/Gallery_images/christmas/xmas_img_1.jpg' },
      { title: 'Nativity Play Celebration', category: 'christmas', imageUrl: '/Gallery_images/christmas/xmas_img_2.jpg' },
      { title: 'Christmas Service Joy', category: 'christmas', imageUrl: '/Gallery_images/christmas/xmas_img_3.jpg' },
      { title: 'Candlelight Service', category: 'christmas', imageUrl: '/Gallery_images/christmas/xmas_img_4.jpg' },
      { title: 'Choir Christmas Presentation', category: 'christmas', imageUrl: '/Gallery_images/christmas/xmas_img_5.jpg' },
      { title: 'Community Christmas Feast', category: 'christmas', imageUrl: '/Gallery_images/christmas/xmas_img_6.jpg' },
      { title: 'Christmas Greetings & Gifts', category: 'christmas', imageUrl: '/Gallery_images/christmas/xmas_img_7.jpg' },
      { title: 'Year-End Gratitude', category: 'christmas', imageUrl: '/Gallery_images/christmas/xmas_img_8.jpg' },
      { title: 'Annual Church Conference', category: 'special events', imageUrl: '/Gallery_images/special events/special_img_1.jpg' },
      { title: 'Guest Speaker Revival Night', category: 'special events', imageUrl: '/Gallery_images/special events/special_img_2.jpg' },
      { title: 'Holy Ghost Anointing Service', category: 'special events', imageUrl: '/Gallery_images/special events/special_img_3.jpg' },
      { title: 'Special Thanksgiving Day', category: 'special events', imageUrl: '/Gallery_images/special events/special_img_4.jpg' },
      { title: 'Leadership Dedication', category: 'special events', imageUrl: '/Gallery_images/special events/special_img_5.jpg' }
    ];

    for (let i = 0; i < galleryItems.length; i++) {
      await prisma.galleryImage.create({
        data: {
          ...galleryItems[i],
          order: i + 1
        }
      });
    }
    console.log(`✅ Seeded ${galleryItems.length} gallery images.`);
  }

  // 6. Seed Sermons
  const existingSermons = await prisma.sermon.count();
  if (existingSermons === 0) {
    const sermonsData = [
      {
        title: 'Walking in the Anointing of the Holy Spirit',
        description: 'Discover how the presence and power of the Holy Spirit empowers believers to overcome obstacles and live with boldness in their daily walk with Christ.',
        speaker: 'Pastor Amal M. Augustine',
        date: new Date('2025-01-12T09:30:00Z'),
        category: 'Sunday Service',
        type: 'YOUTUBE',
        mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Unshakable Faith in Troubled Times',
        description: 'A powerful message on anchoring our hope in God’s unchanging promises based on Psalm 91:14. Discover how to trust God through every storm.',
        speaker: 'Pastor Amal M. Augustine',
        date: new Date('2025-01-19T09:30:00Z'),
        category: 'Faith & Prayer',
        type: 'YOUTUBE',
        mediaUrl: 'https://www.youtube.com/watch?v=7wtfhZwyrcc',
        thumbnailUrl: 'https://img.youtube.com/vi/7wtfhZwyrcc/hqdefault.jpg',
        isFeatured: false,
        isPublished: true
      },
      {
        title: 'The Grace that Transforms Lives',
        description: 'Exploring Ephesians 2:8-10 and understanding how God’s unmerited favor gives us a brand new beginning, purpose, and eternal security.',
        speaker: 'Pastor Amal M. Augustine',
        date: new Date('2025-01-26T09:30:00Z'),
        category: 'Grace & Salvation',
        type: 'YOUTUBE',
        mediaUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
        thumbnailUrl: 'https://img.youtube.com/vi/2Vv-BfVoq4g/hqdefault.jpg',
        isFeatured: false,
        isPublished: true
      }
    ];

    for (const sermon of sermonsData) {
      await prisma.sermon.create({ data: sermon });
    }
    console.log(`✅ Seeded ${sermonsData.length} sermons.`);
  }

  // 9. Seed Monthly Promise Verses
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const monthlyVersesData = [
    {
      month: currentMonth,
      year: currentYear,
      verseText: '“The Lord will guide you always; he will satisfy your needs in a sun-scorched land and will strengthen your frame.”',
      reference: 'Isaiah 58:11',
      isActive: true
    },
    {
      month: currentMonth === 1 ? 12 : currentMonth - 1,
      year: currentMonth === 1 ? currentYear - 1 : currentYear,
      verseText: '“Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.”',
      reference: 'Proverbs 3:5-6',
      isActive: true
    }
  ];

  for (const mv of monthlyVersesData) {
    await prisma.monthlyVerse.upsert({
      where: {
        month_year: {
          month: mv.month,
          year: mv.year
        }
      },
      update: {
        verseText: mv.verseText,
        reference: mv.reference,
        isActive: mv.isActive
      },
      create: mv
    });
  }
  console.log(`✅ Seeded ${monthlyVersesData.length} monthly promise verses.`);

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
