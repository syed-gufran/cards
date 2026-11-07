import { CardSideDesign, CardTextElement, SuitePageKey } from '@/types/wedding-card';

export type SupportedLanguage = 'hi' | 'en' | 'ur' | 'sa' | 'pa';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    description: 'Contemporary & Royal English phrasings',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    description: 'Auspicious Devanagari wording & Shlokas',
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    flag: '🇵🇰',
    description: 'Bismillah & poetic Nikah / Walima phrasings',
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    flag: '🕉️',
    description: 'Vedic Mangalashtak & Vivah Muhurtha',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: 'ੴ',
    description: 'Gurmukhi Ik Onkar & Anand Karaj wording',
  },
];

// Cultural wording dictionaries by category and target language
const TRANSLATION_MAPS: Record<SupportedLanguage, {
  religious: string[];
  host: string;
  joiner: string;
  date: string;
  venue: string;
  rsvp: string;
  bridePrefix?: string;
  groomPrefix?: string;
  itineraryHeader: string;
  itineraryEvents: string;
  baraatVisitingHeader: string;
  baraatVisitingBody: string;
}> = {
  hi: {
    religious: [
      '॥ श्री गणेशाय नमः ॥',
      'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      'मंगलम् भगवान विष्णुः मंगलम् गरुडध्वजः।\nमंगलम् पुण्डरीकाक्षः मंगलाय तनो हरिः॥',
      'मातृ-पितृ एवं कुलदेवता के शुभाशीर्वाद से',
    ],
    host: 'मान्यवर, परमपिता परमात्मा की असीम अनुकम्पा एवं पूज्य पूर्वजों के आशीर्वाद से\nहमारे प्रिय सुपुत्र / सुपुत्री के शुभ विवाह के पावन अवसर पर\nआपको सपरिवार सादर आमंत्रित करते हैं।',
    joiner: '— संग परिणय सूत्र —',
    date: 'दिनांक: रविवार, १४ दिसम्बर २०२६\nशुभ मुहूर्त: सायं ०७:३० बजे',
    venue: 'विवाह स्थल: द ग्रांड पैलेस एवं राजसी लॉन्स, सिविल लाइन्स, जयपुर',
    rsvp: 'दर्शनाभिलाषी: समस्त परिवारजन एवं स्नेहीजन\nविनीत: शर्मा एवं सिंघानिया परिवार',
    bridePrefix: 'सौ. ',
    groomPrefix: 'चि. ',
    itineraryHeader: 'शुभ मांगलिक कार्यक्रम',
    itineraryEvents: 'मेहंदी एवं संगीत संध्या\nशनिवार, १३ दिसम्बर | सायं ०७:०० बजे\n\nबारात आगमन एवं पाणिग्रहण संस्कार\nरविवार, १४ दिसम्बर | सायं ०६:३० बजे\n\nप्रतिभोज एवं आशीर्वाद समारोह\nसोमवार, १५ दिसम्बर | सायं ०८:०० बजे',
    baraatVisitingHeader: 'बारात स्वागत एवं शुभ प्रवेश पत्रिका',
    baraatVisitingBody: 'ससम्मान आमंत्रित: बारात स्वागत एवं शुभ विवाह संस्कार\nस्थल: द ग्रांड पैलेस मुख्य द्वार, जयपुर | सायं ०६:३० बजे',
  },
  en: {
    religious: [
      '॥ Shree Ganeshay Namah ॥',
      'With the heavenly blessings of the Almighty & our beloved Ancestors',
      'In the Name of the Divine',
      'Celebrating Love & Sacred Traditions',
    ],
    host: 'Together with their families,\nrequest the pleasure of your company and benign blessings\non the auspicious wedding ceremony of their beloved children',
    joiner: '— weds —',
    date: 'Sunday, 14th December 2026\nAuspicious Muhurtham: 07:30 PM',
    venue: 'The Grand Palace & Courtyard, Civil Lines, Jaipur',
    rsvp: 'RSVP: With Best Compliments from Relatives & Friends\nContact: +91 98765 43210',
    bridePrefix: '',
    groomPrefix: '',
    itineraryHeader: 'WEDDING CELEBRATIONS & CEREMONIES',
    itineraryEvents: 'MEHENDI & SANGEET NIGHT\nSaturday, 13th Dec | 07:00 PM\n\nBARAAT & VIVAH SANSKAR\nSunday, 14th Dec | 06:30 PM Onwards\n\nGRAND RECEPTION\nMonday, 15th Dec | 08:00 PM',
    baraatVisitingHeader: 'BARAAT SWAGAT & ENTRY PASS',
    baraatVisitingBody: 'Cordially invites you to the Baraat Swagat & Reception\nVenue: Grand Palace Royal Courtyard | 06:30 PM Sharp',
  },
  ur: {
    religious: [
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
      'با فضل و کرم ربِ جلیل و دعائے والدین',
    ],
    host: 'جناب عالی، اللہ تعالیٰ کے فضل و کرم سے ہماری پیاری صاحبزادی / صاحبزادے کے پرمسرت نکاح و دعوتِ ولیمہ کے مبارک موقع پر آپ کی مع اہل و عیال شرکت کے متمنی ہیں۔',
    joiner: '— ہمراہ —',
    date: 'بتاریخ: بروز اتوار، ۱۴ دسمبر ۲۰۲۶\nبوقت: شام ۰۷:۳० بجے',
    venue: 'مقام: دی گرینڈ پیلس اینڈ شاہی لان، سول لائنز، جے پور',
    rsvp: 'چشم براہ: جملہ عزیزان و اقارب و مخلصین\nمنتظرین: خان و صدیقی خاندان',
    bridePrefix: 'عروسہ: ',
    groomPrefix: 'نوشہ: ',
    itineraryHeader: 'پروگرام تقاریبِ مسرت',
    itineraryEvents: 'مہندی کی رات\nبروز ہفتہ، ۱۳ دسمبر | شام ۰۷:०० بجے\n\nتقریبِ نکاح و ایجاب و قبول\nبروز اتوار، ۱۴ دسمبر | شام ۰۶:३० بجے\n\nدعوتِ ولیمہ\nبروز پیر، ۱۵ دسمبر | رات ०८:०० بجے',
    baraatVisitingHeader: 'استقبالیہ کارڈ و شرکت نامہ',
    baraatVisitingBody: 'استقبالِ بارات و تقریبِ نکاح میں معزز مہمان کی تشریف آوری کے متمنی ہیں\nمقام: شاہی لان، دی گرینڈ پیلس',
  },
  sa: {
    religious: [
      '॥ श्री गणेशाय नमः ॥',
      'मंगलम् भगवान विष्णुः मंगलम् गरुडध्वजः।\nमंगलम् पुण्डरीकाक्षः मंगलाय तनो हरिः॥',
      'ॐ स्वस्ति न इन्द्रो वृद्धश्रवाः स्वस्ति नः पूषा विश्ववेदाः।',
      'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।',
    ],
    host: 'सस्नेहं सादरं च निमंत्रणम्। परमपिता परमेश्वरस्य कृपया कुलदेवतायाः आशीर्वादेन च\nअस्माकं प्रिय सन्ततेः पाणिग्रहण संस्कारे भवतः सपरिवारम् उपस्थितिः प्रार्थ्यते।',
    joiner: '— पाणिग्रहण संस्कारः —',
    date: 'मार्गशीर्ष शुक्ल पक्ष, रविवासरः | १४ दिसम्बर २०२६\nशुभ विवाह लग्न मुहूर्त: सायं ०७:३०',
    venue: 'विवाह स्थानम्: द ग्रांड प्रासादम् एवं राजसी वाटिका, जयपुरम्',
    rsvp: 'विनीताः: सर्व आत्मीयजनाः एवं स्नेहीगणाः\nशर्मा एवं सिंघानिया कुलम्',
    bridePrefix: 'आयु. ',
    groomPrefix: 'चि. ',
    itineraryHeader: 'शुभ मांगलिक संस्काराः',
    itineraryEvents: 'हरिद्रा लेपनम् एवं संगीत संध्या\nशनिवासरः, १३ दिसम्बर | सायं ०७:००\n\nवरयात्रा स्वागतम् एवं शुभ विवाह संस्कारः\nरविवासरः, १४ दिसम्बर | सायं ०६:३०\n\nआशीर्वाद समारोहः एवं प्रीतिभोजः\nसोमवासरः, १५ दिसम्बर | सायं ०८:००',
    baraatVisitingHeader: 'वरयात्रा स्वागतम् एवं प्रवेश पत्रिका',
    baraatVisitingBody: 'वरयात्रा स्वागतार्थं सप्रेम आमंत्रणम्\nस्थानम्: मुख्य प्रासाद द्वारम्, जयपुरम्',
  },
  pa: {
    religious: [
      'ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥',
      'ਸੰਜੋਗੁ ਲਿਖਿਆ ਸੋਈ ਫਲੁ ਪਾਇਆ ॥',
      'ਲਖ ਖੁਸੀਆ ਪਾਤਿਸਾਹੀਆ ਜੇ ਸਤਿਗੁਰੁ ਨਦਰਿ ਕਰੇਇ ॥',
    ],
    host: 'ਸਤਿਕਾਰਯੋਗ ਸੱਜਣੋ, ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਦੀ ਅਪਾਰ ਕਿਰਪਾ ਸਦਕਾ\nਸਾਡੇ ਪਿਆਰੇ ਬੱਚਿਆਂ ਦੇ ਆਨੰਦ ਕਾਰਜ ਮੌਕੇ\nਆਪ ਜੀ ਨੂੰ ਪਰਿਵਾਰ ਸਮੇਤ ਸ਼ਾਮਲ ਹੋਣ ਦਾ ਨਿੱਘਾ ਸੱਦਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।',
    joiner: '— ਸੰਗ ਆਨੰਦ ਕਾਰਜ —',
    date: 'ਐਤਵਾਰ, 14 ਦਸੰਬਰ 2026\nਸ਼ੁਭ ਆਨੰਦ ਕਾਰਜ: ਸਵੇਰੇ 10:30 ਵਜੇ (ਗੁਰੂ ਕਾ ਲੰਗਰ)',
    venue: 'ਸਥਾਨ: ਗੁਰਦੁਆਰਾ ਸ੍ਰੀ ਗੁਰੂ ਸਿੰਘ ਸਭਾ / ਦ ਗ੍ਰੈਂਡ ਪੈਲੇਸ, ਜੈਪੁਰ',
    rsvp: 'ਦਰਸ਼ਨਾਭਿਲਾਸ਼ੀ: ਸਮੂਹ ਪਰਿਵਾਰ ਅਤੇ ਮਿੱਤਰ\nਵਿਨੀਤ: ਆਹਲੂਵਾਲੀਆ ਅਤੇ ਗਿੱਲ ਪਰਿਵਾਰ',
    bridePrefix: '',
    groomPrefix: '',
    itineraryHeader: 'ਵਿਆਹ ਸਮਾਗਮਾਂ ਦਾ ਵੇਰਵਾ',
    itineraryEvents: 'ਮਾਈਆਂ ਅਤੇ ਸੰਗੀਤ ਰਾਤ\nਸ਼ਨੀਵਾਰ, 13 ਦਸੰਬਰ | ਸ਼ਾਮ 07:00 ਵਜੇ\n\nਬਰਾਤ ਆਗਮਨ ਅਤੇ ਆਨੰਦ ਕਾਰਜ\nਐਤਵਾਰ, 14 ਦਸੰਬਰ | ਸਵੇਰੇ 10:30 ਵਜੇ\n\nਗ੍ਰੈਂਡ ਰਿਸੈਪਸ਼ਨ\nਸੋਮਵਾਰ, 15 ਦਸੰਬਰ | ਸ਼ਾਮ 08:00 ਵਜੇ',
    baraatVisitingHeader: 'ਬਰਾਤ ਸਵਾਗਤ ਅਤੇ ਐਂਟਰੀ ਪਾਸ',
    baraatVisitingBody: 'ਬਰਾਤ ਸਵਾਗਤ ਸਮਾਗਮ ਵਿੱਚ ਆਪ ਜੀ ਦਾ ਨਿੱਘਾ ਸੁਆਗਤ ਹੈ\nਸਥਾਨ: ਦ ਗ੍ਰੈਂਡ ਪੈਲੇਸ ਲਾਅਨਜ਼, ਜੈਪੁਰ',
  },
};

