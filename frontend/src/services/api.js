const API_BASE = 'https://medwaste-ai.onrender.com/api';

// Health API
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.error('Backend health check error:', err);
    return { status: 'offline', error: err.message };
  }
}

// Module 1: AI Waste Classification API
export async function classifyWasteImage(file) {
  try {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    const res = await fetch(`${API_BASE}/waste/classify`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Classification request failed');
    return await res.json();
  } catch (err) {
    console.error('AI Classification API Error:', err);
    throw err;
  }
}

// Module 2: Waste Management CRUD APIs
export async function fetchWasteRecords(filters = {}) {
  try {
    const query = new URLSearchParams();
    if (filters.category && filters.category !== 'All') query.append('category', filters.category);
    if (filters.status && filters.status !== 'All') query.append('status', filters.status);
    if (filters.search) query.append('search', filters.search);

    const res = await fetch(`${API_BASE}/waste?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch waste records');
    return await res.json();
  } catch (err) {
    console.error('Fetch Waste Records Error:', err);
    throw err;
  }
}

export async function createWasteRecord(data) {
  try {
    const res = await fetch(`${API_BASE}/waste`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create waste record');
    return await res.json();
  } catch (err) {
    console.error('Create Waste Record Error:', err);
    throw err;
  }
}

export async function updateWasteRecord(id, data) {
  try {
    const res = await fetch(`${API_BASE}/waste/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update waste record');
    return await res.json();
  } catch (err) {
    console.error('Update Waste Record Error:', err);
    throw err;
  }
}

export async function deleteWasteRecord(id) {
  try {
    const res = await fetch(`${API_BASE}/waste/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete waste record');
    return await res.json();
  } catch (err) {
    console.error('Delete Waste Record Error:', err);
    throw err;
  }
}

// Module 3: Collection Requests APIs
export async function fetchCollectionRequests(filters = {}) {
  try {
    const query = new URLSearchParams();
    if (filters.status && filters.status !== 'All') query.append('status', filters.status);
    if (filters.priority && filters.priority !== 'All') query.append('priority', filters.priority);
    if (filters.search) query.append('search', filters.search);

    const res = await fetch(`${API_BASE}/collections?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch collection requests');
    return await res.json();
  } catch (err) {
    console.error('Fetch Collection Requests Error:', err);
    throw err;
  }
}

export async function createCollectionRequest(data) {
  try {
    const res = await fetch(`${API_BASE}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create collection request');
    return await res.json();
  } catch (err) {
    console.error('Create Collection Request Error:', err);
    throw err;
  }
}

export async function updateCollectionRequest(id, data) {
  try {
    const res = await fetch(`${API_BASE}/collections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update collection request');
    return await res.json();
  } catch (err) {
    console.error('Update Collection Request Error:', err);
    throw err;
  }
}

// Module 4: Collection Units APIs
export async function fetchCollectionUnits() {
  try {
    const res = await fetch(`${API_BASE}/units`);
    if (!res.ok) throw new Error('Failed to fetch collection units');
    return await res.json();
  } catch (err) {
    console.error('Fetch Collection Units Error:', err);
    throw err;
  }
}

export async function updateCollectionUnit(id, data) {
  try {
    const res = await fetch(`${API_BASE}/units/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update collection unit');
    return await res.json();
  } catch (err) {
    console.error('Update Collection Unit Error:', err);
    throw err;
  }
}

// Module 5: Waste Tracking APIs
export async function fetchTrackingTimeline(trackingId) {
  try {
    const res = await fetch(`${API_BASE}/tracking/${encodeURIComponent(trackingId)}`);
    if (!res.ok) throw new Error('Failed to fetch tracking timeline');
    return await res.json();
  } catch (err) {
    console.error('Fetch Tracking Timeline Error:', err);
    throw err;
  }
}

export async function createTrackingEvent(data) {
  try {
    const res = await fetch(`${API_BASE}/tracking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to log tracking event');
    return await res.json();
  } catch (err) {
    console.error('Create Tracking Event Error:', err);
    throw err;
  }
}

// Module 6: Alerts APIs
export async function fetchAlerts(status = 'All') {
  try {
    const query = new URLSearchParams();
    if (status && status !== 'All') query.append('status', status);
    const res = await fetch(`${API_BASE}/alerts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return await res.json();
  } catch (err) {
    console.error('Fetch Alerts Error:', err);
    throw err;
  }
}

export async function resolveAlert(alertId) {
  try {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/resolve`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to resolve alert');
    return await res.json();
  } catch (err) {
    console.error('Resolve Alert Error:', err);
    throw err;
  }
}

// Module 7: Analytics API
export async function fetchAnalyticsData(filters = {}) {
  try {
    const query = new URLSearchParams();
    if (filters.category && filters.category !== 'All') query.append('category', filters.category);
    if (filters.days) query.append('days', filters.days);

    const res = await fetch(`${API_BASE}/analytics?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  } catch (err) {
    console.error('Fetch Analytics Error:', err);
    throw err;
  }
}
