const BASE_URL = 'https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/';

const TRANSIENT_STATUSES = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 4;
const REQUEST_TIMEOUT_MS = 15_000;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url) {
    let lastError;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        let res;
        try {
            res = await fetch(url, { headers: { Connection: 'close' }, signal: controller.signal });
        } catch (err) {
            lastError = err.name === 'AbortError' ? new Error(`Request timed out after ${REQUEST_TIMEOUT_MS}ms: ${url}`) : err;
            if (attempt < MAX_ATTEMPTS) {
                await sleep(1000 * 2 ** (attempt - 1));
                continue;
            }
            throw lastError;
        } finally {
            clearTimeout(timeoutId);
        }
        if (res.ok) return res;
        if (!TRANSIENT_STATUSES.has(res.status)) {
            throw new Error(`CFPB API request failed: ${res.status} ${res.statusText}`);
        }
        lastError = new Error(`CFPB API request failed: ${res.status} ${res.statusText}`);
        if (attempt < MAX_ATTEMPTS) await sleep(1000 * 2 ** (attempt - 1));
    }
    throw lastError;
}

function toDateOnly(date) {
    return date.toISOString().slice(0, 10);
}

export async function fetchComplaints({ searchTerm, product, state, startDate, maxResults }) {
    const url = new URL(BASE_URL);
    if (searchTerm) url.searchParams.set('search_term', searchTerm);
    if (product && product !== 'all') url.searchParams.set('product', product);
    if (state) url.searchParams.set('state', state.toUpperCase());
    url.searchParams.set('date_received_min', toDateOnly(startDate));
    url.searchParams.set('date_received_max', toDateOnly(new Date()));
    url.searchParams.set('size', String(maxResults));
    url.searchParams.set('sort', 'created_date_desc');

    const res = await fetchWithRetry(url);
    const body = await res.json();
    const hits = body.hits?.hits ?? [];

    return hits.map(({ _source: c }) => ({
        complaintId: c.complaint_id,
        company: c.company,
        product: c.product,
        subProduct: c.sub_product,
        issue: c.issue,
        subIssue: c.sub_issue,
        state: c.state,
        zipCode: c.zip_code,
        submittedVia: c.submitted_via,
        dateReceived: c.date_received,
        dateSentToCompany: c.date_sent_to_company,
        companyResponse: c.company_response,
        companyPublicResponse: c.company_public_response,
        timely: c.timely,
        hasNarrative: c.has_narrative,
        narrative: c.complaint_what_happened || null,
        tags: c.tags,
    }));
}
