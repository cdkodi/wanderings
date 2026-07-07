import { db } from './index';
import { trips, stays, activities, photos } from './schema';

const CLOUD = 'dwj2rey6u';
function cdnUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${publicId}`;
}

async function seed() {
  console.log('Seeding database...');

  // Clear existing seed data
  await db.delete(photos);
  await db.delete(activities);
  await db.delete(stays);
  await db.delete(trips);

  // Trip 1: Japan
  const [japan] = await db.insert(trips).values({
    slug: 'kyoto-tokyo-2023',
    title: 'Kyoto & Tokyo',
    country: 'Japan',
    region: 'Asia',
    year: 2023,
    month: 'April',
    duration: '12 days',
    travelWith: 'Family',
    story: `# Kyoto & Tokyo — April 2023

We arrived in Osaka bleary-eyed after a 14-hour flight and immediately felt the city's electric pulse. The shinkansen to Kyoto was a revelation — mountains, rice paddies, and then suddenly the old capital.

Kyoto in cherry blossom season is everything you've heard and more. Maruyama Park at dusk, lanterns glowing through the pink haze. The kids couldn't believe the deer in Nara were just *there*, wandering between school groups and tourists alike.

Tokyo was a different world entirely — loud, layered, and endlessly generous. Shibuya Crossing at midnight. Tsukiji breakfast sushi at 6am. Finding the perfect ramen down a steam-fogged alley in Shinjuku.

We ate our way through both cities and came home convinced Japan is the finest food country on earth.`,
    tips: `- Book the Ghibli Museum tickets months in advance — they sell out instantly.
