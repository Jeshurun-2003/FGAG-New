const prisma = require('../config/db');

const defaultSettings = {
  site_title: 'Friends Garden AG Church',
  hero_title: 'Friends Garden AG Church',
  hero_subtitle: 'A Place to Belong, Believe, and Become.',
  hero_youtube_url: 'https://youtube.com/@lifeparktv?feature=shared',
  hero_bg_image: '/images/church_inside_2.jpg',

  welcome_celebrate_desc: 'We worship our Heavenly Father with thankfulness and reverence.',
  welcome_grow_desc: "We grow in love, unity, and knowledge of God's Word together.",
  welcome_uplift_desc: 'We learn from each other and live out God’s will with joy.',
  welcome_footer_text: "Whether you're new or seeking deeper connection, you're always welcome here. We're a family growing in faith and sharing Christ’s love with joy.",

  promise_year: '2025',
  promise_verse: '"Because he loves me,” says the Lord, “I will rescue him; I will protect him, for he acknowledges my name."',
  promise_ref: '— Psalm 91:14',

  pastor_welcome_title: 'A Warm Welcome from Our Pastor',
  pastor_welcome_message: "Greetings in the precious name of our Lord and Savior Jesus Christ!\n\nAt Friends Garden A.G Church, we believe that every person is valued, loved, and called by God for a purpose. It’s our joy to welcome you into a place where you can grow in faith, connect in fellowship, and experience the transforming power of God’s Word.\n\nWe invite you to join us in worship, serve alongside us, and discover the abundant life found in Christ. May you be blessed, strengthened, and encouraged as you journey with us in faith.",
  pastor_name: 'Amal M. Augustine',
  pastor_role: 'Senior Pastor, Friends Garden A.G Church',
  pastor_image: '/images/Pastor_pic.jpg',

  app_title: '📖 Uvamaigal – Bible Short Stories App',
  app_desc: 'Uvamaigal is a meaningful app developed by Pastor Amal M. Augustine, filled with impactful short stories rooted in biblical teachings. These inspiring parables make spiritual lessons easy to grasp.\n\nWhether you’re reading personally or teaching others, Uvamaigal helps bring God’s Word alive in a simple, memorable, and heart-touching way.',
  app_playstore_url: 'https://play.google.com/store/apps/details?id=com.gnanadurai.uvamaigal',
  app_image: '/images/uvamaigal.jpg',

  contact_address: 'Friends Garden A.G church, Near Keezhvallam Railway Gate, Thaikal Via.Kollidam - 609102, Mayiladuthurai District',
  contact_email: 'kollidamag@gmail.com',
  contact_phone: '+91 98656 81983',
  contact_hours: 'Mon–Fri: 10am–6pm',
  contact_map_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.2444780831706!2d79.7227746!3d11.316832999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a54dd02183b6739%3A0x10498d09bef5eb5c!2sAssemblies%20of%20God%20Church!5e0!3m2!1sen!2sin!4v1752774351992!5m2!1sen!2sin',
  contact_map_link: 'https://goo.gl/maps/kLvnhfWSPSwtAb619',

  social_instagram: 'https://instagram.com',
  social_facebook: 'https://facebook.com',
  social_twitter: 'https://twitter.com',
  social_whatsapp: 'https://whatsapp.com',

  about_verse: '“Upon this rock I will build my church...” — Matthew 16:18',
  about_story: "Friends Garden A.G Church is more than just a building — it’s a family of believers united in Christ. Rooted in God's Word and guided by the Holy Spirit, our church exists to glorify God, preach the Gospel, and serve the world with love and compassion. We are a welcoming community where faith grows, lives are transformed, and Jesus is the center of everything we do. Whether you're seeking hope, healing, or a place to belong, you are welcome here.\n\nAt Friends Garden AG Church, we believe the church is not just a place you go — it’s a family you belong to. We are a vibrant, Spirit-led community that seeks to reflect the love of Christ in all we do.\n\nOur foundation is built on the unchanging truth of God's Word. We believe the Bible is alive and powerful, guiding us in every step of life. Through prayer, worship, and discipleship, we grow together in faith and purpose. We exist not only to worship but to serve. Our church is active in outreach, missions, and community care.",
  pastor_family_image: "/images/Pastor's_Family_Pic.jpg",
  pastor_bio: "Pastor Amal M. Augustine is a servant leader, fully committed to the Lord’s calling. He is blessed with his wife Jasmine Shalini and two daughters — Joy Malar and Doris Mahima.\n\nHe holds a B.Th from Madras A.G. Bible College, Saidapet, Chennai, and a M.A.B.S from Hindustan Bible Institute, Purasaiwakkam, Chennai. With nearly 20 years of full-time ministry experience, he has served in multiple regions and has led Friends Garden A.G. Church for over 6 years.",

  donate_account_name: 'ASSEMBLY OF GOD KOLLIDAM',
  donate_account_number: '0796053000004801',
  donate_ifsc: 'SIBL0000796',
  donate_micr: '609059002',
  donate_swift: 'SOININ55XXX'
};

// Get all settings formatted as a key-value object for public consumption
const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap = { ...defaultSettings };

    if (settings && settings.length > 0) {
      settings.forEach((s) => {
        settingsMap[s.key] = s.value;
      });
    }

    res.json({
      success: true,
      settings: settingsMap
    });
  } catch (err) {
    next(err);
  }
};

// Get settings for admin, optionally filtered by group
const getAdminSettings = async (req, res, next) => {
  try {
    const { group } = req.query;
    const where = group ? { group } : {};
    const settings = await prisma.siteSetting.findMany({ where, orderBy: { key: 'asc' } });

    res.json({
      success: true,
      settings
    });
  } catch (err) {
    next(err);
  }
};

// Update multiple settings at once (array of { key, value, group } or key-value object)
const updateSettings = async (req, res, next) => {
  try {
    const { settings } = req.body;

    if (!settings) {
      return res.status(400).json({ success: false, message: 'Settings payload is required.' });
    }

    const updates = [];

    if (Array.isArray(settings)) {
      for (const item of settings) {
        if (item.key) {
          updates.push(
            prisma.siteSetting.upsert({
              where: { key: item.key },
              update: {
                value: String(item.value ?? ''),
                ...(item.group && { group: item.group })
              },
              create: {
                key: item.key,
                value: String(item.value ?? ''),
                group: item.group || 'general'
              }
            })
          );
        }
      }
    } else if (typeof settings === 'object') {
      for (const [key, value] of Object.entries(settings)) {
        updates.push(
          prisma.siteSetting.upsert({
            where: { key },
            update: { value: String(value ?? '') },
            create: {
              key,
              value: String(value ?? ''),
              group: 'general'
            }
          })
        );
      }
    }

    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    const allSettings = await prisma.siteSetting.findMany();
    const settingsMap = { ...defaultSettings };
    allSettings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    res.json({
      success: true,
      message: 'Settings updated successfully.',
      settings: settingsMap
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicSettings,
  getAdminSettings,
  updateSettings
};