/**
 * Convert a single CardSideDesign elements to target language
 */
export function convertSideDesignLanguage(
  design: CardSideDesign,
  targetLang: SupportedLanguage
): CardSideDesign {
  const dict = TRANSLATION_MAPS[targetLang] || TRANSLATION_MAPS.hi;

  const updatedElements = design.elements.map((el) => {
    let updatedText = el.text;
    let updatedFont = el.fontFamily || 'serif';
    let updatedLetterSpacing = el.letterSpacing;

    if (targetLang === 'hi' || targetLang === 'sa') {
      updatedFont = 'serif';
      if (updatedLetterSpacing && updatedLetterSpacing > 1.5) {
        updatedLetterSpacing = 0.5; // Devanagari script works best with tighter letter spacing
      }
    } else if (targetLang === 'ur') {
      updatedFont = 'serif';
      if (updatedLetterSpacing && updatedLetterSpacing > 1) {
        updatedLetterSpacing = 0.2;
      }
    }

    // Translate based on element category or identifier
    switch (el.category) {
      case 'religious':
        // Replace with authentic invocation in target language
        updatedText = dict.religious[0];
        break;

      case 'host':
        updatedText = dict.host;
        break;

      case 'couple':
        // If it's a joiner
        if (
          el.text.toLowerCase().includes('weds') ||
          el.text.includes('—') ||
          el.text.includes('&') ||
          el.text.includes('संग') ||
          el.text.includes('हमराह') ||
          el.text.includes('with')
        ) {
          updatedText = dict.joiner;
        }
        break;

      case 'event':
        // If it's the main wedding date / time
        if (
          el.text.toLowerCase().includes('december') ||
          el.text.includes('२०२६') ||
          el.text.includes('2026') ||
          el.text.toLowerCase().includes('sunday') ||
          el.text.includes('रविवार') ||
          el.text.includes('اتوار') ||
          el.text.includes('ਸ਼ੁਭ')
        ) {
          updatedText = dict.date;
        } else if (
          el.text.toLowerCase().includes('sangeet') ||
          el.text.toLowerCase().includes('celebration') ||
          el.text.includes('संगीत') ||
          el.text.includes('مہندی')
        ) {
          updatedText = dict.itineraryEvents;
        }
        break;

      case 'venue':
        updatedText = dict.venue;
        break;

      case 'rsvp':
        updatedText = dict.rsvp;
        break;

      case 'header':
        if (
          el.text.toLowerCase().includes('baraat') ||
          el.text.toLowerCase().includes('pass') ||
          el.text.includes('बारात')
        ) {
          updatedText = dict.baraatVisitingHeader;
        } else {
          updatedText = dict.itineraryHeader;
        }
        break;

      default:
        // Specific checks for baraat pass or custom text
        if (el.text.toLowerCase().includes('baraat') || el.text.includes('स्वागत')) {
          updatedText = dict.baraatVisitingBody;
        }
        break;
    }

    return {
      ...el,
      text: updatedText,
      fontFamily: updatedFont,
      letterSpacing: updatedLetterSpacing,
    };
  });

  return {
    ...design,
    elements: updatedElements,
  };
}

/**
 * Convert all pages in a multi-page suite to the target language
 */
export function convertSuitePagesLanguage(
  suitePages: Record<SuitePageKey, CardSideDesign>,
  targetLang: SupportedLanguage
): Record<SuitePageKey, CardSideDesign> {
  const result = {} as Record<SuitePageKey, CardSideDesign>;

  for (const key of Object.keys(suitePages) as SuitePageKey[]) {
    result[key] = convertSideDesignLanguage(suitePages[key], targetLang);
  }

  return result;
}

