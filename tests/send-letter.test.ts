/**
 * Tests for:
 * 1. groupDynamicAnswers — unit tests (pure logic, no network)
 * 2. /api/admin/send-letter — integration tests via Playwright
 *
 * Run with: npx playwright test tests/send-letter.test.ts
 */

import { test, expect } from '@playwright/test';

// ─── Unit: groupDynamicAnswers ────────────────────────────────────────────────
// We test the logic inline since it's a pure function exported from admin/page.tsx
// Copy the function here to test it in isolation

interface DynamicGroup {
  title: string;
  fields: { label: string; value: string }[];
}

function groupDynamicAnswers(
  answerMap: Map<string, any>,
  staticQuestionIds: Set<string>
): DynamicGroup[] {
  const unmatchedKeys = Array.from(answerMap.keys()).filter(
    (key) => !staticQuestionIds.has(key)
  );
  const groups: Record<string, DynamicGroup> = {};

  unmatchedKeys.forEach((key) => {
    let groupKey = '';
    let groupTitle = '';
    let fieldLabel = '';
    const value = answerMap.get(key);

    if (!value || value.toString().trim() === '') return;

    const childMatch = key.match(/^q3_child_(\d+)_(.+)$/);
    if (childMatch) {
      const index = parseInt(childMatch[1], 10);
      groupKey = `child_${index}`;
      const childName = answerMap.get(`q3_child_${index}_name`);
      groupTitle = childName ? `Child: ${childName}` : `Child ${index + 1}`;
      fieldLabel =
        childMatch[2].charAt(0).toUpperCase() +
        childMatch[2].slice(1).replace(/_/g, ' ');
    } else if (key.match(/^q3_spouse_/)) {
      const spouseMatch = key.match(/^q3_spouse_(\d+)_(.+)$/);
      if (spouseMatch) {
        const index = parseInt(spouseMatch[1], 10);
        groupKey = `spouse_${index}`;
        const spouseName = answerMap.get(`q3_spouse_${index}_name`);
        groupTitle = spouseName
          ? `Spouse: ${spouseName}`
          : `Significant Other ${index + 1}`;
        fieldLabel =
          spouseMatch[2].charAt(0).toUpperCase() +
          spouseMatch[2].slice(1).replace(/_/g, ' ');
      }
    } else if (key.match(/^q5_asset_/)) {
      const assetMatch = key.match(/^q5_asset_(\d+)_(.+)$/);
      if (assetMatch) {
        const index = parseInt(assetMatch[1], 10);
        groupKey = `asset_${index}`;
        const assetName = answerMap.get(`q5_asset_${index}_name`);
        groupTitle = assetName ? `Asset: ${assetName}` : `Asset ${index + 1}`;
        fieldLabel =
          assetMatch[2].charAt(0).toUpperCase() +
          assetMatch[2].slice(1).replace(/_/g, ' ');
      }
    } else if (key.includes('_additional_')) {
      groupKey = 'additional_stories';
      groupTitle = 'Additional Stories';
      fieldLabel = 'Story';
    } else {
      groupKey = 'other';
      groupTitle = 'Additional Information';
      fieldLabel = key.replace(/_/g, ' ');
    }

    if (!groups[groupKey]) {
      groups[groupKey] = { title: groupTitle, fields: [] };
    }
    groups[groupKey].fields.push({ label: fieldLabel, value: String(value) });
  });

  return Object.values(groups);
}

// ─── groupDynamicAnswers unit tests ──────────────────────────────────────────

