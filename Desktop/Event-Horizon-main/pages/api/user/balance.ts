import { getSession } from 'next-auth/react';
import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getSession({ req });
    if (!session?.user?.email) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection('users').findOne({
            email: session.user.email
        }, {
            projection: { balance: 1 }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
            balance: user.balance || 0
        });
    } catch (error) {
        console.error('Error fetching balance:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}