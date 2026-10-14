# Consumer Complaint Tracker — CFPB Financial Complaints

Search new consumer complaints filed with the Consumer Financial
Protection Bureau (CFPB) against banks, lenders, credit bureaus, and
other financial-service companies. Filter by company, product line,
state, and date range.

Built for reputation monitoring, competitive intelligence (watching a
competitor's complaint volume by category), and compliance/risk teams
tracking a company's own complaint trends.

## Input

```json
{
  "searchTerm": "Wells Fargo",
  "product": "Checking or savings account",
  "state": "CA",
  "daysBack": 30,
  "maxResults": 25
}
```

| Field | Type | Description |
|---|---|---|
| `searchTerm` | string (optional) | Keyword search, run by the CFPB's own search (e.g. a brand name or "overdraft fee"). Leave blank to skip keyword filtering. |
| `product` | string | Limit to a financial product category (`"Mortgage"`, `"Debt collection"`, `"Credit card"`, `"Prepaid card"`, etc.), or `"all"`. Default `"all"`. |
| `state` | string (optional) | Two-letter US state code to limit to complaints from consumers there. Leave blank for nationwide. |
| `daysBack` | number | How many days back from today to search, by date received. Default `30`, max `365`. |
| `maxResults` | number | Max complaints to return, most recently received first. Default `25`, max `100`. |

## Output

One record per complaint:

```json
{
  "complaintId": "24536080",
  "company": "WELLS FARGO & COMPANY",
  "product": "Checking or savings account",
  "subProduct": "Checking account",
  "issue": "Problem caused by your funds being low",
  "subIssue": "Overdrafts and overdraft fees",
  "state": "CA",
  "zipCode": "95116",
  "submittedVia": "Web",
  "dateReceived": "2026-07-23T20:38:58.000Z",
  "dateSentToCompany": "2026-07-23T20:48:36.000Z",
  "companyResponse": "Closed with explanation",
  "companyPublicResponse": "Company has responded to the consumer and the CFPB and chooses not to provide a public response",
  "timely": "Yes",
  "narrative": null,
  "tags": null
}
```

**About `narrative`:** the CFPB's API no longer returns consumers' own
complaint text (checked October 2026), so `narrative` is currently always
`null`. Every other field above is filled in as before. The field stays in
the output so your integrations keep working if the CFPB publishes the
text again.

A search with no matches in the requested window returns no items but
is still billed once for the search.

## How it works

Direct calls to the official [CFPB Consumer Complaint Database
API](https://www.consumerfinance.gov/data-research/consumer-complaints/)
(`consumerfinance.gov`). No proxy, no key, no scraping — public U.S.
government data, updated daily.

**Note:** company names in CFPB data are the company's registered legal
name, not always its common brand name (e.g. `"WELLS FARGO & COMPANY"`).
Use `searchTerm` for free-text/brand-name matching rather than assuming
an exact legal name.

## Pricing note

Billed per **search**, not per complaint returned — one charge whether
the search returns 0 complaints or 100.

## Related products

- [FDA Recall Tracker](https://apify.com/m_ctim/product-recall-alert): the FDA equivalent for drug, food, and medical device recalls
- [SEC 8-K Tracker](https://apify.com/m_ctim/sec-8k-material-event-tracker): material events from public company filings
