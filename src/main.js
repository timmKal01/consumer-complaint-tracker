import { Actor, log } from 'apify';
import { fetchComplaints } from './cfpb.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const { searchTerm, product = 'all', state, daysBack = 30, maxResults = 25 } = input;

/** Must match the event name configured in this Actor's pay-per-event pricing on Apify. */
const COMPLAINT_SEARCH_EVENT = 'complaint-search';

const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

const complaints = await fetchComplaints({
    searchTerm,
    product,
    state,
    startDate,
    maxResults: Math.min(maxResults, 100),
});

for (const complaint of complaints) {
    await Actor.pushData(complaint);
}

await Actor.charge({ eventName: COMPLAINT_SEARCH_EVENT });

log.info(`Pushed ${complaints.length} complaint(s)`);

await Actor.exit();
