/**
 * Seed script — full destination data with guide content.
 * Run: node lib/seed-destinations.js
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

const DestinationSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  country: String,
  image: String,
  content: String,
  conditions: [String],
  isFree: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

const Destination =
  mongoose.models.Destination || mongoose.model('Destination', DestinationSchema)

const destinations = [
  {
    slug: 'japan',
    name: 'Japan',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80',
    isFree: true,
    isPublished: true,
    conditions: ['diabetes', 'gluten-free', 'nut allergy', 'vegetarian'],
    averageRating: 4.9,
    totalRatings: 52,
    content: `## Japan Health & Nutrition Guide for Travelers

Japan is one of the most food-safe destinations in the world — food hygiene standards are exceptionally high, ingredient labeling is meticulous, and the cuisine is naturally low in saturated fat. However, travelers with specific dietary conditions should be aware of several important considerations.

### For Diabetics

Japanese cuisine is generally favorable for blood sugar management. White rice is the dietary staple and has a moderate glycemic index when eaten with protein and vegetables, as is traditional. Good blood sugar-friendly options: edamame, sashimi, grilled fish, tofu dishes, yakitori (grilled chicken skewers), miso soup (watch sodium), and plain noodle soups with protein.

**Avoid or limit:** Sweet teriyaki glazes (high added sugar), ramen with sweetened broths, Japanese desserts including mochi (very high GI), fried tempura (calorie-dense), and sweetened canned coffee from vending machines. Convenience stores (konbini) such as 7-Eleven, FamilyMart, and Lawson are surprisingly useful — they offer boiled eggs, plain onigiri with salmon or tuna, and packaged salads that make reliable low-GI snacks between meals.

### For Gluten-Free Travelers

This is the most significant challenge in Japan. Soy sauce (shoyu) contains wheat and appears in almost everything — miso soup, ramen, teriyaki, yakitori glazes, sashimi dipping sauce, most stir-fries, and many cooked dishes. Strict gluten-free travelers must request tamari (gluten-free soy sauce) and explicitly confirm at each restaurant.

**Safe options:** Plain white rice, sashimi (raw fish, no sauce), plain edamame, plain grilled meats without sauce, silken or firm tofu, Japanese sweet potato (yakiimo sold by street vendors in autumn and winter). Print or save Japanese allergy cards — "小麦アレルギーがあります" (I have a wheat allergy) — kitchen staff respond well to written communication in their language.

### For Nut Allergy Travelers

Japan is relatively nut-safe compared to Southeast Asia. Peanuts and tree nuts are not fundamental ingredients in traditional Japanese cooking. However, watch for sesame seeds and sesame oil — these are widespread in dressings, marinades, and as garnishes on many dishes. Some Western-influenced desserts and imported snacks at hotels contain tree nuts. Most traditional Japanese dishes (sushi, ramen, tempura, yakitori) are free of tree nuts. Always confirm at restaurants.

### For Vegetarians

Japan presents a surprising challenge: fish-based dashi stock is used in almost all Japanese broths — miso soup, ramen, udon, soba, and many cooked vegetable dishes contain dashi. Travelers who eat fish (pescatarians) will find Japan excellent.

**Options for strict vegetarians:** Shojin ryori (Buddhist vegetarian temple cuisine — zero animal products, served at many Kyoto temples), Indian and curry restaurants in major cities, and dedicated vegan/vegetarian restaurants in Tokyo and Kyoto. Look for the kanji 精進料理 (shojin ryori) when dining near temples. In major cities, the vegetarian scene has expanded rapidly — apps like HappyCow are useful.

### Water Safety

Tap water in Japan is safe to drink everywhere — it is among the safest in the world. No need to buy bottled water.

### General Tips

- Always carry your dietary restrictions written in Japanese — most restaurant staff do not speak English
- Konbini (convenience stores) are reliable, hygienic food sources open 24 hours
- Department store food halls (depachika) have diverse high-quality options at fair prices
- Tokyo and Kyoto have the highest density of allergy-aware and vegetarian restaurants
- Osaka is the food capital — the variety and quality of dining options is exceptional`,
  },
  {
    slug: 'thailand',
    name: 'Thailand',
    country: 'Thailand',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80',
    isFree: true,
    isPublished: true,
    conditions: ['nut allergy', 'diabetes', 'vegan'],
    averageRating: 4.7,
    totalRatings: 38,
    content: `## Thailand Health & Nutrition Guide for Travelers

Thailand offers some of the world's most vibrant and diverse cuisine, but travelers with dietary conditions need to navigate several key challenges. Food hygiene at established restaurants is generally good, though caution is warranted at some street stalls.

### For Nut Allergy Travelers

Thailand is one of the higher-risk destinations for nut allergies. Peanuts are a fundamental ingredient in Thai cuisine — they appear as garnishes, in sauces, in curry pastes, and are sometimes used in cooking oil. This is critical to understand before you arrive.

**High-risk dishes to avoid or verify carefully:** Pad thai (almost always contains ground peanuts), massaman curry (peanut-based sauce), satay skewers (peanut dipping sauce), som tum / green papaya salad (usually garnished with peanuts), and some stir-fries with cashews. **What to carry:** A Thai allergy card stating "ผมแพ้ถั่วลิสง" (I am allergic to peanuts). For tree nut allergies, cashews appear in some stir-fries. Even dishes that are normally nut-free may be cooked in peanut oil — cross-contamination risk is real at busy street stalls.

**Relatively safe options:** Tom yum soup (clear broth, verify no garnish), plain rice dishes, grilled meats without sauce, and some noodle soups where you can watch preparation. High-end restaurants with allergy-aware staff are significantly safer.

### For Diabetics

Thai cuisine presents mixed challenges. Many dishes are high in refined carbohydrates (white rice, rice noodles) and added sugar (palm sugar in many sauces and dressings).

**Good choices:** Tom yum soup (clear, low-calorie), grilled fish and chicken without sauce (yang), fresh spring rolls (goi cuon — not fried), stir-fried vegetables with tofu or chicken (request less sauce), coconut-based curries in moderate portions (the fat slows glucose absorption). **Avoid:** Pad thai and fried rice (high carb), sweet Thai iced tea and iced coffee (extremely high sugar), sticky rice desserts, and deep-fried snacks. Fresh fruit is abundant — guava, dragon fruit, and fresh coconut water are lower-GI choices compared to mango with sticky rice.

### For Vegans

Thailand is excellent for vegans, particularly in larger cities. The Buddhist tradition of "jay" (เจ) food is fully vegan — restaurants or stalls displaying a yellow jay flag serve strictly plant-based food that also avoids garlic and onion.

In Bangkok and Chiang Mai, dedicated vegan restaurants are abundant. At regular Thai restaurants, you can request dishes "jay" and ask for no fish sauce (น้ำปลา) and no oyster sauce — both are used widely in ostensibly vegetarian dishes. **Reliable vegan options:** Stir-fried vegetables with tofu (request jay), morning glory with garlic, mango sticky rice (confirm no butter), fresh spring rolls, and congee with vegetables.

### Water Safety

Do not drink tap water in Thailand. Drink sealed bottled water or use a certified filter. Avoid ice at street stalls (ice from machines at established restaurants is generally safe — it has a distinctive tubular shape). Be cautious with fresh-squeezed juices at street stalls that may add tap water.

### General Tips

- Street food from busy stalls with high turnover is generally safe — look for crowded local spots
- Chiang Mai has one of Southeast Asia's best vegetarian and vegan food scenes
- Carry printed allergy cards in Thai for your specific condition
- Air-conditioned restaurants generally have safer food handling for sensitive stomachs
- Most tourist areas now have allergy-aware restaurants — ask your hotel for recommendations`,
  },
  {
    slug: 'italy',
    name: 'Italy',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80',
    isFree: false,
    isPublished: true,
    conditions: ['gluten-free', 'lactose-free', 'vegetarian'],
    averageRating: 4.6,
    totalRatings: 29,
    content: `## Italy Health & Nutrition Guide for Travelers

Italy is one of the world's most celebrated food destinations — and for travelers with dietary conditions, it requires careful navigation. Paradoxically, Italy is also one of the most celiac-aware countries in Europe, making it better prepared than many destinations.

### For Gluten-Free & Celiac Travelers

Italy has the highest celiac disease diagnosis rate in Europe and robust legal protections for celiacs. Look for the Spiga Barrata symbol (a crossed wheat stalk) indicating certified gluten-free products. The Italian Celiac Association (AIC) publishes a free restaurant guide listing verified gluten-free establishments across the country.

**Certified GF options:** Many trattorias and pizzerias now offer genuine gluten-free pasta (pasta senza glutine) and pizza bases made in dedicated preparation areas. Always confirm cross-contamination protocols. **Naturally gluten-free Italian dishes:** Risotto (verify no pasta added and no bread thickening), polenta, grilled meats and fish without breadcrumb coating, fresh salads with olive oil, prosciutto crudo and cured meats (check labels for additives), most Italian cheeses, and minestrone soup (verify no pasta).

**Key risks to watch:** Breadcrumbs (pangrattato) are used as toppings and binders, most pasta sauces contain wheat pasta in standard restaurants, osso buco may use flour for coating, and tiramisu uses savoiardi (ladyfingers, wheat-based).

### For Lactose-Free Travelers

Italian cuisine uses dairy extensively — butter, cream, Parmigiano-Reggiano, ricotta, mozzarella, and gelato are central to the cuisine. However, **hard aged cheeses like Parmigiano-Reggiano (aged 24+ months) and Pecorino Romano are very low in lactose** and are often well-tolerated by lactose-intolerant individuals.

Many Italian restaurants and supermarkets now stock senza lattosio (lactose-free) milk, cream, and dairy products — Italy has one of the most developed lactose-free product ranges in Europe. **Safe choices:** Tomato-based pasta sauces (pomodoro, arrabbiata, amatriciana — verify no cream added), most pizza with light mozzarella (or ask for pizza bianca — olive oil, no cheese), grilled or baked fish and meats, bruschetta with olive oil and tomatoes.

### For Vegetarians

Italy is very accommodating for vegetarians. The cuisine has deep roots in plant-based cooking — beans, lentils, vegetables, and grains are central to Italian food culture.

**Excellent vegetarian options:** All pasta e pomodoro (tomato sauces), pasta e pesto (confirm no anchovies — traditional Ligurian pesto has none), pasta e fagioli (pasta and beans), ribollita (Tuscan bread and vegetable soup), panzanella (Tuscan bread salad), caprese, eggplant parmigiana, and most antipasto. **Watch for hidden meat:** Carbonara and amatriciana contain guanciale (pork cheek), classic ribollita in some regions uses chicken stock, and Caesar salad (imported recipe) contains anchovies.

### Regional Variation

Italian food varies enormously by region — cuisine in Bologna (rich, meat and dairy heavy) differs from Sicily (seafood, citrus, North African influences) and Venice (seafood, polenta). Dietary options vary accordingly.

### Water Safety

Tap water in Italy is safe to drink everywhere. Rome's famous nasoni (public drinking fountains throughout the city) provide free, cold, clean water. Most restaurants will charge for bottled water — requesting acqua del rubinetto (tap water) is perfectly acceptable and free.

### Key Phrases

- Senza glutine — without gluten
- Senza lattosio — without lactose
- Sono celiaco/a — I have celiac disease
- Sono vegetariano/a — I am vegetarian
- Sono allergico/a a... — I am allergic to...`,
  },
  {
    slug: 'nepal',
    name: 'Nepal',
    country: 'Nepal',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80',
    isFree: true,
    isPublished: true,
    conditions: ['vegetarian', 'vegan', 'diabetes', 'gluten-free'],
    averageRating: 4.8,
    totalRatings: 34,
    content: `## Nepal Health & Nutrition Guide for Travelers

Nepal is one of the world's most extraordinary trekking destinations — and one that requires serious food and water safety preparation. The altitude, remote locations, and limited food variety at high elevation demand careful nutritional planning.

### For Vegetarians & Vegans

Nepal is naturally very accommodating for plant-based travelers. The staple dish is dal bhat — lentils and rice served with vegetable curries, available everywhere from Kathmandu restaurants to remote tea houses. It is nutritionally complete, filling, and almost always vegetarian by default.

**Reliable vegetarian options:** Dal bhat (lentil soup with rice and vegetables), tsampa (roasted barley porridge — traditional Tibetan staple, served in many tea houses), vegetable momos (Tibetan dumplings — confirm no meat in filling), aloo tarkari (potato curry), saag (spinach or mustard greens), and fresh chapati. In Kathmandu, the Thamel neighborhood has dozens of vegetarian and vegan restaurants catering to the trekking crowd.

**For vegans:** Dairy products (ghee, yogurt, paneer) are common in Nepali cooking. Request "no ghee, no dairy" when ordering. Most dal bhat can be prepared dairy-free on request at tea houses.

### For Diabetics

At altitude, calorie needs increase significantly — the body burns more energy keeping warm and at lower oxygen levels. However, carbohydrate-heavy Nepali cuisine can challenge blood sugar management.

**Blood sugar-friendly strategies:** Eat dal bhat (the lentils provide protein and fiber that slow glucose absorption), request smaller rice portions with extra dal and vegetables, eat eggs when available (most tea houses serve them boiled or scrambled), and carry your own snacks. At altitude, hypoglycemia risk increases — always carry glucose tablets or sweets. Cold temperatures can affect insulin if you use it — store insulin in an inner pocket, not in your pack.

### For Gluten-Free Travelers

Nepal is moderately challenging for gluten-free travelers. Rice and lentils are naturally gluten-free and form the basis of Nepali cuisine. However, momos (dumplings) have wheat-flour wrappers, and some tea house soups may use wheat-based noodles.

**Safe options:** Dal bhat (always gluten-free), plain rice, lentil soups, potato dishes, boiled eggs, fresh vegetables, and corn-based dishes. Avoid: momos, thukpa noodle soup (wheat noodles), and some packaged snacks. Always confirm at tea houses.

### Water Safety

**Water is the single most important safety issue in Nepal.** Never drink untreated water anywhere in Nepal, including at mountain trekking destinations where water appears clean. Even high-altitude mountain streams can be contaminated by upstream human and animal activity.

**Treatment options on trek:** Boil water for 3 minutes at altitude (above 2,000m, boiling point is lower — 3 minutes ensures safety), use chlorine dioxide tablets (more effective than iodine at altitude against Giardia and Cryptosporidium), or use a UV purifier (SteriPen). Combine a hollow-fiber filter with UV or chemical treatment for maximum protection. In Kathmandu, bottled water is safe and widely available.

### High Altitude Nutrition

EBC (Everest Base Camp) trekkers and high-altitude climbers need specific nutritional strategies:

**Calorie needs:** Increase by 500–800 calories/day at altitude due to thermogenesis and hypoxic metabolism. Eat even when appetite is suppressed by altitude — this is a common mistake that worsens performance and recovery.

**AMS-supportive foods:** Garlic soup (specifically supported by traditional Sherpa medicine and some research for AMS prevention — order it at every tea house), iron-rich foods (dal, spinach, eggs) to support oxygen-carrying capacity, and carbohydrate-rich foods (the body uses carbohydrates more efficiently than fat at altitude).

**Avoid on acclimatisation days:** Alcohol (suppresses the hypoxic ventilatory response), heavy fats initially (slows digestion), and large meals before bed.

### General Tips

- Kathmandu's tourist restaurants are generally safe and hygienic — street food requires more caution
- Tea houses on popular treks (Annapurna Circuit, EBC, Langtang) are reliable but limited in menu variety
- Carry a 2-week supply of any medications you need — pharmacies are not accessible on remote treks
- Register with your country's embassy and with the TIMS (Trekkers' Information Management System)`,
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80',
    isFree: true,
    isPublished: true,
    conditions: ['diabetes', 'gluten-free', 'vegetarian', 'nut allergy'],
    averageRating: 4.7,
    totalRatings: 41,
    content: `## Singapore Health & Nutrition Guide for Travelers

Singapore is one of Asia's most food-safe destinations — stringent food hygiene regulations, excellent infrastructure, and a world-class restaurant scene make it highly accessible for travelers with dietary conditions. The hawker culture is central to Singaporean life and offers tremendous variety.

### For Diabetics

Singapore's food scene presents both excellent options and significant pitfalls for blood sugar management. The famous hawker centres are convenient and affordable, but many classic dishes are high-GI.

**Blood sugar-friendly hawker choices:** Chicken rice (request steamed, not roasted — less fat), fish soup bee hoon with less noodles and extra fish and vegetables, rojak without the sweet sauce, teh tarik made with less sugar (request "siu dai" — less sweet), and fresh coconut water (moderate GI, natural electrolytes). **Caution with:** Char kway teow (high-GI rice noodles with sweet dark sauce), nasi lemak (high-fat coconut rice), mee goreng (sweet fried noodles), and all the beloved kaya toast sets (white bread, sugar-laden kaya jam). The famous "teh tarik" (pulled tea with condensed milk) contains significant sugar — request "siu dai" for less sweetness or "kosong" for unsweetened.

**Business travelers with diabetes:** Hotel breakfasts in Singapore tend to be extensive Western/Asian buffets — stick to eggs, fresh fruit, plain congee with protein toppings, and avoid pastries and sweetened juices.

### For Gluten-Free Travelers

Singapore is moderately navigable for gluten-free travelers with care. The biggest challenge is soy sauce — used widely across Chinese, Malay, and Indian hawker food.

**Naturally gluten-free options:** Chicken rice (plain steamed rice and poached chicken — request no soy sauce), satay (grilled meats — verify marinades, request no soy sauce), fresh fruit from hawker centres, roti prata (Indian flatbread — made with wheat flour, AVOID), nasi padang (Malay rice with dishes — select dishes without soy sauce), and most Indian vegetarian dishes based on lentils and vegetables.

**Key risk dishes:** Most Chinese hawker food uses soy sauce (char kway teow, fried rice, stir-fries), laksa broth may contain wheat-thickeners, and many satay marinades contain soy sauce. Indian food at hawker centres is often gluten-free friendly — the masalas, lentil dals, and rice dishes are typically wheat-free.

### For Vegetarians

Singapore is excellent for vegetarians, especially those who eat eggs and dairy. The Indian community supports a thriving vegetarian food culture, and dedicated vegetarian hawker stalls are common at most centres.

**Reliable vegetarian options:** Indian vegetarian stalls (thosai, idli, vegetarian biryani, paneer dishes, sambar), Chinese vegetarian restaurants (mock meat dishes using soy protein), vegetable bee hoon (rice vermicelli with vegetables), and fresh tropical fruit. Many Buddhist Chinese restaurants in Singapore are fully vegan and serve elaborate plant-based meals at low prices.

### For Nut Allergy Travelers

Singapore requires vigilance for nut allergies, particularly peanuts. Peanuts appear in satay sauce, some rojak dressings, and as garnishes on several dishes. Tree nuts are less prevalent but appear in Indian and Peranakan dishes.

**High caution dishes:** Satay (peanut sauce), gado-gado (peanut sauce), rojak (peanut garnish), some Indian curries with cashews, and Peranakan dishes with candlenuts. Safe options: chicken rice, most fish-based dishes without sauces, plain congee, and fresh fruit.

### Water Safety

Tap water in Singapore is safe to drink — it meets WHO drinking water standards and is among the cleanest in Asia. No need for bottled water.

### General Tips

- Hawker centres are the heart of Singapore food culture — safe, affordable, and diverse
- Most hawker stalls display their SFA (Singapore Food Agency) hygiene grade — A or B are safe
- Saying "less sweet" ("siu dai") and "less salt" ("less salt, please") is well understood at all food stalls
- Changi Airport's Terminal 3 food court has excellent allergen-labeling — useful for transit travelers
- Medical care in Singapore is world-class — the best in Southeast Asia if you need it`,
  },
  {
    slug: 'india',
    name: 'India',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80',
    isFree: true,
    isPublished: true,
    conditions: ['vegetarian', 'vegan', 'diabetes', 'gluten-free'],
    averageRating: 4.6,
    totalRatings: 47,
    content: `## India Health & Nutrition Guide for Travelers

India is one of the world's great food destinations — an extraordinary diversity of regional cuisines, deep vegetarian and vegan traditions, and Ayurvedic food culture that is thousands of years old. For travelers with dietary conditions, India ranges from very accommodating (vegetarians, vegans) to challenging (gluten-free).

### For Vegetarians & Vegans

India is the easiest country in the world for vegetarian travelers. The majority of the population eats vegetarian food, and most Indian restaurants — particularly in the north and south — have extensive vegetarian menus. In many regions, vegetarianism is the default, not the exception.

**North India vegetarian staples:** Dal makhani (black lentils — usually contains butter, ask for vegan version), chana masala (chickpea curry — naturally vegan), palak paneer (spinach and cheese — not vegan), aloo gobi (potato and cauliflower — naturally vegan), rajma (red kidney beans), and fresh chapati or paratha.

**South India vegetarian staples:** Idli (steamed rice cakes — naturally vegan and gluten-free), dosa (fermented rice and lentil crepe — naturally vegan and gluten-free), sambar (lentil vegetable soup — naturally vegan), rasam (thin spiced broth), and coconut chutney. South Indian cuisine is particularly well-suited to vegans and gluten-free travelers.

**Wellness and yoga travelers:** Rishikesh, India's yoga capital, is predominantly vegetarian and sattvic (pure, light foods). Most restaurants serve what is considered sattvic food — mild spices, no onion or garlic, light cooking methods. This tradition extends throughout Uttarakhand. Goa has an excellent plant-based and organic restaurant scene.

### For Diabetics

Traditional Indian cuisine has both supportive and challenging elements for blood sugar management.

**Favorable:** Whole lentils and legumes (some of the best blood sugar-stabilizing foods globally), bitter gourd (karela — specifically shown to lower blood glucose), fenugreek seeds (methi — used in cooking, proven blood sugar benefits), and the high-fiber vegetables in many Indian dishes. South Indian fermented foods (idli, dosa, dhokla) have lower GI than their ingredients suggest due to fermentation.

**Challenging:** White basmati rice is a dietary staple — portion control is key. Biryani, puri (deep-fried bread), maida (refined wheat flour) in many North Indian breads, and the sugar in mithai (Indian sweets) and lassi can spike blood sugar. Request whole wheat chapati instead of naan, and eat smaller rice portions with generous dal.

### For Gluten-Free Travelers

India is moderately challenging for gluten-free travelers. North Indian cuisine is wheat-heavy (roti, naan, paratha, poori, samosa pastry). South Indian cuisine is primarily rice and lentil-based and is largely naturally gluten-free.

**Gluten-free safe regions:** South India (Tamil Nadu, Kerala, Karnataka, Andhra Pradesh) — dosa, idli, rice dishes, and most curries are naturally gluten-free. Seek out South Indian restaurants across India for the safest GF options.

**High-risk in North India:** Roti, naan, paratha, poori, samosa (wheat pastry), most street snacks (pakora, bhatura), and many sweets (barfi may contain wheat). Key phrase: "मुझे गेहूँ से एलर्जी है" (mujhe gehoon se allergy hai — I am allergic to wheat).

### Water Safety

**Do not drink tap water anywhere in India.** This is one of the most important safety rules for India travel. Drink only sealed commercial bottled water (Bisleri, Kinley, Aquafina are reliable brands — check the seal). Use bottled water for brushing teeth if you have a sensitive stomach.

**Ice:** Avoid ice except at established international-standard hotels and restaurants. In budget and street-food settings, ice may be made from tap water.

**Fresh fruit and salads:** Eat cooked vegetables for the first few days to allow gut acclimatisation. Peel all fruit yourself. Avoid pre-cut fruit from street stalls. Well-known restaurant chains and hotel restaurants are generally safe for salads.

### General Tips

- India has vast regional variation — food in Kerala is entirely different from Punjab or Rajasthan
- Carry oral rehydration salts — traveler's diarrhea is common even with precautions
- Indian pharmacies (chemists) are accessible, affordable, and stock most medications
- Ayurvedic practitioners and clinics are widely available in wellness tourism regions
- Carrying a medical certificate for prescription medications is advised`,
  },
  {
    slug: 'mexico',
    name: 'Mexico',
    country: 'Mexico',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200&q=80',
    isFree: false,
    isPublished: true,
    conditions: ['diabetes', 'vegan', 'nut allergy'],
    averageRating: 4.5,
    totalRatings: 21,
    content: `## Mexico Health & Nutrition Guide for Travelers

Mexico offers extraordinarily rich and diverse cuisine, but travelers need to be mindful about food and water safety — particularly outside major cities. The cuisine varies significantly by region, from the complex moles of Oaxaca to the seafood-rich cooking of the Yucatan peninsula.

### For Diabetics

The traditional Mexican diet is actually quite favorable for diabetics when eaten authentically. Corn tortillas have a substantially lower GI than flour tortillas, black beans are high in fiber and protein (excellent for blood sugar control), and fresh salsas, guacamole, and vegetables are central to the cuisine.

**Good choices:** Black beans (frijoles negros — some of the best blood sugar-stabilizing foods available), corn tortillas in moderation (2–3 per meal), grilled meats (carne asada, pollo a la plancha), fresh guacamole (healthy fats, very low GI), nopales (cactus paddles — research specifically supports their blood sugar-lowering effect), fresh salsas (tomato, tomatillo, chile), and vegetable-based soups. **Avoid:** Flour tortillas (high GI), churros and pan dulce (sweet pastries, very high sugar), horchata and aguas frescas (high sugar), large portions of white rice, and refried beans made with lard (add fat but generally low-GI themselves).

### For Vegans

Mexico is increasingly vegan-friendly, particularly in Mexico City (one of Latin America's leading vegan food cities), Oaxaca, and coastal tourist areas. Traditional Mexican cuisine has excellent plant foundations: corn, beans, squash, chile peppers, avocado, and fresh vegetables — the pre-Hispanic "three sisters" diet.

**Key challenge:** Lard (manteca) is traditionally used in refried beans, tamale masa, and some corn tortillas — always ask ¿Los frijoles tienen manteca? (Do the beans contain lard?). **Reliable vegan options everywhere:** Fresh guacamole, corn tortillas (confirm no lard), bean tacos without lard, elote (street corn, confirm no butter), fresh fruit, agua de jamaica (hibiscus drink, naturally vegan), and mushroom or vegetable tacos. Mexico City's Roma and Condesa neighborhoods have dozens of dedicated vegan restaurants.

### For Nut Allergy Travelers

**Mole sauces** are the primary risk — mole negro and mole rojo traditionally contain peanuts and sometimes almonds or other tree nuts. These appear throughout Mexican cuisine in Oaxaca, Puebla, and Mexico City. Always ask specifically about mole. Pipián sauce is made from pumpkin seeds (not tree nuts, but cross-contamination is possible in kitchens). Piñon (pine nuts) appear in some regional dishes. Street snacks frequently contain mixed nuts.

**Ask:** ¿Contiene nueces o cacahuates? (Does this contain nuts or peanuts?) Peanuts are called cacahuates in Mexico — confirm both "nueces" (tree nuts) and "cacahuates" (peanuts) when ordering.

### Water Safety

**Do not drink tap water in Mexico — this is non-negotiable.** Drink only bottled water (agua embotellada) or agua purificada. Use bottled water for brushing teeth if you have a sensitive stomach. Ice at established tourist restaurants and hotels is generally from purified water — avoid ice at market stalls and street carts. Raw vegetables washed in tap water are a common source of illness. Stick to cooked vegetables or peel your own fruit.

### General Food Safety

"Montezuma's Revenge" (traveler's diarrhea) affects a significant proportion of first-time visitors. **Reduce your risk:** Eat from busy establishments with high turnover (a long queue is a safety signal), eat cooked food when possible for the first few days, and carry oral rehydration salts as a precaution. Probiotics taken 1–2 weeks before departure may reduce risk.

### Regional Highlights

- **Oaxaca** — complex moles, tlayudas, chapulines (grasshoppers — traditional protein), excellent mezcal
- **Yucatan** — cochinita pibil, citrus-marinated seafood, habanero-forward salsas
- **Mexico City** — world-class restaurant scene, excellent street tacos, thriving vegan food culture
- **Baja California** — fish tacos, fresh seafood, avocado-everything`,
  },
]

async function seed() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false })
  console.log('Connected to MongoDB')

  for (const dest of destinations) {
    await Destination.findOneAndUpdate(
      { slug: dest.slug },
      { $set: dest },
      { upsert: true, new: true }
    )
    console.log(`✓  ${dest.name} (${dest.isFree ? 'Free' : 'Pro'}) — ${dest.averageRating} avg, ${dest.totalRatings} ratings`)
  }

  console.log('\nDestination seeding complete.')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
