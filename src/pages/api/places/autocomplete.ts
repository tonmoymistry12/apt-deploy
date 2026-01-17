import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { input } = req.query;

  if (!input) {
    return res.status(400).json({ error: 'Input is required' });
  }

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input,
          types: 'lodging',  // This will restrict results to hotels/lodging
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch place suggestions' });
  }
} 