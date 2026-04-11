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
  image: String,
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
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',
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
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=1200&q=80',
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
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
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
  {
    slug: 'nut-allergy-southeast-asia-guide',
    title: 'Nut allergy survival guide for Southeast Asia',
    tag: 'NUT ALLERGY · ASIA',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1200&q=80',
    readTime: 6,
    isPublished: true,
    summary: 'Southeast Asia uses peanuts and tree nuts throughout its cuisine — often invisibly. This guide covers every country you need to know before you travel.',
    metaDescription: 'Complete nut allergy guide for Southeast Asia travel. Which dishes contain peanuts in Thailand, Vietnam, Indonesia and more — plus key phrases and survival strategies.',
    content: `## Nut Allergy Survival Guide for Southeast Asia

Southeast Asia is one of the world's most challenging destinations for nut allergy travelers — and one of the most rewarding. Understanding the risk country by country and dish by dish gives you the confidence to travel safely and still enjoy one of the planet's great food cultures.

### Thailand — High Risk

Thailand is the highest-risk Southeast Asian country for peanut allergies. Peanuts are used as a fundamental ingredient, not just a garnish.

**High-risk dishes:** Pad thai (ground peanuts standard), massaman curry (peanut-based sauce), satay (peanut dipping sauce), som tum / green papaya salad (peanuts standard), some stir-fries with crushed peanuts. **Important:** Peanut oil is used for frying at many street stalls — cross-contamination risk is real even in dishes that don't contain peanuts as an ingredient.

**Your key phrase:** "Phom/Chan pae tua lisong" (ผมแพ้ถั่วลิสง / ฉันแพ้ถั่วลิสง) — I am allergic to peanuts. Carry a printed Thai allergy card from a reputable source.

### Vietnam — Moderate Risk

Peanuts appear in Vietnamese cuisine, but less pervasively than in Thailand. Key risks: peanuts as a garnish on bun dishes and bánh xèo (sizzling crepe), peanuts in some dipping sauces, and crushed peanuts on various street food. Cashews appear in some stir-fry dishes.

**Generally safe:** Phở (broth-based noodle soup — typically peanut-free), bánh mì (Vietnamese sandwich — check fillings), fresh spring rolls (gỏi cuốn — check for peanut dipping sauce), and most grilled meat dishes.

### Indonesia & Bali — High Risk

Indonesia is very high risk. Peanut sauce (bumbu kacang) is a national condiment and appears on gado-gado, satay, karedok, and many other dishes. Tempe and tofu-based dishes are generally safe, as are most rice dishes eaten without sauce.

**Key dishes to avoid:** Gado-gado (peanut sauce salad), satay with peanut sauce, karedok (raw vegetable salad with peanut sauce), and many sambal preparations. **Generally safe:** Nasi goreng (fried rice — check), steamed rice with simple vegetable accompaniments, and clear soups.

### Malaysia — Moderate-High Risk

Similar to Indonesia — peanuts appear in satay sauce, some noodle dishes, and as garnishes. Rojak (fruit and vegetable salad) has peanut-based dressing. Char kway teow and most hawker noodle dishes do not routinely contain peanuts.

### Singapore — Moderate Risk

Singapore hawker centres have peanuts in satay sauce and some dressings but are generally less risky than Thailand or Indonesia. The food hygiene standards make cross-contamination less likely at established stalls. Clear signage and allergy awareness is higher than elsewhere in the region.

### Cambodia & Laos — Lower Risk

Peanuts appear less frequently in Khmer and Lao cuisine. Main risks: some amok (curry) preparations may use peanuts, and nut-based garnishes on salads. Generally a lower-risk destination than Thailand or Indonesia.

### Universal Strategies

1. **Carry adrenaline (epinephrine) auto-injectors** — two of them. Know how to use them. Tell your travel companions where they are stored.
2. **Print allergy cards in local languages** — Allergy Translation (allergyuk.org) provides free cards in 30+ languages
3. **Stay at hotels with kitchenettes** — allows some meal preparation with controlled ingredients
4. **Eat at higher-end restaurants** — staff are more likely to speak English and understand cross-contamination
5. **Carry your own safe snacks** — protein bars, rice crackers, and dried fruit for emergencies

*This article provides general information. Travelers with severe nut allergies (anaphylaxis risk) should consult their allergist before traveling to Southeast Asia and carry adequate emergency medication.*`,
  },
  {
    slug: 'marathon-runner-international-race-nutrition',
    title: 'How marathon runners should fuel for international races',
    tag: 'MARATHON · NUTRITION',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80',
    readTime: 8,
    isPublished: true,
    summary: 'Racing abroad means unfamiliar food, disrupted routines, and no access to your usual race fuel. Here\'s the complete fueling strategy for international marathon runners.',
    metaDescription: 'Complete nutrition guide for marathon runners competing internationally. Pre-race carb loading, race-day GI safety, finding local race fuel, and recovery eating at any World Major.',
    content: `## How Marathon Runners Should Fuel for International Races

Racing a marathon abroad introduces a layer of nutritional uncertainty that can derail months of training. Unfamiliar food, disrupted sleep, time zone shifts, and no access to your usual race fuel are all manageable — if you plan properly.

### The Fundamental Rule: Don't Try New Foods Race Week

Race week nutrition is not the time to explore local cuisine. Stick to foods your gut knows. This is true whether you're at Berlin, Tokyo, Boston, or Chicago. New foods introduce new risks — ingredients you don't recognize, different food hygiene standards, and the psychological stress of not knowing what you're eating.

### 5 Days Out: Building Carbohydrate Reserves

Start moderate carb loading 5 days before the race. At this stage, your target is maintaining energy stores, not stuffing carbohydrates.

**Reliable carb sources at most international destinations:**
- Plain white rice (available everywhere — low fiber, easy to digest)
- Plain pasta or noodles at international hotels
- White bread or rolls
- Bananas (universally available — predictable GI)
- Rice-based breakfast cereals

**Avoid introducing:** High-fiber local vegetables, unfamiliar legumes, spicy street food, alcohol, and large quantities of fat.

### The Night Before: The Critical Meal

The pre-race dinner is one of the most important meals of your racing year. The goal: 150–200g of carbohydrate from easily digestible, low-fiber sources, moderate protein, minimal fat and fiber.

**Safe pre-race meals by destination:**

**Japan (Tokyo Marathon):** Plain udon noodles with clear broth and soft boiled egg — available at any convenience store or hotel restaurant. White rice onigiri (rice balls) from any 7-Eleven. Avoid tempura, ramen (heavy fat), and sushi (food safety risk the night before a race).

**Germany (Berlin Marathon):** Plain pasta with olive oil, white bread rolls, boiled potatoes. German hotel breakfasts are excellent for runners — avoid the heavy sausage and focus on the bread and eggs section.

**USA (New York/Boston/Chicago):** The easiest destination — pasta, rice, and runner-familiar foods are everywhere. Stick to what you know.

**Italy (Rome Marathon):** Plain pasta with tomato sauce (no cream) — this is the ideal pre-race meal and you're in the right country. White bread, plain pizza bianca. Avoid the rich Roman pasta dishes (carbonara, amatriciana — high fat).

**Thailand (various marathons):** Jasmine rice with plain grilled chicken, clear noodle soup, or white bread toast from a hotel buffet. Avoid pad thai and street food the night before.

### Race Morning: The 3-Hour Rule

Eat your race morning meal 2.5–3 hours before the gun. Target: 70–100g of carbohydrate, minimal fiber and fat, known foods.

**Universally available race morning options:**
- White toast with honey or jam
- Banana (1–2)
- Plain white rice porridge / congee (common in Asian destinations — excellent option)
- Plain rice crackers
- Your own imported energy bars if you've brought them

### Gels and Race Fuel: Plan Before You Go

Do not assume your preferred energy gel is available at the destination. Research before you travel:

- Japanese convenience stores (7-Eleven, FamilyMart) stock energy gels and sports drinks — bring your usual if possible
- European race expos typically have multiple gel brands — visit the expo on Saturday to stock up
- US races have excellent gel variety at local running stores
- In Asia outside Japan, gel availability varies widely — bring 20% more than you need

### Race Day GI Safety

GI distress ruins more races than fitness. The foods that commonly cause race-day problems:

- High-fiber cereals or bread the morning of the race
- Too much fat in the pre-race meal
- New foods introduced in the 48 hours before the race
- Caffeine excess (1mg/kg body weight from coffee is beneficial — more can cause GI issues)
- Isotonic drinks too concentrated (dilute if your stomach is sensitive)
- Peanut butter (too much fat for race morning)

### Post-Race Recovery

Within 30 minutes of finishing: carbohydrate + protein. At any race destination, reliable options include banana + protein bar, rice-based dish with chicken, or a commercially available recovery shake.

For the following 48–72 hours, prioritize protein (1.6–2.0g/kg/day) for muscle repair. Iron-rich foods support recovery from the foot-strike hemolysis that occurs in marathon running.

*This article is for general information purposes only. Individual nutritional needs vary — consult a sports dietitian for a personalised racing nutrition plan.*`,
  },
  {
    slug: 'jet-lag-nutrition-business-travel',
    title: 'Jet lag nutrition: what to eat to arrive sharp',
    tag: 'JET LAG · BUSINESS TRAVEL',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80',
    readTime: 5,
    isPublished: true,
    summary: 'Strategic eating before, during, and after long-haul flights can dramatically reduce jet lag. Here\'s the science-backed nutrition protocol for business travelers.',
    metaDescription: 'Science-backed jet lag nutrition guide for business travelers. What to eat on long-haul flights, fasting protocols, and the first meal that resets your body clock fastest.',
    content: `## Jet Lag Nutrition: What to Eat to Arrive Sharp

Jet lag is a mismatch between your internal body clock (circadian rhythm) and the local time at your destination. Food timing is one of the most powerful and underused tools for resetting that clock faster — and arriving ready for meetings, not foggy and fatigued.

### Why Food Timing Works

Your circadian rhythm is regulated by two main cues: light and food timing. The liver and digestive system have their own "clock" that responds to when you eat. When you fast for 12–16 hours and then eat a meal, your digestive system interprets that first meal as "breakfast" regardless of the time of day. This is the basis of the most evidence-supported nutritional strategy for jet lag.

### The Protocol: Fasting on the Flight

**For eastward travel (the harder direction):**

1. In the 12 hours before your destination's local morning time, fast — drink only water and herbal tea on the plane, no alcohol, and minimal caffeine
2. On arrival in the morning, eat a substantial protein-forward breakfast immediately
3. Stay awake until local bedtime with strategic light exposure
4. Eat meals on local time from day one

**Example — London to Singapore (8-hour time difference, landing 6am Singapore time):**
- Board the flight and eat the first meal service (UK evening time)
- For the final 5–6 hours of the flight, fast — water only
- On landing at 6am: eat a full protein breakfast at the airport or hotel

### What to Eat: The First Meal After Landing

The most important meal for jet lag recovery is the first one you eat at your destination. Make it protein-forward — protein and fat suppress melatonin and promote wakefulness in a way that carbohydrates do not.

**Ideal first meal options by destination:**

**Singapore/Malaysia:** Kaya toast set with soft-boiled eggs (eggs are excellent — avoid the toast for lower carb), or order a breakfast of eggs, vegetables, and chicken
**Japan:** Teishoku breakfast (grilled fish, rice, miso soup, pickles) — fish and protein are ideal
**USA:** Eggs any style, smoked salmon, avocado, and coffee
**Germany/Europe:** Hotel buffet: focus on eggs, cheese, smoked fish — avoid the pastry section

**What to avoid on landing:** Pastries, sweetened yogurt, fruit juice, and sugary cereals — these cause an energy spike followed by a crash 90 minutes later, right when you need to be sharp.

### Caffeine Strategy

Caffeine is a powerful alertness tool — but timing matters.

- **Do not use caffeine in the first 90 minutes after waking** (cortisol is naturally elevated — caffeine on top reduces its effectiveness and builds tolerance faster)
- Use caffeine 90 minutes after waking and before important meetings
- Stop caffeine 8 hours before your intended bedtime
- Limit to 200–400mg total per day (2–4 espressos)

### Alcohol: The Worst Thing for Jet Lag

Alcohol is sleep-disruptive, dehydrating, and suppresses REM sleep — exactly what you need when trying to reset your circadian clock. Even one drink on a long-haul flight measurably worsens jet lag. The business class champagne is one of the worst jet lag decisions you can make.

### Hydration: The Unsexy Essential

Cabin air is extremely dry (10–20% relative humidity vs. 40–60% on the ground). Dehydration worsens every symptom of jet lag. Target: 250ml of water per hour of flight, minimum. Avoid: alcohol, excessive coffee (diuretic), and salty snacks (increase dehydration).

### The Melatonin Window

Melatonin (0.5–3mg) taken at destination bedtime on the first 2–3 nights significantly accelerates adaptation for eastward travel. Pair with darkness and avoid bright screens for 1 hour before target sleep time.

*This article provides general wellness information. Individual responses to jet lag and sleep disruption vary. Consult a sleep physician or travel medicine specialist for severe chronic jet lag.*`,
  },
  {
    slug: 'vegetarian-travel-guide-india',
    title: 'Vegetarian travel guide for India — what to eat in every region',
    tag: 'VEGETARIAN · INDIA',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=80',
    readTime: 7,
    isPublished: true,
    summary: 'India is the easiest country in the world for vegetarians — but knowing the regional differences, hidden ingredients, and Ayurvedic food principles transforms a good trip into a great one.',
    metaDescription: 'Complete vegetarian travel guide for India. North vs South Indian vegetarian food, vegan options, hidden ingredients, and the best vegetarian destinations from Mumbai to Rishikesh.',
    content: `## Vegetarian Travel Guide for India — What to Eat in Every Region

India is, quite simply, the best country in the world for vegetarian travelers. With over 400 million vegetarians — the world's largest vegetarian population — plant-based eating is the cultural norm across entire states and communities, not a dietary preference requiring special accommodation.

### Understanding Indian Vegetarianism

Indian vegetarianism is not monolithic. There are important distinctions:

**Lacto-vegetarian** (the most common): No meat, poultry, or fish — but dairy products (milk, ghee, paneer, yogurt) are consumed. This is standard in most Hindu households and most "veg" restaurants.

**Eggetarian**: No meat or fish, but eggs are consumed. Common in South India and urban areas.

**Jain vegetarian**: Stricter than standard — no root vegetables (potatoes, carrots, onions, garlic) are consumed, as harvesting them kills the plant. Jain restaurants are widespread in Gujarat and Maharashtra.

**Sattvic (yogic) vegetarian**: No onion or garlic, which are considered energizing/agitating (rajasic). Standard at yoga retreats and many ashrams.

**Vegan**: No animal products including dairy. Growing in cities — increasingly available but still requires explicit requesting.

### North India — The Dal-Roti Belt

North Indian vegetarian cuisine is defined by wheat (roti, paratha, naan, puri) and dairy (ghee, paneer, yogurt). The foundation dishes:

**Essential North Indian vegetarian:** Dal makhani (slow-cooked black lentils — contains butter, request vegan version), chana masala (chickpea curry — naturally vegan), rajma (red kidney bean curry — naturally vegan), palak paneer (spinach with cheese — not vegan), aloo gobi (potato and cauliflower — naturally vegan), and matar paneer (peas with cheese).

**For vegans in North India:** Request dishes "without paneer, without ghee, without malai." Chana masala, rajma, aloo gobi, and dal tadka (tempered lentils with oil) are naturally vegan when prepared without dairy finishing. In Delhi, the Old Delhi neighborhood near the Red Fort has excellent traditional veg food. Chandni Chowk's Haldiram's and other pure veg restaurants are reliable.

### South India — The Rice and Lentil Paradise

South Indian cuisine is a dream for vegetarians and particularly for those who are also gluten-free. The staples — dosa, idli, sambar, rasam, and rice dishes — are based on fermented rice and lentils and are naturally vegan and gluten-free.

**Essential South Indian vegetarian:** Masala dosa (crispy crepe with spiced potato filling), idli with sambar (steamed rice cakes with lentil vegetable soup), bisi bele bath (Karnataka rice and lentil dish), avial (Kerala mixed vegetable curry with coconut), and appam with coconut milk curry (Kerala).

**Meals (thali) culture:** South Indian "meals" (the word used for a thali lunch) are extraordinary value — unlimited rice, sambar, rasam, several vegetable curries, papad, and pickles, all served on a banana leaf for a fixed low price. Most "meals" are entirely vegan by default.

### Gujarat — Vegetarian Heaven

Gujarat has the highest proportion of vegetarians in India and some of the most distinctive cuisine. Gujarati thali is famous nationwide: dal, kadhi (yogurt curry), various vegetable dishes, rice, rotli (thin wheat flatbread), and a famous mix of sweet, sour, and spicy flavors.

### Rajasthan — Desert Vegetarian Cuisine

Rajasthani cuisine evolved around vegetarianism in an arid environment. Dal baati churma (baked wheat balls with lentils and sweet crumbled wheat) is the signature dish. Gatte ki sabzi (gram flour dumplings in spiced yogurt sauce) and ker sangri (desert bean and berry curry) are unique to the region.

### Wellness and Yoga Destinations

**Rishikesh (Uttarakhand):** India's yoga capital is entirely vegetarian — meat is banned from the city. The food culture is sattvic — no onion or garlic, light spicing, emphasis on whole grains, lentils, and vegetables. The restaurant scene has expanded enormously with the wellness tourism boom.

**Pushkar (Rajasthan):** Another completely vegetarian city. The food is more varied — cafes serve everything from Rajasthani thali to Israeli salads and pasta, all vegetarian.

**McLeod Ganj (Dharamsala, Himachal Pradesh):** Tibetan Buddhist influence — vegetarian momos, thukpa noodle soup, and Tibetan butter tea. The Tibetan community has extensive vegetarian offerings.

### Hidden Non-Vegetarian Ingredients

Even in vegetarian India, watch for:

- **Ghee** (clarified butter) — used in almost everything in North India. Vegans must explicitly request "without ghee"
- **Paneer** (fresh cheese) — not vegan. Many dishes contain it
- **Dahi** (yogurt) — used in marinades and curries. Not vegan
- **Fish sauce** — rare in traditional Indian cooking but appears in some coastal restaurants
- **Red food dye** — some use carmine (cochineal, made from insects). Mostly synthetic in India but worth checking

*General information only. Nutritional needs vary individually — consult a dietitian for personalized guidance.*`,
  },
  {
    slug: 'high-altitude-nutrition-himalayan-trekkers',
    title: 'High altitude nutrition guide for Himalayan trekkers',
    tag: 'ALTITUDE · TREKKING',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
    readTime: 7,
    isPublished: true,
    summary: 'What you eat on an Everest Base Camp or Annapurna trek matters more than most trekkers realize. This guide covers calorie needs, AMS nutrition, and what the tea houses actually serve.',
    metaDescription: 'High altitude nutrition guide for Himalayan trekkers. Calorie needs at elevation, AMS prevention foods, garlic soup science, and what to eat at every stage of the EBC and Annapurna Circuit.',
    content: `## High Altitude Nutrition Guide for Himalayan Trekkers

Most trekkers prepare obsessively for gear, fitness, and acclimatisation schedules — and then barely think about nutrition until they're sitting in a tea house at 4,200m wondering why they feel terrible. Nutrition is one of the most actionable levers you have at altitude. This guide covers everything.

### Why Calorie Needs Increase at Altitude

At altitude, your body expends significantly more energy than at sea level for three reasons:

1. **Thermogenesis:** Your body burns more calories maintaining core temperature in cold, dry mountain air
2. **Hypoxic metabolism:** Low oxygen forces less efficient energy metabolism — more calories burned per unit of work
3. **Increased ventilation:** Breathing harder and deeper burns more calories

At 4,000–5,000m, total daily energy expenditure increases by 500–1,000 calories above your sea-level baseline. Most trekkers undereat at altitude — partly because altitude suppresses appetite, and partly because tea house menus are limited.

**Practical target:** Eat even when you don't feel hungry. At altitude, "not hungry" is not the same as "not needing fuel."

### The Tea House Menu — What You'll Actually Be Eating

Tea house menus on popular Nepali trekking routes (EBC, Annapurna, Langtang) are surprisingly consistent. Here's what's nutritionally valuable:

**Dal bhat:** The trekker's staple and for good reason. Lentils + rice = complete protein + complex carbohydrates + iron (crucial at altitude). Most tea houses offer unlimited dal bhat refills for a fixed price. Eat it at least once daily on trek.

**Garlic soup:** Order this every night from mid-altitude (around Namche Bazaar on EBC, Manang on Annapurna). Garlic has genuine evidence for supporting acclimatisation — it contains allicin, which improves peripheral circulation and oxygen delivery to tissues. Sherpa guides have recommended it for generations; the science now supports them.

**Eggs:** Available scrambled, boiled, or in omelette form at most tea houses. An excellent protein source at altitude. Boiled eggs are the lowest food-safety risk option — hard-boiled has the best safety profile in remote kitchens.

**Tsampa (roasted barley porridge):** Traditional Tibetan food, available at higher altitude tea houses. High in carbohydrates and fiber, warming, and energizing. Historically the staple food of high-altitude Himalayan communities for thousands of years.

**Ginger lemon honey tea:** Not just for warmth — ginger helps nausea (common with AMS), honey provides quick carbohydrates, and the hot liquid supports hydration.

### Foods That Worsen Altitude Sickness

**Alcohol:** Avoid entirely until well-acclimatised. Alcohol suppresses the hypoxic ventilatory response — the body's mechanism for naturally increasing breathing rate at altitude. This slows acclimatisation and worsens AMS. Even one drink at altitude has measurable effects.

**Heavy fats in large amounts:** High-fat meals take longer to digest and compete for the oxygen-carrying blood flow that your muscles and brain need during altitude acclimatisation. Moderate fat is fine; a large fatty meal is not.

**Underhydration:** Not a food per se, but water intake is often insufficient. At altitude, you lose water faster through increased respiration (breathing heavily) and dry air. Target 3–4 liters of treated water per day on trek — more if you're exercising hard.

### Altitude and Iron

At altitude, the body produces more red blood cells to carry oxygen — this process requires iron. Trekkers who are even mildly iron-deficient before their trek will experience worse altitude performance and slower acclimatisation.

**Iron-rich foods available at tea houses:** Dal bhat (lentils — excellent non-heme iron), eggs, and some tea houses serve meat (chickens at lower altitudes). Pair iron-rich foods with vitamin C sources (lemon in your tea, fresh vegetables) to enhance absorption.

**Pre-trek:** Have ferritin checked 6–8 weeks before your trek. If borderline, supplement iron with medical supervision.

### Practical Day-to-Day Nutrition on Trek

- **Breakfast:** Tsampa porridge or boiled eggs + toast + ginger tea + at least 500ml water before leaving the tea house
- **During the day:** Bring high-calorie snacks from Kathmandu — trail mix, protein bars, chocolate, dried fruit. Tea houses above 4,500m may not have much snack food available
- **Lunch:** Dal bhat or noodle soup with eggs
- **Afternoon:** Garlic soup + ginger tea at your tea house
- **Dinner:** Dal bhat (always) + vegetables

### Water Treatment on Trek

Never drink untreated water. Boil for 3 minutes (at altitude, boiling point is around 90°C — 3 minutes ensures pathogen death). Alternatively, use chlorine dioxide tablets (Aquatabs, Katadyn) or a UV purifier. On popular routes (EBC, Annapurna), boiled water is available to fill your bottles at most tea houses — pay the small fee, it is worth it.

*This guide provides general wellness information for trekkers. Altitude medicine is a specialist field — consult a travel medicine physician before high-altitude expeditions, particularly above 4,000m.*`,
  },
  {
    slug: 'plant-based-eating-yoga-retreat-rishikesh',
    title: 'Plant-based eating at a yoga retreat in Rishikesh',
    tag: 'WELLNESS · INDIA',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
    readTime: 6,
    isPublished: true,
    summary: 'Rishikesh is one of the world\'s great sattvic food destinations — but knowing what to eat, where, and how to stay safe transforms the experience.',
    metaDescription: 'Complete guide to plant-based and sattvic eating at a yoga retreat in Rishikesh, India. Best restaurants, retreat food, food safety, and Ayurvedic nutrition principles.',
    content: `## Plant-Based Eating at a Yoga Retreat in Rishikesh

Rishikesh occupies a unique position in the world of food and wellness travel. As a Ganga-side pilgrimage town and the global capital of yoga, it is entirely vegetarian — no meat is served anywhere in the city. The food culture is shaped by Hindu pilgrimage traditions, Ayurvedic principles, and a thriving international wellness tourism community.

### Understanding Sattvic Food

The yoga tradition distinguishes three qualities (gunas) in food:

**Sattvic:** Pure, light, nourishing — promotes clarity and peace of mind. Includes fresh vegetables and fruits, whole grains, lentils, dairy (except in strict Jain practice), mild natural sweeteners, and foods eaten with gratitude and moderation.

**Rajasic:** Stimulating, energizing — promotes activity and passion, can cause restlessness in excess. Includes onions, garlic, hot spices, and caffeinated beverages.

**Tamasic:** Heavy, dulling — promotes lethargy and stagnation. Includes meat, alcohol, fermented foods, and stale or overprocessed food.

Most yoga retreat kitchens serve food free of onion and garlic (rajasic), animal products (tamasic in larger quantities), and heavily spiced preparations. The result is mild, deeply nourishing food.

### What to Expect at Retreat Kitchens

Most ashrams and retreat centers in Rishikesh serve meals following sattvic principles:

**Typical retreat meal:** Khichdi (rice and mung dal cooked together — the quintessential sattvic food, extraordinarily easy to digest), roti or chapati, one or two vegetable preparations (sabzi), dal, and fresh yogurt (dahi — if the retreat is not vegan). Meals are simple, moderately spiced, and designed to support yoga practice rather than stimulate the senses.

**Food safety at retreat kitchens:** Retreat center kitchens are generally among the safest food environments in India. They cook fresh, in large batches, for paying guests who they want to keep healthy. This is meaningfully safer than casual street food.

### The Rishikesh Restaurant Scene

The town has an excellent and growing restaurant scene along the Ram Jhula and Lakshman Jhula areas:

**For whole foods plant-based eating:** Chotiwala and its neighbours are traditional; the cafes along the ghats (riverbank steps) serve excellent fresh juice, fruit bowls, and simple Indian food. The Little Buddha Café near Lakshman Jhula is popular with international wellness travelers.

**For variety:** The international cafes (particularly on the Swarg Ashram side) serve Israeli breakfast, pasta, pancakes, and smoothie bowls alongside Indian food — all vegetarian.

### Food Safety Essentials

Rishikesh, despite its spiritual character, is still in India — water safety rules apply strictly:

**Water:** Never drink tap water. Drink sealed commercial bottled water. Many retreat centers provide purified water — confirm with your host.

**Fresh juice:** Fresh-squeezed juice in tourist cafes is generally safe as it's a well-established business with regular foreign customers. At roadside stalls, risk increases.

**Street food:** The deep-fried street snacks (pakora, jalebi) along the main market are safe when eaten fresh and hot. Avoid anything sitting uncovered for long periods.

**Raw salads:** At established international-facing restaurants with high turnover, salads are generally safe. At budget local dhabas, stick to cooked food.

### Ayurvedic Nutritional Principles for Travelers

Ayurveda, India's ancient medical system, offers practical guidance for maintaining health while traveling:

**Agni (digestive fire):** Ayurveda teaches that digestive capacity is the foundation of health. When traveling, maintain agni by eating warm, cooked food (easier to digest than raw), eating at regular times, avoiding overeating, and drinking warm water with ginger and lemon.

**Dosha-appropriate eating:** Vata types (prone to anxiety, dryness, irregularity when traveling) benefit from warm, oily, grounding foods — khichdi is ideal. Pitta types (prone to inflammation and heat) benefit from cooling foods — coconut water, cucumber, coriander-spiced dishes.

**Triphala:** A traditional Ayurvedic herbal compound (three fruits) widely available in Rishikesh and taken before bed to support digestion. Many yoga retreats provide it. Generally safe and evidence-supported for digestive regularity.

### Supplements and Wellness Supports

- **Probiotics:** Take 2–3 weeks before departure to build gut resilience — particularly useful for India travel
- **Vitamin B12:** If fully vegan, ensure supplementation — Indian plant foods do not reliably provide B12
- **Iron:** The sattvic diet can be low in heme-iron if eliminating all animal products — eat iron-rich lentils and leafy greens paired with vitamin C regularly
- **Vitamin D:** India has abundant sunshine — get daily sun exposure for natural vitamin D synthesis, which supports immune function during the adjustment to a new environment

*This article is for general information purposes only and does not constitute medical advice. Consult a healthcare professional before making significant dietary changes or traveling with health conditions.*`,
  },
  {
    slug: 'managing-type-1-diabetes-traveling',
    title: 'Managing Type 1 diabetes while traveling internationally',
    tag: 'TYPE 1 DIABETES · TRAVEL',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
    readTime: 8,
    isPublished: true,
    summary: 'Type 1 diabetes requires more preparation than any other condition for international travel. Insulin storage, time zone adjustments, food carb counting abroad — this guide covers the essentials.',
    metaDescription: 'Complete guide to managing Type 1 diabetes while traveling internationally. Insulin storage, time zone basal adjustments, carb counting in unfamiliar cuisines, and medical emergencies abroad.',
    content: `## Managing Type 1 Diabetes While Traveling Internationally

International travel with Type 1 diabetes is absolutely achievable — millions of T1Ds travel the world safely every year. It requires more preparation than traveling without diabetes, but the reward is complete confidence that you've managed every foreseeable situation.

### Medical Preparation: 4–8 Weeks Before Travel

**Doctor's letter:** Obtain a letter from your endocrinologist or GP confirming your diagnosis and listing all medications, devices, and supplies. This should be on official letterhead and signed. Carry it both digitally and printed. Essential for passing through airport security with insulin and devices.

**Prescription copies:** Bring written prescriptions for all medications and devices. Some countries require prescriptions to obtain medical supplies if yours are lost or damaged.

**Travel insurance:** Standard travel insurance often excludes or limits pre-existing conditions. Seek specialist travel insurance that explicitly covers T1D, including medical evacuation. Annual worldwide policies from specialists (e.g., Battleface, Staysure) are available.

**Vaccines:** Illness dramatically disrupts glucose control — get all recommended travel vaccines. Hepatitis A and typhoid are relevant for most developing-world destinations.

### Insulin Storage While Traveling

Insulin degrades significantly above 25–30°C and is destroyed by freezing. In hot destinations (Thailand, India, Southeast Asia), this requires active management.

**In-use insulin:** An open vial or pen can be stored at room temperature (up to 25–28°C, check your specific insulin label) for 28 days. In hot climates, this window shortens.

**Keeping insulin cool on the road:**
- FRIO insulin cooling pouches (activated by soaking in water, maintain cool temperature for 45+ hours through evaporative cooling) — excellent for active travel and don't require refrigeration
- Most hotels have mini-fridges — confirm at booking for longer stays
- Never place insulin directly on ice or in a freezer compartment — frozen insulin is ruined
- Store carry-on only — never check insulin in hold baggage (risk of freezing at altitude and loss)

**CGM and pump supplies:** These electronic devices are generally safe through airport X-ray but should be removed before body scanners. Most CGM and pump manufacturers advise carrying devices through metal detectors rather than millimeter-wave scanners.

### Time Zone Adjustments for Insulin Dosing

This is one of the most complex aspects of T1D travel and must be planned with your diabetes care team. There is no universal protocol — it depends on your insulin regimen.

**General principles:**

For **basal-bolus therapy** with long-acting insulin: For short time differences (1–3 hours), no adjustment is usually needed. For larger differences, consult your endocrinologist. A common approach: keep timing on home time for the first 24 hours while calculating the difference, then gradually adjust.

For **insulin pump users:** Simply set the pump to local time and maintain your usual basal rates. This is one of the advantages of pump therapy for frequent travelers.

**Practical time zone rule from the T1D travel community:** East (shorter day) — reduce long-acting by 10–15%. West (longer day) — increase by 10–15%. Always confirm with your care team.

### Carb Counting in Unfamiliar Cuisines

Estimating carbohydrates in foreign foods is a learned skill and the biggest day-to-day challenge for T1D travelers. Key strategies:

**Reference resources:** Download an offline food logging app (Carbs & Cals, MyFitnessPal) with international food databases before you travel. These have photographs that help identify and estimate portion sizes.

**Know your safe defaults:** Identify 2–3 reliable, carb-predictable meals at each destination. For example, in Japan: plain onigiri (approximately 30–40g carbs each), plain ramen (50–70g depending on noodle quantity), and grilled protein with small rice portion. Having reliable anchors reduces cognitive load.

**Portion estimation:** A fist = approximately 1 cup of starchy food ≈ 30–45g carbohydrate. Use this as a rough guide when you can't weigh food.

**CGM use abroad:** A continuous glucose monitor (Dexterity, Libre) makes food estimation errors visible and correctable. If you use one, ensure you bring enough sensors for the entire trip plus 20% spare.

### Emergency Supplies Checklist

Never travel without:
- Fast-acting glucose (glucose tablets, sugar sachets, sweets) — minimum 3 servings in your bag at all times
- Glucagon emergency kit (or nasal glucagon — Baqsimi) and someone who knows how to use it
- Ketostix for testing for DKA if unwell
- Spare insulin pen needles or infusion sets
- At least 2x your calculated insulin needs for the trip (theft, damage, expiry)
- Written list of all medications and doses

### Medical Care Abroad

**Where to get help:** International hospitals in major cities have diabetes-experienced physicians. In Southeast Asia: Bangkok Hospital and Bumrungrad (Thailand), Gleneagles (Singapore, Malaysia). In India: Apollo and Fortis chains. In Japan: St Luke's International Hospital (Tokyo) has excellent English-speaking care.

**Language barrier:** Carry a card in the local language stating you have Type 1 diabetes, that you use insulin (this is not a choice), and emergency contact information. MedicAlert provides international cards.

*This article is for general information and planning purposes only. All insulin dosing adjustments for travel must be planned in consultation with your endocrinologist or diabetes care team. Do not make basal rate changes based on general advice.*`,
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