- Get a Suica card at the airport; it works on every train and convenience store.
- April is cherry blossom season — beautiful but crowded. Book accommodation early.
- Wear slip-on shoes; you'll be taking them off at every temple and many restaurants.
- 7-Eleven in Japan is genuinely excellent. Don't skip it.`,
    emoji: '🌸',
    published: true,
  }).returning();

  await db.insert(stays).values([
    { tripId: japan.id, name: 'Hyatt Regency Kyoto', description: 'Excellent location near Sanjusangendo. Staff went above and beyond helping us with restaurant bookings.', location: 'Kyoto', sortOrder: 0 },
    { tripId: japan.id, name: 'Park Hyatt Tokyo', description: 'The Lost in Translation hotel. Views from the top-floor bar are worth the splurge alone.', location: 'Tokyo', sortOrder: 1 },
  ]);

  await db.insert(activities).values([
    { tripId: japan.id, name: 'Fushimi Inari — the full 4-hour hike up the mountain', sortOrder: 0 },
    { tripId: japan.id, name: 'Arashiyama bamboo grove at sunrise (before the crowds)', sortOrder: 1 },
    { tripId: japan.id, name: 'Nishiki Market food tour', sortOrder: 2 },
    { tripId: japan.id, name: 'Nara deer park day trip', sortOrder: 3 },
    { tripId: japan.id, name: 'Ghibli Museum, Mitaka', sortOrder: 4 },
    { tripId: japan.id, name: 'Shibuya Crossing and Harajuku', sortOrder: 5 },
    { tripId: japan.id, name: 'Tsukiji Outer Market breakfast', sortOrder: 6 },
  ]);

  await db.insert(photos).values([
    { tripId: japan.id, cloudinaryId: 'samples/landscapes/nature-mountains', url: cdnUrl('samples/landscapes/nature-mountains'), caption: 'Cherry blossoms, Maruyama Park', sortOrder: 0 },
    { tripId: japan.id, cloudinaryId: 'samples/food/spices', url: cdnUrl('samples/food/spices'), caption: 'Nishiki Market — the kitchen of Kyoto', sortOrder: 1 },
    { tripId: japan.id, cloudinaryId: 'samples/landscapes/architecture-signs', url: cdnUrl('samples/landscapes/architecture-signs'), caption: 'Shibuya at midnight', sortOrder: 2 },
    { tripId: japan.id, cloudinaryId: 'samples/food/fish-vegetables', url: cdnUrl('samples/food/fish-vegetables'), caption: 'Tsukiji breakfast sushi', sortOrder: 3 },
  ]);

  // Trip 2: Portugal
  const [portugal] = await db.insert(trips).values({
    slug: 'lisbon-alentejo-2022',
    title: 'Lisbon & the Alentejo',
    country: 'Portugal',
    region: 'Europe',
    year: 2022,
    month: 'September',
    duration: '10 days',
    travelWith: 'Partner',
    story: `# Lisbon & the Alentejo — September 2022

Portugal surprised us at every turn. We'd expected Lisbon to be beautiful — we hadn't expected it to be quite so *alive*. The fado drifting from a restaurant on a Tuesday night. The weight of a pastel de nata still warm from the oven. The trams grinding their way up hills that shouldn't be legal.

After four days in the city we hired a car and drove east into the Alentejo. The landscape changed immediately — vast cork forests, golden plains, white-washed villages perched on hilltops. Time moved differently here.

We stayed three nights at a herdade — a working farm estate — and ate the best pork of our lives, grown fifty metres from the table.`,
    tips: `- September is ideal: summer crowds have gone, the heat is bearable, and prices drop.
- The Alentejo is best by car — public transport is sparse.
- Book restaurants well ahead in Lisbon; the good ones fill up weeks out.
- Don't skip Évora — a full day is not enough.
- Portuguese drivers are aggressive. Hire a small car.`,
    emoji: '🏛️',
    published: true,
  }).returning();

  await db.insert(stays).values([
    { tripId: portugal.id, name: 'Bairro Alto Hotel', description: 'Perfectly located in the Chiado. Rooftop bar has views over the Tagus. Breakfast is exceptional.', location: 'Lisbon', sortOrder: 0 },
    { tripId: portugal.id, name: 'Herdade do Esporão', description: 'Working wine estate in the Alentejo. Simple rooms, extraordinary food, wine straight from the barrel.', location: 'Reguengos de Monsaraz', sortOrder: 1 },
  ]);

  await db.insert(activities).values([
    { tripId: portugal.id, name: 'Pastéis de Belém — eat at least four', sortOrder: 0 },
    { tripId: portugal.id, name: 'Jerónimos Monastery', sortOrder: 1 },
    { tripId: portugal.id, name: 'Fado evening in Mouraria', sortOrder: 2 },
    { tripId: portugal.id, name: 'Sintra day trip — Palácio Nacional da Pena', sortOrder: 3 },
    { tripId: portugal.id, name: 'Évora Roman Temple and cathedral', sortOrder: 4 },
    { tripId: portugal.id, name: 'Monsaraz village at sunset', sortOrder: 5 },
  ]);

  await db.insert(photos).values([
    { tripId: portugal.id, cloudinaryId: 'samples/landscapes/beach-boat', url: cdnUrl('samples/landscapes/beach-boat'), caption: 'Boats on the Tagus, Belém', sortOrder: 0 },
    { tripId: portugal.id, cloudinaryId: 'samples/food/dessert', url: cdnUrl('samples/food/dessert'), caption: 'Pastéis de Belém, still warm', sortOrder: 1 },
    { tripId: portugal.id, cloudinaryId: 'samples/landscapes/girl-urban-view', url: cdnUrl('samples/landscapes/girl-urban-view'), caption: 'Chiado rooftops, Lisbon', sortOrder: 2 },
  ]);

  // Trip 3: Iceland
  const [iceland] = await db.insert(trips).values({
    slug: 'iceland-ring-road-2024',
    title: 'Iceland Ring Road',
    country: 'Iceland',
    region: 'Europe',
    year: 2024,
    month: 'February',
    duration: '8 days',
    travelWith: 'Partner',
    story: `# Iceland Ring Road — February 2024

We drove Iceland's Ring Road in February, which everyone told us was either brave or stupid. It turned out to be neither — just extraordinary.

The light in Iceland in winter is something you cannot photograph properly. Golden hour lasts from 11am to 2pm, then the blues deepen into a long, bruised dusk. We chased the northern lights three nights and found them on the fourth, standing in a field outside Vík at 11pm, freezing, mouths open.

The ice caves under Vatnajökull were the highlight — blue light so deep and cold it looked digital. We walked on a glacier in crampons and felt approximately three years old with wonder.`,
    tips: `- Book a 4WD. You'll need it if you leave the main ring road, and you should.
- Ice cave tours book out — reserve 2+ months ahead.
- Pack more layers than you think. Then add two more.
- The Blue Lagoon is worth it despite being touristy — book the premium package.
- February northern lights: check the aurora forecast app obsessively.`,
    emoji: '🌌',
    published: true,
  }).returning();

  await db.insert(stays).values([
    { tripId: iceland.id, name: 'Hotel Rangá', description: 'Aurora-watching cabins in the south. Staff wake you at 2am when the lights appear. Worth every krona.', location: 'Hella', sortOrder: 0 },
    { tripId: iceland.id, name: 'Fosshotel Glacier Lagoon', description: 'Right next to Jökulsárlón — walk to the iceberg lagoon at dawn before anyone else arrives.', location: 'Skaftafell', sortOrder: 1 },
  ]);

  await db.insert(activities).values([
    { tripId: iceland.id, name: 'Ice cave tour, Vatnajökull', sortOrder: 0 },
    { tripId: iceland.id, name: 'Northern lights, field outside Vík', sortOrder: 1 },
    { tripId: iceland.id, name: 'Jökulsárlón glacier lagoon at dawn', sortOrder: 2 },
    { tripId: iceland.id, name: 'Skógafoss and Seljalandsfoss waterfalls', sortOrder: 3 },
    { tripId: iceland.id, name: 'Glacier hike on Sólheimajökull', sortOrder: 4 },
    { tripId: iceland.id, name: 'Blue Lagoon geothermal spa', sortOrder: 5 },
    { tripId: iceland.id, name: 'Golden Circle: Þingvellir, Geysir, Gullfoss', sortOrder: 6 },
  ]);

  await db.insert(photos).values([
    { tripId: iceland.id, cloudinaryId: 'samples/people/boy-snow-surfing', url: cdnUrl('samples/people/boy-snow-surfing'), caption: 'Glacier hike on Sólheimajökull', sortOrder: 0 },
    { tripId: iceland.id, cloudinaryId: 'samples/animals/reindeer', url: cdnUrl('samples/animals/reindeer'), caption: 'Reindeer on the road to Vík', sortOrder: 1 },
    { tripId: iceland.id, cloudinaryId: 'samples/landscapes/nature-mountains', url: cdnUrl('samples/landscapes/nature-mountains'), caption: 'The drive east — golden hour all afternoon', sortOrder: 2 },
  ]);

  console.log('✓ Seeded 3 trips with stays, activities, and 10 placeholder photos');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
