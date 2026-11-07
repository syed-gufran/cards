export interface WordingCategory {
  faith: 'Hindu' | 'Muslim' | 'Sikh' | 'Contemporary' | 'South Indian';
  shlokasAndInvocations: Array<{
    title: string;
    script: 'devanagari' | 'arabic' | 'gurmukhi' | 'english';
    originalText: string;
    transliteration?: string;
    translation?: string;
  }>;
  invitationPhrasings: Array<{
    label: string;
    hostText: string;
    inviteText: string;
    coupleJoiner: string;
  }>;
  eventDefaults: Array<{
    name: string;
    defaultTime: string;
    dressCode: string;
  }>;
}

export const INDIAN_WORDING_LIBRARY: Record<string, WordingCategory> = {
  Hindu: {
    faith: 'Hindu',
    shlokasAndInvocations: [
      {
        title: 'Shree Ganeshay Namah (Classic)',
        script: 'devanagari',
        originalText: '॥ श्री गणेशाय नमः ॥',
        translation: 'Salutations to Lord Ganesha, the remover of all obstacles',
      },
      {
        title: 'Vakratunda Mahakaya Shloka',
        script: 'devanagari',
        originalText: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
        translation: 'O Lord with the curved trunk and immense aura, please make all my endeavors free of obstacles forever.',
      },
      {
        title: 'Mangalam Bhagwan Vishnu',
        script: 'devanagari',
        originalText: 'मंगलम् भगवान विष्णुः मंगलम् गरुडध्वजः।\nमंगलम् पुण्डरीकाक्षः मंगलाय तनो हरिः॥',
        translation: 'All auspiciousness to Lord Vishnu, bearer of Garuda, the lotus-eyed Lord.',
      },
      {
        title: 'Radha Krishna Prema Shloka',
        script: 'devanagari',
        originalText: '॥ श्री राधाकृष्णाय नमः ॥',
        translation: 'Salutations to the divine eternal union of Sri Radha and Krishna.',
      },
      {
        title: 'English Auspicious Opening',
        script: 'english',
        originalText: 'With the heavenly blessings of the Almighty & our beloved Ancestors',
        translation: 'Blessing invocations for contemporary cards',
      },
    ],
    invitationPhrasings: [
      {
        label: 'Traditional Parents Host',
        hostText: 'Mrs. Sunita & Mr. Rajesh Sharma\nrequest the honour of your benign presence and gracious blessings',
        inviteText: 'on the auspicious wedding ceremony of their beloved daughter',
        coupleJoiner: 'with',
      },
      {
        label: 'Grandparents & Family Host',
        hostText: 'With the loving blessings of Smt. Kaushalya & Late Shri Ramnath Kapoor,\nMr. & Mrs. Deepak Kapoor solicit your esteemed company',
        inviteText: 'to celebrate the marriage of their granddaughter',
        coupleJoiner: 'taking seven sacred vows with',
      },
      {
        label: 'Contemporary Elegant Phrasing',
        hostText: 'Together with their families,\nwe joyfully invite you to share our happiness and love',
        inviteText: 'as we exchange vows and embark on a new journey together',
        coupleJoiner: 'and',
      },
    ],
    eventDefaults: [
      { name: 'Haldi & Chuda Ceremony', defaultTime: '10:00 AM onwards', dressCode: 'Yellow & Mustard Traditional Attire' },
      { name: 'Mehendi & Sangeet Night', defaultTime: '06:30 PM onwards', dressCode: 'Indo-Western & Vibrant Festive Wear' },
      { name: 'Baraat & Varmala', defaultTime: '07:00 PM onwards', dressCode: 'Royal Ethnic / Sherwani & Lehengas' },
      { name: 'Saat Pheras (Wedding Muhurat)', defaultTime: '10:30 PM (Auspicious Tithi)', dressCode: 'Traditional Splendor' },
      { name: 'Grand Wedding Reception', defaultTime: '07:30 PM onwards', dressCode: 'Black Tie & Formal Evening Couture' },
    ],
  },

  Muslim: {
    faith: 'Muslim',
    shlokasAndInvocations: [
      {
        title: 'Bismillah-ir-Rahman-ir-Rahim (Calligraphy)',
        script: 'arabic',
        originalText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
      },
      {
        title: 'Surah Ar-Rum (Verse 21)',
        script: 'english',
        originalText: '"And of His signs is that He created for you mates from among yourselves, that you may find tranquility in them; and He placed between you love and mercy."',
        translation: 'The Holy Quran (Surah Ar-Rum 30:21)',
      },
      {
        title: 'Dua for Bride and Groom',
        script: 'arabic',
        originalText: 'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
        translation: 'May Allah bless you, shower His blessings upon you, and unite you both in goodness.',
      },
      {
        title: 'In the Name of Allah (English Opening)',
        script: 'english',
        originalText: 'In the name of Allah, Most Compassionate, Most Merciful',
        translation: 'Opening for English Nikah invitations',
      },
    ],
    invitationPhrasings: [
      {
        label: 'Traditional Nikah Invitation',
        hostText: 'Alhaj & Begum Mohammed Farooq Khan\ncordially invite you and your family to grace the auspicious Nikah Ceremony',
        inviteText: 'of their beloved daughter',
        coupleJoiner: 'with',
      },
      {
        label: 'Walima / Dawat-e-Walima Host',
        hostText: 'Dr. & Mrs. Tariq Siddiqui\nrequest the pleasure of your company at the Dawat-e-Walima',
        inviteText: 'celebrating the blessed marriage of their son',
        coupleJoiner: 'with his bride',
      },
      {
        label: 'Graceful Royal Nikah',
        hostText: 'Seeking the blessings of Allah Subhan-o-Tala,\nthe families of Khan & Qureshi solicit your presence and Duas',
        inviteText: 'as their children unite in sacred matrimony',
        coupleJoiner: 'and',
      },
    ],
    eventDefaults: [
      { name: 'Manjha / Mayun (Haldi)', defaultTime: '11:00 AM onwards', dressCode: 'Sunshine Yellows & Floral Pastel' },
      { name: 'Mehndi ki Raat', defaultTime: '07:00 PM onwards', dressCode: 'Traditional Festive Ethnic' },
      { name: 'Nikah Ceremony & Qubool Hai', defaultTime: '08:00 PM onwards', dressCode: 'Sherwanis, Gararas & Regal Ethnic' },
      { name: 'Dawat-e-Walima', defaultTime: '08:30 PM onwards', dressCode: 'Formal Evening & Royal Couture' },
    ],
  },

  Sikh: {
    faith: 'Sikh',
    shlokasAndInvocations: [
      {
        title: 'Ik Onkar Satgur Prasad',
        script: 'gurmukhi',
        originalText: 'ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥',
        translation: 'One Supreme Reality, realized through the grace of the True Guru.',
      },
      {
        title: 'Lakh Khushiyan Patshaiyan',
        script: 'gurmukhi',
        originalText: 'ਲਖ ਖੁਸੀਆ ਪਾਤਿਸਾਹੀਆ ਜੇ ਸਤਿਗੁਰੁ ਨਦਰਿ ਕਰੇਇ ॥',
        translation: 'All happiness and kingdoms are attained if the True Guru bestows His grace.',
      },
      {
        title: 'Sanjog Likhya Soee Phal Paya',
        script: 'gurmukhi',
        originalText: 'ਸੰਜੋਗੁ ਲਿਖਿਆ ਸੋਈ ਫਲੁ ਪਾਇਆ ॥',
        translation: 'The union pre-ordained by divine destiny has blossomed.',
      },
      {
        title: 'Sikh Marriage Blessing (English)',
        script: 'english',
        originalText: 'By the divine grace of Sri Waheguru Ji',
        translation: 'Opening invocation for Anand Karaj invitations',
      },
    ],
    invitationPhrasings: [
      {
        label: 'Traditional Anand Karaj Invitation',
        hostText: 'Sardar & Sardarni Gurpreet Singh Ahluwalia\nrequest the pleasure of your company for the auspicious Anand Karaj',
        inviteText: 'of their beloved daughter',
        coupleJoiner: 'with',
      },
      {
        label: 'Loving Family Host',
        hostText: 'With the divine grace of Sri Waheguru Ji and loving memories of our elders,\nthe Gill family joyfully solicits your presence and blessings',
        inviteText: 'on the wedding ceremony of their son',
        coupleJoiner: 'with his soulmate',
      },
    ],
    eventDefaults: [
      { name: 'Maiyan & Haldi', defaultTime: '10:30 AM onwards', dressCode: 'Festive Brights' },
      { name: 'Sangeet & Jago Night', defaultTime: '07:00 PM onwards', dressCode: 'Phulkaris, Kurta-Pajamas & Kurti Sets' },
      { name: 'Anand Karaj (Gurdwara Sahib)', defaultTime: '10:00 AM (Followed by Guru ka Langar)', dressCode: 'Modest Formal Attire (Heads Covered)' },
      { name: 'Grand Wedding Reception', defaultTime: '07:30 PM onwards', dressCode: 'Tuxedos, Bandhgalas & Regal Lehengas' },
    ],
  },

  'South Indian': {
    faith: 'South Indian',
    shlokasAndInvocations: [
      {
        title: 'Om Sri Maha Ganapataye Namaha',
        script: 'devanagari',
        originalText: '॥ ॐ श्री महागणपतये नमः ॥',
        translation: 'Reverence to the Supreme Lord Ganesha.',
      },
      {
        title: 'Kalyana Vaibhogam Invocation',
        script: 'english',
        originalText: '॥ Subhamasthu ॥ Sarve Jana Sukhino Bhavantu ॥',
        translation: 'May auspiciousness prevail. May all beings be blissful.',
      },
      {
        title: 'Lord Venkateswara Balaji Blessing',
        script: 'english',
        originalText: 'With the divine blessings of Lord Sri Venkateswara Swami and Sri Padmavathi Ammavaru',
        translation: 'Tirupati Balaji blessing prayer',
      },
    ],
    invitationPhrasings: [
      {
        label: 'Traditional Kalyanam Wording',
        hostText: 'Smt. Lakshmi & Sri K. Ramanathan\ncordially invite your gracious presence with family on the auspicious occasion of the Kalyanam',
        inviteText: 'of their daughter',
        coupleJoiner: 'with Chi.',
      },
      {
        label: 'Muhurtham Invitation',
        hostText: 'Soliciting your warm blessings and esteemed presence at the auspicious Muhurtham',
        inviteText: 'celebrating the divine union of',
        coupleJoiner: 'and',
      },
    ],
    eventDefaults: [
      { name: 'Vratham & Sumangali Prarthana', defaultTime: '07:30 AM onwards', dressCode: 'Traditional Silk Sarees & Dhotis' },
      { name: 'Oonjal & Nichayathartham (Engagement)', defaultTime: '06:00 PM onwards', dressCode: 'Festive Kanjivarams & Silk Shirts' },
      { name: 'Kalyana Muhurtham', defaultTime: '06:15 AM - 07:45 AM (Auspicious Lagnam)', dressCode: 'Sacred Madisar & Pattu Veshti' },
      { name: 'Reception & Feast', defaultTime: '06:30 PM onwards', dressCode: 'Formal Evening Wear' },
    ],
  },

  Contemporary: {
    faith: 'Contemporary',
    shlokasAndInvocations: [
      {
        title: 'Timeless Poetry',
        script: 'english',
        originalText: 'Two souls, one destiny. Two lives joined in eternal love and laughter.',
        translation: 'Modern poetic sentiment',
      },
      {
        title: 'Gratitude & Blessings',
        script: 'english',
        originalText: 'Because you have shared in our lives with your friendship and love, we invite you to join us as we begin our new life together.',
        translation: 'Warm personal invite',
      },
    ],
    invitationPhrasings: [
      {
        label: 'Couple Themselves Inviting',
        hostText: 'We invite you to share our happiness and joy as we exchange our wedding vows',
        inviteText: '',
        coupleJoiner: 'and',
      },
      {
        label: 'Both Families Welcoming',
        hostText: 'Together with their parents and families,\nrequest the pleasure of your company to celebrate the union of love and friendship',
        inviteText: '',
        coupleJoiner: 'and',
      },
    ],
    eventDefaults: [
      { name: 'Welcome Sundowner', defaultTime: '05:00 PM onwards', dressCode: 'Resort Chic / Pastels' },
      { name: 'Cocktail & Sangeet', defaultTime: '08:00 PM onwards', dressCode: 'Glamorous Evening Attire' },
      { name: 'Vows & Sunset Pheras', defaultTime: '05:30 PM (Golden Hour)', dressCode: 'Pastel Royal Formals' },
      { name: 'After Party', defaultTime: '11:00 PM till late', dressCode: 'Party Chic' },
    ],
  },
};

