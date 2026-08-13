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
| `searchTerm` | string (optional) | Free-text search across company name, product, and complaint narrative. Leave blank to skip keyword filtering. |
| `product` | string | Limit to a financial product category (`"Mortgage"`, `"Debt collection"`, `"Credit card or prepaid card"`, etc.), or `"all"`. Default `"all"`. |
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
  "hasNarrative": true,
  "narrative": "I am beyond disappointed and extremely frustrated with the level of customer service I received...",
  "tags": null
}
```

`narrative` is `null` when the consumer didn't consent to publish their
complaint text (CFPB only publishes narratives with consumer consent,
and always redacts personal info as `XXXX`).

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

- [Product Recall Alert](https://github.com/timmKal01/product-recall-alert) — the FDA equivalent for drug, food, and medical device recalls
- [SEC 8-K Material Event Tracker](https://github.com/timmKal01/sec-8k-material-event-tracker) — material events from public company filings
