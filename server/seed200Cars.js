import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const brands = [
    'Toyota', 'Honda', 'Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'BMW', 'Audi', 'Mercedes-Benz',
    'Kia', 'MG', 'Volkswagen', 'Skoda', 'Jeep', 'Ford', 'Lexus', 'Volvo', 'Land Rover', 'Tesla', 'Porsche'
];

const models = {
    'Toyota': ['Fortuner', 'Corolla', 'Camry', 'Innova', 'Urban Cruiser', 'Glanza'],
    'Honda': ['Civic', 'City', 'Accord', 'Amaze', 'Elevate'],
    'Maruti Suzuki': ['Swift', 'Ertiga', 'Brezza', 'Baleno', 'Dzire', 'Jimny'],
    'Hyundai': ['Creta', 'Verna', 'Elantra', 'i20', 'Venue', 'Tucson'],
    'Tata': ['Nexon', 'Safari', 'Harrier', 'Tiago', 'Punch', 'Curvv'],
    'Mahindra': ['Thar', 'Scorpio', 'XUV700', 'XUV300', 'Bolero'],
    'BMW': ['X5', 'X7', '3 Series', '5 Series', 'M2', 'i4'],
    'Audi': ['Q7', 'Q5', 'A4', 'A6', 'RS6', 'e-tron'],
    'Mercedes-Benz': ['GLC', 'GLE', 'S-Class', 'C-Class', 'AMG GT'],
    'Kia': ['Seltos', 'Sonet', 'Carnival', 'EV6'],
    'MG': ['Hector', 'Astor', 'Zs EV', 'Comet'],
    'Volkswagen': ['Tiguan', 'Virtus', 'Taigun'],
    'Skoda': ['Slavia', 'Kushaq', 'Kodiaq'],
    'Jeep': ['Compass', 'Wrangler', 'Grand Cherokee'],
    'Ford': ['Everest', 'Mustang', 'Bronco'],
    'Lexus': ['RX', 'NX', 'ES'],
    'Volvo': ['XC90', 'XC60', 'XC40'],
    'Land Rover': ['Defender', 'Range Rover Sport', 'Evoque'],
    'Tesla': ['Model 3', 'Model Y', 'Model S'],
    'Porsche': ['911 Carrera', 'Cayenne', 'Macan', 'Taycan']
};

const categories = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Sports', 'Electric'];
const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const transmissions = ['Manual', 'Automatic', 'Semi-Automatic'];
const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

const imageUrls = [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1493238477100-337e44130109?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1471444668940-145fba608a28?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1552519507-8e4cc807caee?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800'
];

const ownerId = '69889c982cdc7489b470fba8'; // Found ealier

async function main() {
    console.log('Seeding 200 cars...');

    const carsToCreate = [];

    for (let i = 0; i < 200; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const model = models[brand][Math.floor(Math.random() * models[brand].length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const fuel_type = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
        const transmission = transmissions[Math.floor(Math.random() * transmissions.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const imgUrl = imageUrls[i % imageUrls.length];

        const price = 1000 + Math.floor(Math.random() * 9000); // Between 1000 and 10000
        const year = 2018 + Math.floor(Math.random() * 7); // 2018 to 2024
        const capacity = 4 + Math.floor(Math.random() * 4); // 4 to 7

        carsToCreate.push({
            ownerId,
            brand,
            model,
            image: imgUrl,
            year,
            category,
            seating_capacity: capacity,
            fuel_type,
            transmission,
            pricePerDay: price.toString(),
            location,
            description: `Experience the comfort and power of the ${brand} ${model}. Perfect for city trips and long drives in ${location}.`,
            isAvailable: true
        });
    }

    // Use createMany if supported by the provider, but with MongoDB transaction might be tricky.
    // Prisma MongoDB supports createMany.
    const result = await prisma.car.createMany({
        data: carsToCreate
    });

    console.log(`Successfully added ${result.count} cars.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
