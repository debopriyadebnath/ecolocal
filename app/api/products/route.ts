import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Product from '../../../models/Product';
import { calculateCarbonFootprint, getSustainabilityScore } from '../../../lib/utils';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const query: any = {};
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minSustainability = searchParams.get('minSustainability');
    const sort = searchParams.get('sort') || '-createdAt';

    if (category) query.category = category;
    if (minPrice) query.price = { $gte: parseFloat(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    if (minSustainability) query.sustainabilityScore = { $gte: parseInt(minSustainability) };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('vendor', 'name email')
      .sort(sort)
      .limit(50);

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Calculate carbon footprint and sustainability score
    const carbonFootprint = calculateCarbonFootprint(body);
    const sustainabilityScore = getSustainabilityScore(body);

    const product = await Product.create({
      ...body,
      carbonFootprint,
      sustainabilityScore
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
