import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

interface Event {
    _id: string
    title: string
    artist: string
    image: string
    date: string
    time: string
    venue: string
    location: string
    category: string
    price: number
    originalPrice?: number
    rating: number
    seatsLeft: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ events: Event[] } | { error: string }>
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const client = await clientPromise
        const db = client.db('eventhorizon')

        const mongoEvents = await db
            .collection('events')
            .find({})
            .sort({ date: 1 }) // Sort by date ascending
            .toArray()

        const events: Event[] = mongoEvents.map(event => ({
            _id: event._id.toString(),
            title: event.title,
            artist: event.artist,
            image: event.image,
            date: new Date(event.date).toISOString(),
            time: event.time,
            venue: event.venue,
            location: event.location,
            category: event.category,
            price: Number(event.price),
            originalPrice: event.originalPrice ? Number(event.originalPrice) : undefined,
            rating: Number(event.rating),
            seatsLeft: Number(event.seatsLeft)
        }))

        // ✅ Log image URLs to verify they are coming through
        console.log('Fetched event images:', events.map(e => e.image))

        return res.status(200).json({ events })
    } catch (error) {
        console.error('Database error:', error)
        return res.status(500).json({
            error: 'Failed to fetch events',
            ...(error instanceof Error && { message: error.message })
        })
    }
}