test.describe('groupDynamicAnswers', () => {
  const staticIds = new Set(['q1_name', 'q2_age', 'q7_5']);

  test('returns empty array when all keys are static', () => {
    const map = new Map([
      ['q1_name', 'John'],
      ['q2_age', '65'],
    ]);
    const result = groupDynamicAnswers(map, staticIds);
    expect(result).toHaveLength(0);
  });

  test('groups child fields correctly with name in title', () => {
    const map = new Map([
      ['q3_child_0_name', 'Marina'],
      ['q3_child_0_wishes', 'you follow your dreams'],
      ['q3_child_0_message', 'I love you so much'],
    ]);
    const result = groupDynamicAnswers(map, staticIds);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Child: Marina');
    expect(result[0].fields).toHaveLength(3);
    const labels = result[0].fields.map((f) => f.label);
    expect(labels).toContain('Name');
    expect(labels).toContain('Wishes');
    expect(labels).toContain('Message');
  });

  test('groups multiple children as separate groups', () => {
    const map = new Map([
      ['q3_child_0_name', 'Marina'],
      ['q3_child_0_message', 'First child message'],
      ['q3_child_1_name', 'Sophia'],
      ['q3_child_1_message', 'Second child message'],
    ]);
    const result = groupDynamicAnswers(map, staticIds);
    expect(result).toHaveLength(2);
    const titles = result.map((g) => g.title);
    expect(titles).toContain('Child: Marina');
    expect(titles).toContain('Child: Sophia');
  });

  test('uses fallback title when child name is missing', () => {
    const map = new Map([['q3_child_2_message', 'Some message']]);
    const result = groupDynamicAnswers(map, staticIds);
    expect(result[0].title).toBe('Child 3');
  });

  test('skips empty values', () => {
    const map = new Map([
      ['q3_child_0_name', 'Marina'],
      ['q3_child_0_message', ''],
    ]);
    const result = groupDynamicAnswers(map, staticIds);
    expect(result[0].fields).toHaveLength(1);
    expect(result[0].fields[0].label).toBe('Name');
  });

  test('groups spouse fields correctly', () => {
    const map = new Map([
      ['q3_spouse_0_name', 'Grace'],
      ['q3_spouse_0_message', 'My love'],
    ]);
    const result = groupDynamicAnswers(map, staticIds);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Spouse: Grace');
  });

  test('groups asset fields correctly', () => {
    const map = new Map([
      ['q5_asset_0_name', 'Lake House'],
      ['q5_asset_0_story', 'We built this together'],
    ]);
    const result = groupDynamicAnswers(map, staticIds);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Asset: Lake House');
  });

  test('handles mixed static and dynamic keys', () => {
    const map = new Map([
      ['q1_name', 'John'],
      ['q7_5', 'John Smith'],
      ['q3_child_0_name', 'Marina'],
      ['q3_child_0_message', 'I love you'],
    ]);
    const result = groupDynamicAnswers(map, staticIds);
    // Only dynamic keys should produce groups
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Child: Marina');
  });
});

// ─── API route integration tests ─────────────────────────────────────────────

test.describe('POST /api/admin/send-letter', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || '';

  test('returns 401 without admin token', async ({ request }) => {
    const formData = new FormData();
    formData.append('submission_id', 'test-id');

    const response = await request.post(`${BASE_URL}/api/admin/send-letter`, {
      multipart: {
        submission_id: 'test-id',
      },
      // No x-admin-token header
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
  });

  test('returns 400 when submission_id is missing', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/admin/send-letter`, {
      headers: { 'x-admin-token': ADMIN_TOKEN },
      multipart: {
        // no submission_id
        pdf: {
          name: 'test.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('%PDF-1.4 test'),
        },
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Missing');
  });

  test('returns 400 when pdf is missing', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/admin/send-letter`, {
      headers: { 'x-admin-token': ADMIN_TOKEN },
      multipart: {
        submission_id: 'some-id',
        // no pdf
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Missing');
  });

  test('returns 404 for non-existent submission', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/admin/send-letter`, {
      headers: { 'x-admin-token': ADMIN_TOKEN },
      multipart: {
        submission_id: '00000000-0000-0000-0000-000000000000',
        pdf: {
          name: 'test.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('%PDF-1.4 test'),
        },
      },
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error).toBe('Submission not found');
  });

  test('returns 400 for non-PDF file', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/admin/send-letter`, {
      headers: { 'x-admin-token': ADMIN_TOKEN },
      multipart: {
        submission_id: 'some-id',
        pdf: {
          name: 'document.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('not a pdf'),
        },
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('PDF');
  });
});

// ─── API route: submissions ───────────────────────────────────────────────────

test.describe('GET /api/admin/submissions', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || '';

  test('returns 401 without admin token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/admin/submissions`);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
  });

  test('returns submissions array with valid token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/admin/submissions`, {
      headers: { 'x-admin-token': ADMIN_TOKEN },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('submissions');
    expect(Array.isArray(body.submissions)).toBe(true);
  });
});