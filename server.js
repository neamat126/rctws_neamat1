import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const API_PASSWORD   = process.env.MWRI_API_PASSWORD;
const PACWA_PASSWORD = process.env.PACWA_API_PASSWORD;
const PORT           = process.env.PORT || 3001;

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/GetDetails', async (req, res) => {
  try {
    const { nationalId } = req.body;
    console.log('Request received for:', nationalId);

    const response = await fetch('https://apps.mwri.gov.eg/hr2/api/GetDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://apps.mwri.gov.eg/hr2/'
      },
      body: JSON.stringify({ nationalId, password: API_PASSWORD })
    });

    const text = await response.text();
    console.log('API Response status:', response.status);
    console.log('API Response length:', text.length);

    try {
      const data = JSON.parse(text);
      console.log('Success! Data keys:', Object.keys(data));
      res.json(data);
    } catch {
      console.log('Response is not JSON, first 500 chars:', text.substring(0, 500));
      res.status(500).json({ error: 'API returned invalid JSON' });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/getData', async (req, res) => {
  try {
    const { national_id } = req.body;
    console.log('Programs request received for:', national_id);

    if (!national_id) {
      return res.status(400).json({ error: 'national_id is required' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('https://pacwa-eg.org/AA/getData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://pacwa-eg.org/'
      },
      body: JSON.stringify({ national_id, password: PACWA_PASSWORD }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    const text = await response.text();
    console.log('Programs API Response status:', response.status);
    console.log('Programs API Response length:', text.length);

    if (!response.ok) {
      return res.status(response.status).json({ error: `API returned ${response.status}` });
    }

    try {
      const data = JSON.parse(text);
      console.log('Programs Success! Data received');
      res.json(data);
    } catch {
      res.status(500).json({ error: 'API returned invalid JSON', raw: text.substring(0, 500) });
    }
  } catch (error) {
    console.error('Programs Server error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/GetManagerByEmployeeNationalID', async (req, res) => {
  try {
    const { nationalId } = req.body;
    console.log('Manager request received for:', nationalId);

    const response = await fetch('https://apps.mwri.gov.eg/hr2/api/GetManagerByEmployeeNationalID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://apps.mwri.gov.eg/hr2/'
      },
      body: JSON.stringify({ nationalId, password: API_PASSWORD })
    });

    const text = await response.text();
    console.log('Manager API status:', response.status);

    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch {
      res.status(500).json({ error: 'API returned invalid JSON' });
    }
  } catch (error) {
    console.error('Manager Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/courses_for_promotion', async (req, res) => {
  try {
    const { org_code, Degree, Years_Remain } = req.body;
    console.log('Courses for promotion request:', { org_code, Degree, Years_Remain });

    const response = await fetch('https://www.pacwa-eg.org/AA/courses_for_promotion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.pacwa-eg.org/'
      },
      body: JSON.stringify({ org_code, Degree, Years_Remain, password: PACWA_PASSWORD })
    });

    const text = await response.text();
    console.log('Courses API status:', response.status, 'length:', text.length);

    try {
      res.json(JSON.parse(text));
    } catch {
      res.status(500).json({ error: 'API returned invalid JSON', raw: text.substring(0, 300) });
    }
  } catch (error) {
    console.error('Courses for promotion error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload_Data', async (req, res) => {
  try {
    const body = req.body;
    console.log('Upload data request:', body);

    const jsonStr = JSON.stringify(body);
    const encoded = `filename=&filedata=${encodeURIComponent(jsonStr)}&otherdata=${encodeURIComponent(jsonStr)}`;

    const response = await fetch('https://pacwa-eg.org/BB/upload_Data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://pacwa-eg.org/'
      },
      body: encoded
    });

    const text = await response.text();
    console.log('Upload response:', text);

    try {
      res.json(JSON.parse(text));
    } catch {
      res.json({ status: text.trim() || 'sent' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trainees', async (req, res) => {
  try {
    const { Manager_ID } = req.body;
    console.log('Trainees request for manager:', Manager_ID);

    const response = await fetch('http://pacwa-eg.org/BB/trainees_api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      body: JSON.stringify({ Manager_ID })
    });

    const text = await response.text();
    console.log('Trainees response length:', text.length);

    try {
      res.json(JSON.parse(text));
    } catch {
      res.status(500).json({ error: 'Invalid JSON' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
