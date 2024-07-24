import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
    await dbConnect();
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'PUT') {
        const { autoplay, preload, only_dub, only_sub } = req.body;

        try {
            const user = await User.findOne({ userId: session.user.id });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.settings = {
                autoplay: typeof autoplay === 'boolean' ? autoplay : user.settings.autoplay,
                preload: typeof preload === 'boolean' ? preload : user.settings.preload,
                only_dub: typeof only_dub === 'boolean' ? only_dub : user.settings.only_dub,
                only_sub: typeof only_sub === 'boolean' ? only_sub : user.settings.only_sub,
            };

            if (user.settings.only_dub) {
                user.settings.only_sub = false;
            } else if (user.settings.only_sub) {
                user.settings.only_dub = false;
            }

            await user.save();

            res.status(200).json(user.settings);
        } catch (error) {
            res.status(500).json({ message: 'Error updating settings', error: error.message });
        }
    } else if (req.method === 'GET') {
        try {
            const user = await User.findOne({ userId: session.user.id });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user.settings);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching settings', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
