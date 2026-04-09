/**
 * Seed script — blog posts with full article content.
 * Run: node lib/seed-blog.js
 * Safe to re-run — upserts by slug.
 */

import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in .env.local')
  process.exit(1)
}

const BlogPostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  tag: String,
  content: String,
  summary: String,
  readTime: Number,
  metaDescription: String,
  isPublished: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema)

const posts = [
  {
    slug: 'diabetics-foods-avoid-travel',
    title: '10 foods diabetics must avoid while traveling abroad',
    tag: 'DIABETES · TRAVEL',
    readTime: 5,
    isPublished: true,
    summary: 'Managing blood sugar while traveling is harder than at home. These 10 foods catch diabetic travelers off guard — and what to eat instead.',
    metaDescription: 'Traveling with diabetes? Discover 10 high-risk foods diabetics must avoid abroad, from hidden sugars in Asian sauces to airport food traps, plus safe alternatives.',
    content: `## 10 Foods Diabetics Must Avoid While Traveling Abroad

Managing blood sugar while traveling is harder than it looks. Your usual food environment disappears, portion sizes change dramatically, and unfamiliar cuisines contain hidden sugars and refined carbohydrates that can spike glucose levels fast. Here are the 10 foods that consistently catch diabetic travelers off guard — and what to reach for instead.

### 1. Teriyaki Sauce and Sweet Asian Glazes

Teriyaki glaze is essentially sugar dissolved in soy sauce and mirin. A single serving can contain 15–20g of added sugar — equivalent to 4 teaspoons. This applies to other sweet Asian sauces too: hoisin, char siu, and oyster sauce are all high-sugar. **Ask for:** Grilled protein without sauce, or a side of plain soy sauce (which contains little sugar). In Japan, yakitori with salt (shio) instead of tare is a good call.

### 2. White Rice in Large Portions

White rice is a staple across Asia, and portions are often enormous — Japanese teishoku sets, Thai fried rice dishes, and Indian thalis can contain 2–3 cups of rice. A cup of cooked white rice contains roughly 45g of carbohydrates. The GI is moderate (~65–70), but large portions make it high-glycemic. **Better:** Eat half-portions of rice with significant protein and vegetable accompaniment to slow absorption.

### 3. Bubble Tea and Sweet Drinks

Bubble tea, Thai iced tea, horchata, aguas frescas, and sweetened lassi are some of the most aggressively sugared drinks in the world. A large Thai iced tea can contain 50–70g of sugar. These are everywhere at tourist sites and airports. **Better:** Water, plain sparkling water, unsweetened green tea, or black coffee.

### 4. Airport Pastries and Packaged Snacks

Airports worldwide stock the same high-sugar, high-GI foods: croissants, muffins, cinnamon rolls, fruit cups in syrup, and "healthy" granola bars that are often just sugar and oats. When you're tired and hungry between flights, these are dangerous traps. **Better:** Hard-boiled eggs, plain nuts, cheese, or unsweetened protein bars. Pack your own snacks when possible — airline food is unreliable.

### 5. Mango Sticky Rice and Rice Desserts

Thai, Indonesian, and Filipino cuisines feature stunning dessert dishes built around glutinous (sticky) rice and fresh fruit — particularly mango sticky rice. Glutinous rice has a GI of 98 — essentially pure glucose. A single serving can contain 60–80g of rapidly digesting carbohydrates. **Better:** Fresh mango or tropical fruit without the rice, or a small taste shared with travel companions.

### 6. Roti, Naan, and White Flatbreads

South and Southeast Asian flatbreads — particularly roti canai in Malaysia, white naan in Indian restaurants, and paratha fried in ghee — are high-GI and often served in large portions at every meal. They are hard to avoid when they arrive automatically with curry dishes. **Better:** Tandoori-cooked proteins, dal, vegetable dishes without bread, or request a smaller portion.

### 7. Massaman and Peanut-Based Curries

Rich curries made with coconut milk, palm sugar, and starchy additions like potato or sweet potato (massaman curry is a classic example) combine high fat, high sugar, and high-GI carbohydrates. These are delicious but hit blood sugar hard. **Better:** Tom yum or tom kha (spicy sour soups — lower in carbohydrates), green or red curry with protein and vegetables over a smaller rice portion.

### 8. Buffet Breakfast at Hotels

Hotel buffet breakfasts are carbohydrate minefields: white toast, croissants, fresh orange juice, fruit jam, waffles, and sweetened cereals. Many business travelers eat this every morning on work trips, then wonder why their glucose readings are high by 10am. **Better:** Eggs (in any form), smoked salmon, Greek yogurt, cheese, tomatoes, avocado — all widely available at hotel buffets alongside the carbohydrate-heavy items.

### 9. Tropical Fruit in Large Quantities

Tropical fruits — mango, pineapple, papaya, lychee, and durian — are abundant and delicious in Southeast Asia. However, ripe tropical fruits are significantly higher in sugar than temperate fruits, and markets and hotel buffets offer them in huge portions. **Better:** Guava (GI ~12), dragon fruit, green mango, and papaya are relatively lower-GI options. Fresh coconut water contains natural sugars but in moderate amounts.

### 10. Local Sports Drinks and Energy Drinks

In hot destinations, it's tempting to reach for isotonic sports drinks — 100Plus in Malaysia, Pocari Sweat in Japan, and various energy drinks globally. Unless you are a serious endurance athlete exercising for 60+ minutes, these drinks are unnecessary sugar delivery systems. A 500ml sports drink contains roughly 30g of sugar. **Better:** Plain water plus a small pinch of salt in heat, or electrolyte tablets with no sugar added.

### The Most Important Rule

Always carry your medication and a clear list of your conditions in the local language of your destination. Restaurant staff and local pharmacists respond far better to written communication in their own language than to verbal requests in English.

*This article is for general information purposes only. It does not constitute medical advice. Always consult your doctor or diabetes specialist before making dietary changes or traveling internationally with a chronic condition.*`,
  },
  {
    slug: 'gluten-free-japan-guide',
    title: 'How to eat gluten-free in Japan — a complete guide',
    tag: 'GLUTEN-FREE · JAPAN',
    readTime: 7,
    isPublished: true,
    summary: 'Japan is the world\'s most challenging destination for gluten-free travelers — soy sauce is in everything. Here\'s how to navigate it safely.',
    metaDescription: 'Complete guide to eating gluten-free in Japan. Learn which dishes are safe, how to avoid soy sauce (shoyu) hidden in Japanese food, and key Japanese phrases for celiac travelers.',
    content: `## How to Eat Gluten-Free in Japan — A Complete Guide

Japan is one of the most rewarding travel destinations in the world — and one of the most challenging for gluten-free and celiac travelers. The reason is deceptively simple: soy sauce (shoyu) contains wheat, and it is used in virtually everything. This guide will help you navigate Japanese cuisine safely.

### Why Japan is Uniquely Challenging

In most countries, wheat appears in obvious forms — bread, pasta, pastries. In Japan, gluten hides in liquid form inside soy sauce, which is used as a flavor base in most cooked dishes, broths, dipping sauces, marinades, and glazes. Even dishes that appear to be grilled meat or vegetables are usually seasoned with soy sauce during cooking.

This means:

- Ramen — contains soy sauce in the broth
- Miso soup — contains both miso (usually includes barley) and sometimes soy sauce
- Yakitori — glazed with a tare sauce containing soy sauce
- Tempura dipping sauce (tentsuyu) — soy sauce based
- Gyoza — soy sauce dipping sauce, often soy in the filling
- Sushi rice — often seasoned with rice vinegar plus a small amount of soy sauce

### Your Most Important Tool: The Tamari Substitution

Tamari is a Japanese soy sauce made without wheat (or with very little wheat). It tastes nearly identical to regular shoyu. In any restaurant that has tamari, you can request it as a replacement. In larger cities, many restaurants — particularly sushi restaurants — stock tamari for foreign customers with allergies. Always ask: "グルテンフリーの醤油はありますか？" (Gluten-free soy sauce wa arimasu ka?)

### Foods That Are Genuinely Safe

These dishes are naturally gluten-free when prepared without soy sauce or with tamari:

- **Sashimi** (raw fish slices) — naturally gluten-free. Bring your own tamari in a small bottle for the dipping sauce
- **Plain steamed white rice (gohan)** — safe everywhere
- **Edamame** — boiled soybeans, usually just salted
- **Plain grilled fish (yakizakana)** — request "tare nashi" (no sauce) or "shio" (salt only)
- **Onsen tamago** (soft poached eggs) — safe
- **Japanese sweet potato (yakiimo)** — sold by street vendors, pure and safe
- **Fresh tofu** — silken or firm, plain
- **Tamagoyaki** (Japanese rolled egg omelette) — usually just eggs and dashi; ask if soy sauce is added

### Restaurant Types to Seek Out

**Sushi restaurants (kaiten-zushi or nigiri):** These are often the most accommodating. Many now have allergy menus in English. Request tamari and avoid fried items. In higher-end sushi restaurants, tell the chef directly.

**Yakiniku (Korean BBQ-style grilled meat):** You grill your own meat at the table. Request a salt dip (shio tare) instead of the standard soy-based sauce. Most cuts of meat are naturally gluten-free.

**Shabu-shabu:** Thinly sliced meats cooked in hot broth. Request a ponzu dipping sauce made with tamari, or sesame sauce (usually gluten-free) instead of the soy-based option.

### Foods to Avoid Entirely

- All ramen and most other noodle soups (broth contains soy sauce)
- Gyoza (dumplings — both filling and dipping sauce)
- Most yakitori unless you confirm "shio" (salt) preparation
- Tonkatsu (breaded pork cutlet — heavily breaded)
- Karaage (Japanese fried chicken — wheat flour coating)
- Most izakaya small plates without explicit confirmation
- Packaged snacks — many contain wheat starch (小麦) listed in ingredients

### The Convenience Store Strategy

Japanese convenience stores (konbini) are 24-hour lifesavers. Boiled eggs, plain onigiri with fresh fish (salmon, tuna — check the label for soy sauce in the rice seasoning), and packaged edamame are reliable. The ingredient labels are in Japanese — learn to recognize 小麦 (wheat) on labels. Many konbini now have English ingredient info on their app.

### Essential Japanese Phrases for Celiac Travelers

Print or save these to show to restaurant staff:

- 私は小麦アレルギーがあります — I have a wheat allergy
- グルテン不耐症です — I have gluten intolerance
- 醤油は使わないでください — Please do not use soy sauce
- 小麦粉は使わないでください — Please do not use wheat flour
- タマリ醤油はありますか？ — Do you have tamari soy sauce?

### Travel Resources

The Japan Celiac Group and various gluten-free Japan travel apps publish updated restaurant lists for Tokyo, Osaka, and Kyoto. AirAsia and several other airlines serving Japan now offer certified gluten-free meals if requested 24–48 hours before departure.

**The honest reality:** Strict celiac travelers will find Japan genuinely difficult and should travel with extra food (safe snacks, tamari sachets), do significant restaurant research before each meal, and eat at home-style accommodation (ryokan with kitchen access or Airbnb) for some meals. The effort is absolutely worth it — Japan's food culture is among the greatest in the world, and with preparation, much of it is accessible.

*This article is for general information purposes only and does not constitute medical advice. Travelers with celiac disease should consult their gastroenterologist before international travel.*`,
  },
  {
    slug: 'water-safety-international-travel',
    title: 'Water safety guide for international travelers',
    tag: 'WATER SAFETY · GLOBAL',
    readTime: 6,
    isPublished: true,
    summary: 'Contaminated water is the leading cause of traveler illness worldwide. This guide covers which countries are safe, how to purify water, and the ice problem.',
    metaDescription: 'Essential water safety guide for international travelers. Which countries have safe tap water, how to purify water abroad, the truth about ice, and avoiding waterborne illness.',
    content: `## Water Safety Guide for International Travelers

Waterborne illness is the leading cause of health problems in international travelers, yet it is almost entirely preventable. Understanding water safety country by country — and knowing how to handle it when the tap is not safe — is one of the most important preparations for any international trip.

### Which Countries Have Safe Tap Water?

**Generally safe to drink from the tap:**

- All of Western Europe (UK, France, Germany, Italy, Spain, Scandinavia, Switzerland, Netherlands, etc.)
- Japan — tap water is among the purest in the world
- Australia and New Zealand
- Canada and the United States
- Singapore
- South Korea

**Not safe to drink directly — treat or use bottled water:**

- Most of Southeast Asia (Thailand, Vietnam, Cambodia, Indonesia, Philippines, Malaysia)
- Most of South Asia (India, Nepal, Sri Lanka, Bangladesh)
- Most of Latin America (Mexico, Central America, most of South America)
- Most of Africa
- Most of the Middle East (except Israel)
- Most of Eastern Europe (safe in major cities of Poland, Czech Republic, Hungary, but check locally)
- China (boiling is the standard practice — water is provided boiled in most hotels)

### The Ice Problem — What Most Travelers Get Wrong

Many travelers avoid tap water but then get ill from ice. Understanding ice is critical.

**Restaurant and bar ice in tourist areas** of countries like Thailand, Mexico, and Vietnam is almost always made from purified water — it comes in bags from commercial ice factories using treated water. You can identify commercial ice by its tubular or hollow center shape. This ice is generally safe at established restaurants.

**Ice at market stalls, small street carts, and local non-tourist establishments** may be made from tap water or stored in non-hygienic conditions. Avoid this ice.

**The practical rule:** At an established restaurant or hotel bar in a tourist area, ice is usually safe. At a roadside cart or local market stall, skip the ice.

### Purification Methods When You Don't Trust the Source

**1. Commercial bottled water**
The simplest and most reliable option. Look for sealed bottles from recognized brands. In countries where counterfeiting is common (some parts of Africa and Asia), check the seal carefully — it should be intact and not re-sealed.

**2. Boiling**
Boiling water for 1 full minute (3 minutes at altitudes above 2,000m / 6,500ft) kills all pathogens including bacteria, viruses, and protozoa. This is what locals do in China and Nepal. Effective but inconvenient for travelers.

**3. Portable water filters**
Filters like the LifeStraw or Sawyer Squeeze remove bacteria and protozoa but do NOT remove viruses. In regions where viral contamination is a concern (South/Southeast Asia, Africa, Latin America), combine a filter with chemical treatment.

**4. UV purification (SteriPen)**
UV purifiers kill bacteria, viruses, and protozoa in about 60–90 seconds. Highly effective and requires no chemicals. They need clear water to work (turbid/cloudy water reduces effectiveness). Batteries need charging.

**5. Chemical treatment (iodine or chlorine tablets)**
Iodine tablets or chlorine dioxide tablets kill most pathogens. Chlorine dioxide is more effective than iodine against Cryptosporidium. Tablets are cheap, light, and effective for emergency use. They leave a slight chemical taste that vitamin C tablets can neutralize.

**Best combination for serious travel:** A hollow-fiber filter for bacteria/protozoa plus UV or chemical treatment for viruses.

### Altitude and Water Safety

At high altitude (trekking in Nepal, Peru, Kilimanjaro), water sources may appear clean but can carry significant contamination from upstream human and animal activity. Never drink directly from mountain streams without treatment. At altitude, boiling times increase — boil for 3 minutes above 2,000m. UV purifiers and chemical treatment work normally at altitude.

### Waterborne Illnesses to Know

**Traveler's diarrhea (TD)** is the most common water and food-related illness. Usually bacterial (E. coli, Campylobacter) and self-limiting within 3–5 days. Oral rehydration salts (ORS) are the most important treatment — pack them before you travel. A physician can prescribe antibiotics for severe cases.

**Hepatitis A** is a viral infection transmitted through contaminated water and food. Vaccination is recommended before travel to most of Africa, Asia, Latin America, and Eastern Europe. Highly effective vaccines are available.

**Typhoid fever** is transmitted through contaminated water and food in South Asia, parts of Southeast Asia, and Africa. Vaccination is recommended for travel to these regions.

**Cryptosporidium and Giardia** are protozoan parasites that survive chlorination. Filter with a 0.3-micron or smaller filter, or use UV treatment. Common in hiking/trekking destinations with animal populations upstream.

### Practical Packing List

- Collapsible water bottle (for refilling with safe water)
- Chlorine dioxide tablets (backup treatment)
- Oral rehydration salts — at least 6 sachets
- Probiotics (take 2 weeks before departure for gut preparation)
- Filtered travel water bottle if visiting rural areas
- Prescription antibiotics (consult your travel medicine doctor)

### The Fresh Produce Rule

Water-borne illness often comes not from drinking water but from fresh vegetables and salads washed in tap water. In high-risk destinations:

- Eat only cooked vegetables for the first few days
- Peel all fruit yourself before eating
- Avoid salads at street stalls
- At established restaurants with high hygiene standards, salads are generally safe

*This article is for general information purposes only. Consult a travel medicine physician before international travel for personalized vaccination and medication recommendations.*`,
  },
]

async function seed() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false })
  console.log('Connected to MongoDB')

  for (const post of posts) {
    await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      { $set: post },
      { upsert: true, new: true }
    )
    console.log(`✓  "${post.title}" (${post.readTime} min read)`)
  }

  console.log('\nBlog post seeding complete.')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
