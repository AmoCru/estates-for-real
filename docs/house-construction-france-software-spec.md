# Specification: Multi-Purpose Software for Managing House Construction Projects in France

Status: Draft product specification
Target jurisdiction: France
Primary use case: two families building two houses on one land parcel
Document purpose: define product scope, legal/compliance workflows, data model, user roles, core features, acceptance criteria, and non-functional requirements for a software product supporting individuals through a residential construction project.

## 1. Product Vision

The product helps private individuals plan, purchase, authorize, finance, procure, build, receive, and maintain one or more houses in France. It must support ordinary single-family construction and complex shared projects where two families build two houses on a single land parcel, with shared costs, shared infrastructure, legal structuring decisions, and long-term co-ownership or parcel-division consequences.

The product is not a legal, tax, architectural, engineering, notarial, insurance, or banking adviser. It is a structured project-control system that helps users gather information, track obligations, understand options, detect missing documents, compare scenarios, coordinate professionals, and preserve an auditable record of decisions.

## 2. Product Goals

1. Provide a single operational workspace for all phases of a house construction project in France.
2. Make legal, administrative, insurance, financial, procurement, and construction obligations visible and trackable.
3. Support projects with one or several dwellings on one land parcel.
4. Support two-family governance, shared budgets, private budgets, and dispute-prevention mechanisms.
5. Reduce project risk by detecting missing documents, expired deadlines, unverified assumptions, under-budgeted items, unallocated costs, and dependency conflicts.
6. Preserve evidence: decisions, approvals, contract versions, invoices, insurance certificates, photos, inspections, notices, and communications.
7. Provide exportable project dossiers usable by notaires, banks, architects, builders, insurers, municipalities, contractors, and tax authorities.

## 3. Non-Goals

1. The product must not issue legal opinions or guarantee that a project is lawful.
2. The product must not replace mandatory professional services such as notaire, architect, surveyor, geotechnical engineer, insurer, builder, or technical diagnostician.
3. The product must not submit administrative forms automatically unless an official API or legally valid integration exists and the user explicitly approves submission.
4. The product must not hide ambiguity. When a rule depends on local PLU, zoning, ABF perimeter, risk plans, or municipal interpretation, the product must flag that professional or municipal confirmation is required.
5. The product must not optimize for one legal structure. It must compare scenarios neutrally.

## 4. Personas

### 4.1 Primary Users

1. Individual owner-builder: buys land and manages a house project directly.
2. Couple or household: shares budget, tasks, documents, and decisions.
3. Two-family project group: two households building two homes on one parcel.
4. Family representative: coordinates communications with professionals and public authorities.

### 4.2 Professional Users and External Participants

1. Notaire: validates ownership, land purchase, division, easements, co-ownership, SCI, indivision, sale clauses, and deeds.
2. Architect: designs project, signs permit where required, coordinates technical design.
3. Maitre d'oeuvre: coordinates trades and schedule.
4. CCMI builder: manages construction under a Contrat de Construction de Maison Individuelle.
5. Surveyor/geometre-expert: performs boundary marking, parcel division, topographic plans, easement plans.
6. Geotechnical engineer: performs G1/G2 soil studies and recommendations.
7. Bank or broker: tracks loans, drawdowns, conditions precedent, guarantees.
8. Insurer: dommage-ouvrage, decennale, RC, habitation, chantier policies.
9. Contractors and suppliers: quotes, contracts, deliveries, invoices, warranties.
10. Municipality and public authorities: planning permissions, certificates, declarations, taxes.

## 5. Project Types to Support

### 5.1 Single-House Project

One household builds one house on one parcel.

### 5.2 Two Houses on One Undivided Parcel

Two families acquire or own one parcel together and build two houses without immediate parcel division. The product must flag financing, resale, inheritance, mortgage, usage-right, governance, and conflict risks. It must support an indivision agreement, usage agreement, expense allocation, and long-term exit scenarios.

### 5.3 Parcel Division Before Construction

One initial parcel is divided into two building lots before or during the project. The product must support boundary plans, division authorization, easements, shared access, utility routes, legal deeds, and separate house projects.

### 5.4 Lotissement / Development Scenario

The project creates one or more lots to be built on, potentially with common roads, networks, or facilities. The product must distinguish cases that may require declaration prealable, permis d'amenager, or other planning procedures depending on local rules and project characteristics.

### 5.5 Permis de Construire Valant Division Scenario

A single building permit covers several constructions and division before completion. The product must support shared permit tracking, division plans, allocation of rights and obligations, professional validation, and eventual transfer or sale constraints.

### 5.6 Horizontal Co-Ownership / Shared Property Scenario

Two families hold private enjoyment areas and common parts without ordinary parcel division. The product must support copropriete documents, tantiemes or allocation keys, shared maintenance, voting, insurance, and resale constraints.

### 5.7 SCI or Other Holding Entity Scenario

Families hold the land and houses through a Societe Civile Immobiliere or other legal entity. The product must support shares, contributions, current accounts, governance, tax assumptions, transfers, loan guarantees, and professional validation.

### 5.8 Self-Build / Partial Self-Build Scenario

One or both families perform some works themselves. The product must track insurance limitations, decennale gaps, resale risks, safety obligations, material purchases, inspections, and proof of workmanship.

## 6. France-Specific Legal and Administrative Domain Model

The product must represent legal requirements as configurable rule packs with source metadata:

1. Rule title.
2. Jurisdiction level: national, regional, departmental, intercommunal, municipal, parcel-specific.
3. Source type: official source, professional note, local document, user-uploaded document.
4. Source URL or file.
5. Effective date.
6. Review date.
7. Confidence level.
8. Professional validation status.
9. Affected project objects: parcel, lot, house, shared infrastructure, contract, authorization, tax, insurance.
10. Required evidence.

The legal module must explicitly separate:

1. Facts entered by users.
2. Documents uploaded by users.
3. Extracted values from documents.
4. Software-generated checklists.
5. Professional confirmations.
6. Final decisions made by users.

## 7. Core Legal and Compliance Areas

### 7.1 Land Ownership and Acquisition

The product must track:

1. Seller identity and buyer identities.
2. Ownership structure before purchase.
3. Planned ownership structure after purchase.
4. Compromis/promesse de vente dates.
5. Conditions precedent:
   - loan approval;
   - planning permission obtained;
   - planning permission purged of third-party recourse;
   - satisfactory soil study;
   - satisfactory servicing/viabilisation estimate;
   - absence of blocking easements;
   - ability to divide parcel if relevant;
   - notarial validation of two-family structure;
   - sale of existing property where relevant.
6. Deposit/sequestre amount.
7. Deadlines and automatic reminders.
8. Notarial fees and taxes estimate.
9. Land registry/cadastre references.
10. Title deed and prior deeds.
11. Servitudes: passage, view, drainage, networks, non aedificandi, private road, shared equipment.
12. Boundary status: uncertain, cadastral only, bornage amiable, bornage judiciaire, geometre plan validated.
13. Easement impact on each future house and shared asset.

Acceptance criteria:

1. A user can model a land purchase with several buyers and allocation percentages.
2. The system warns when the project relies only on cadastral lines without a boundary survey.
3. The system can generate a notaire question list for shared ownership, division, easements, exit clauses, inheritance, and resale.
4. The system can block project status from moving to "land secured" until required purchase conditions are marked satisfied, waived, or expired.

### 7.2 Planning and Urbanism

The product must track:

1. Commune and intercommunal authority.
2. Applicable document: PLU, PLUi, carte communale, RNU, lotissement rules, private covenants.
3. Zoning and sub-zone.
4. Constructibility status.
5. Surface of land.
6. Access to public road.
7. Required parking spaces.
8. Maximum height.
9. Setbacks from roads and boundaries.
10. Emprise au sol limits.
11. Surface de plancher constraints where applicable.
12. Aspect rules: roof pitch, materials, colors, facade, fences, landscaping.
13. Rainwater management rules.
14. Tree preservation or planting requirements.
15. ABF or heritage perimeter.
16. Protected sites, classified/listed sites, monuments historiques perimeter.
17. Natural, technological, mining, flood, seismic, clay shrink-swell, radon, fire, coastal, noise, and pollution risk zones.
18. Easements of public utility.
19. Utilities availability: water, electricity, telecom, sewer, gas where relevant.
20. Road access constraints for construction vehicles and fire service.

The product must support these planning procedures:

1. Certificat d'urbanisme d'information.
2. Certificat d'urbanisme operationnel.
3. Declaration prealable.
4. Permis de construire.
5. Permis d'amenager.
6. Permis de demolir where relevant.
7. Permis de construire modificatif.
8. Transfer of permit.
9. Extension of permit validity.
10. Declaration d'ouverture de chantier.
11. Declaration attestant l'achevement et la conformite des travaux.
12. Contestation or request for additional documents.

Acceptance criteria:

1. A user can create several authorization scenarios and compare deadlines, dependencies, risks, and affected project objects.
2. For a two-house project, the system asks whether the land will remain undivided, be divided before construction, be divided after permit, or be held through another structure.
3. The system generates a permit dossier checklist adapted to the selected scenario.
4. The system tracks third-party recourse and administrative withdrawal periods as date ranges requiring verification by a professional or authority.
5. The system requires proof of field posting for planning permissions: start date, photos, bailiff/commissaire de justice record if used, continuity notes, and end date.

### 7.3 Two-Family Legal Structures

The product must provide a comparison module for at least these structures:

1. Indivision over the entire parcel.
2. Parcel division into two separately owned lots.
3. Lotissement with common equipment.
4. Permis de construire valant division.
5. Copropriete horizontale.
6. Division en volumes where applicable and professionally validated.
7. SCI ownership.
8. Mixed structure: separate private lots plus shared parcel or ASL for common equipment.

For each structure, the product must track:

1. Ownership rights.
2. Financing implications.
3. Mortgage/collateral implications.
4. Resale process.
5. Inheritance and death scenario.
6. Divorce/separation scenario.
7. Default by one family.
8. Insolvency or blocked loan of one family.
9. Construction delay caused by one family.
10. Shared maintenance obligations.
11. Tax and fee assumptions.
12. Planning authorization implications.
13. Insurance implications.
14. Governance rules.
15. Required professional documents.
16. Major risks and mitigations.

The module must never recommend a structure as legally optimal without professional validation. It may rank scenarios by user-defined criteria such as independence, resale ease, shared cost efficiency, simplicity, financing compatibility, and governance burden.

Acceptance criteria:

1. A user can create at least three alternative legal-structure scenarios for the same project.
2. The system can produce a decision memo showing assumptions, benefits, risks, open questions, required professional validations, and unresolved blockers.
3. The system flags indivision as requiring explicit exit, sale, occupation, expense, and dispute rules.
4. The system flags any shared equipment as requiring legal ownership, maintenance allocation, access rights, insurance, and replacement funding.

### 7.4 Contracts and Construction Delivery Models

The product must support:

1. CCMI avec fourniture de plan.
2. CCMI sans fourniture de plan.
3. Architect-led project.
4. Maitre d'oeuvre contract.
5. Separate trade contracts.
6. Design-build or general contractor contract where applicable.
7. Self-build or hybrid construction.
8. Supplier-only purchase contracts.

For each contract, the product must track:

1. Parties.
2. Scope.
3. Plans and technical description.
4. Price type: fixed, revisable, provisional, unit price, time and materials.
5. Payment schedule.
6. Indexation clauses.
7. Deadlines.
8. Penalties.
9. Suspension conditions.
10. Change-order process.
11. Reservation/defect process.
12. Guarantees.
13. Insurance certificates.
14. Decennale coverage scope.
15. Exclusions.
16. User obligations.
17. Termination clauses.
18. Dispute resolution.
19. Acceptance/reception procedure.

Specific CCMI support:

1. Mandatory content checklist.
2. Cooling-off period tracking.
3. Conditions precedent.
4. Delivery guarantee tracking.
5. Refund guarantee where relevant.
6. Legal payment milestone template with configurable verification.
7. Reserved works list and costing.
8. Notice of opening site.
9. Delivery date calculation.
10. Late penalties tracking.
11. Five percent holdback handling where reservations exist, subject to legal validation.

Acceptance criteria:

1. The system rejects a contractor as "ready to sign" until decennale certificate, company identity, scope match, and contract version are recorded.
2. The system compares quote scope line by line and flags missing lots, unclear exclusions, provisional sums, and non-comparable assumptions.
3. The system can track separate contracts for House A, House B, and shared infrastructure.

### 7.5 Insurance and Guarantees

The product must track:

1. Dommage-ouvrage insurance.
2. Decennale insurance of each contractor and designer.
3. Responsabilite civile professionnelle.
4. Garantie de livraison in CCMI.
5. Garantie de parfait achevement.
6. Garantie biennale/de bon fonctionnement.
7. Garantie decennale.
8. Tous risques chantier where subscribed.
9. Home insurance during and after construction.
10. Owner-builder liability and resale declarations for self-built works.
11. Insurance for shared equipment: private road, gate, pump, retaining wall, shared drainage, lighting, common networks.

Acceptance criteria:

1. The system stores each insurance certificate with insurer, insured company, SIRET, activities covered, geographic scope, policy period, and exclusions.
2. The system warns when the certificate period does not cover the planned work start date.
3. The system warns when declared activities do not match contracted works.
4. The system separates insurance coverage for House A, House B, and shared works.

### 7.6 Regulatory Technical Requirements

The product must support tracking for:

1. RE2020 obligations and attestations.
2. Thermal study and energy performance assumptions.
3. Carbon impact data where available.
4. Air tightness test.
5. Ventilation compliance.
6. Acoustic rules where relevant.
7. Accessibility rules where applicable.
8. Fire safety access where relevant.
9. Seismic rules by zone.
10. Flood or natural risk prescriptions.
11. Clay shrink-swell soil rules and geotechnical studies.
12. Radon precautions where relevant.
13. Electrical compliance and Consuel certificate.
14. Gas compliance certificate where relevant.
15. Sanitation compliance: collective sewer or SPANC for non-collective systems.
16. Drinking water connection.
17. Telecom/fiber readiness.
18. Waste management and site cleanliness.
19. Construction products conformity: CE marking, NF standards where relevant, DTU compliance, manufacturer installation instructions.

Acceptance criteria:

1. The system links technical obligations to permits, contracts, design documents, construction tasks, inspection checklists, and final handover documents.
2. The system flags when completion declaration cannot be marked ready because required technical attestations are missing.
3. The system can distinguish shared compliance items from house-specific compliance items.

## 8. Financial Management

### 8.1 Budget Structure

The product must provide budgets at these levels:

1. Global project budget.
2. Land acquisition budget.
3. House A private budget.
4. House B private budget.
5. Shared infrastructure budget.
6. Administrative and legal budget.
7. Financing budget.
8. Tax budget.
9. Contingency budget.
10. Post-handover budget.

Budget categories must include:

1. Land price.
2. Agency fees.
3. Notarial fees and duties.
4. Surveyor and boundary marking.
5. Soil studies.
6. Architect/design fees.
7. Planning application costs.
8. Taxes and participations.
9. Utility connection and servicing.
10. Demolition, clearing, earthworks.
11. Foundations and structure.
12. Roofing, waterproofing, facade.
13. Windows and exterior doors.
14. Insulation, airtightness, partitions.
15. Plumbing, heating, cooling, ventilation.
16. Electrical, telecom, smart home.
17. Interior finishes.
18. Kitchen, bathrooms, appliances.
19. Outdoor works, driveway, fencing, gate, landscaping.
20. Shared road/access.
21. Shared networks and meters.
22. Rainwater and drainage.
23. Waste and temporary site facilities.
24. Insurance.
25. Bank fees, guarantees, broker fees, interest during construction.
26. Moving, temporary accommodation, storage.
27. Legal disputes or expert reports.
28. Maintenance reserve for shared assets.

### 8.2 Cost Allocation for Two Families

Every cost line must have an allocation method:

1. 100 percent Family A.
2. 100 percent Family B.
3. 50/50.
4. By land area.
5. By house floor area.
6. By taxable area.
7. By usage percentage.
8. By meter reading.
9. By linear meter frontage.
10. By quote-specific split.
11. By legal share/tantieme.
12. Custom formula.

The product must provide a settlement ledger:

1. Amount paid by each family.
2. Amount owed by each family.
3. Advances paid for another family.
4. Shared account balance.
5. Reimbursement requests.
6. Due dates.
7. Evidence: invoice, payment proof, decision approval.
8. Dispute status.

Acceptance criteria:

1. No invoice can be marked fully allocated unless its allocation totals 100 percent.
2. Users can simulate allocation methods before approving them.
3. The system can export a family-by-family statement for banks, notaires, and internal reconciliation.
4. The system can preserve historical allocation rules even if future rules change.

### 8.3 Financing and Loans

The product must track:

1. Loan applications per family.
2. Shared or separate loans.
3. Mortgage/security type.
4. Bank conditions precedent.
5. Loan offer date.
6. Cooling-off and acceptance dates.
7. Drawdown schedule.
8. Bridge loans.
9. Zero-interest or assisted loans if eligible.
10. Personal contribution.
11. Gift or family loan.
12. Interest during construction.
13. Insurance borrower coverage.
14. Consequence if one family loan fails.
15. Bank requirements for parcel division, ownership, permits, guarantees, and insurance.

Acceptance criteria:

1. The system can model independent financing paths for both families.
2. The system flags dependencies where one family's financing failure blocks shared land acquisition or shared infrastructure.
3. The system can compare cash forecast against payment milestones and planned drawdowns.

### 8.4 Taxes and Public Charges

The product must track estimates, source assumptions, payment deadlines, and actual assessments for:

1. Taxe d'amenagement.
2. Redevance d'archeologie preventive where applicable.
3. Participation for collective sanitation where applicable.
4. Connection fees and network contributions.
5. Property tax after completion.
6. Potential temporary property tax exemptions where applicable.
7. VAT treatment by invoice type.
8. Capital gains assumptions for future resale where relevant.
9. Local taxes or charges imposed by public or semi-public operators.

Acceptance criteria:

1. Tax estimates must show formula inputs, source date, uncertainty level, and responsible verifier.
2. The system must support tax allocation between House A, House B, and shared parts.
3. The system must store official tax notices separately from estimates.

## 9. Procurement, Materials, and Ordering

### 9.1 Material Catalog

The product must maintain a project material catalog with:

1. Material name.
2. Lot/trade.
3. Technical specification.
4. Quantity.
5. Unit.
6. Waste factor.
7. Supplier.
8. Manufacturer.
9. Reference/SKU.
10. Certification: CE, NF, ACERMI, CSTB avis technique, FDES, PEFC/FSC, or other relevant certificates.
11. DTU or installation standard reference where relevant.
12. RE2020/carbon data where relevant.
13. Warranty.
14. Lead time.
15. Storage constraints.
16. Delivery constraints.
17. Compatibility constraints.
18. Substitution rules.
19. Approval status.
20. Assigned house or shared asset.

### 9.2 Ordering Workflow

Orders must support:

1. Purchase request.
2. Quote comparison.
3. Technical approval.
4. Budget approval.
5. Family allocation approval.
6. Order placement.
7. Deposit payment.
8. Delivery scheduling.
9. Receipt control.
10. Non-conformity report.
11. Return or replacement.
12. Final invoice reconciliation.
13. Warranty registration.

Acceptance criteria:

1. The system prevents accidental shared-cost ordering unless both families or authorized representatives approve according to governance rules.
2. The system flags material substitutions that affect planning authorization, visual appearance, RE2020 assumptions, insurance, warranty, or technical compatibility.
3. The system can reserve materials for House A, House B, shared infrastructure, or common stock.

### 9.3 Inventory and Site Logistics

The product must track:

1. Delivery address and access constraints.
2. Crane/truck access.
3. Storage zones.
4. Weather-sensitive materials.
5. Theft-sensitive materials.
6. Shared vs private stock.
7. Consumption by task.
8. Remaining stock.
9. Waste and disposal.
10. Reusable surplus.

Acceptance criteria:

1. A delivery cannot be marked accepted without quantity, visible damage status, photo evidence option, and receiver identity.
2. The system can generate a delivery calendar and detect conflicts with road access, crane booking, or site occupancy.

## 10. Scheduling and Construction Management

### 10.1 Project Phases

The product must support at least these phases:

1. Idea and feasibility.
2. Land search.
3. Land due diligence.
4. Legal structure decision.
5. Land purchase.
6. Design.
7. Planning authorization.
8. Financing.
9. Contracting.
10. Site preparation.
11. Earthworks and foundations.
12. Structure.
13. Roof and watertight stage.
14. Windows/doors and airtight stage.
15. Technical systems.
16. Insulation and partitions.
17. Finishes.
18. External works and shared infrastructure.
19. Testing and commissioning.
20. Reception/handover.
21. Completion declarations.
22. Move-in.
23. Warranty follow-up.
24. Long-term shared maintenance.

### 10.2 Task Management

Each task must include:

1. Scope.
2. Responsible party.
3. Affected house/shared asset.
4. Dependencies.
5. Required documents.
6. Required approvals.
7. Planned start/end.
8. Actual start/end.
9. Weather sensitivity.
10. Budget line.
11. Contract line.
12. Materials.
13. Risks.
14. Quality checklist.
15. Photos.
16. Status.

Acceptance criteria:

1. The system can show separate schedules for House A, House B, and shared infrastructure, plus a consolidated critical path.
2. The system flags when shared infrastructure delay affects one or both houses.
3. The system can produce contractor-specific upcoming task lists.

## 11. Quality, Inspections, and Reception

### 11.1 Quality Checklists

The product must provide configurable checklists for:

1. Land access and site setup.
2. Boundary markers protection.
3. Earthworks levels and drainage.
4. Foundation depth, reinforcement, concrete delivery records.
5. Waterproofing and capillary break.
6. Structural masonry or framing.
7. Roof structure and covering.
8. Airtight/watertight stages.
9. Windows and exterior doors.
10. Insulation continuity.
11. Thermal bridges.
12. Ventilation ducts and airflow.
13. Plumbing pressure tests.
14. Electrical pre-closure inspection.
15. Heating system commissioning.
16. Screeds and floor levels.
17. Tiling and wet room waterproofing.
18. Facade and render.
19. Rainwater management.
20. Sanitation.
21. External works.
22. Shared driveway/access.
23. Shared networks.
24. Handover/reception.

### 11.2 Reception and Reservations

The product must track:

1. Reception date.
2. Parties present.
3. Assistance by expert/professional.
4. Keys delivery.
5. Meter readings.
6. Reservations/defects.
7. Photos and location.
8. Responsible contractor.
9. Deadline for correction.
10. Holdback amount where applicable.
11. Formal notices.
12. Completion date of corrections.
13. Warranty period start dates.

Acceptance criteria:

1. Reception can be performed separately for House A, House B, and shared works.
2. The system can export a reception report with reservations and photos.
3. The system automatically creates warranty follow-up tasks after reception.

## 12. Document Management

### 12.1 Required Document Repository

The product must support document categories:

1. Identity and family project governance.
2. Land search and due diligence.
3. Purchase documents.
4. Notarial documents.
5. Surveyor plans.
6. Planning documents.
7. Design and plans.
8. Technical studies.
9. Contracts.
10. Quotes.
11. Insurance.
12. Financing.
13. Taxes.
14. Orders and deliveries.
15. Invoices and payments.
16. Site photos.
17. Quality inspections.
18. Meeting minutes.
19. Correspondence.
20. Handover and warranties.
21. Shared asset maintenance.

Each document must include:

1. Owner.
2. Visibility: private Family A, private Family B, shared, professional-only, admin-only.
3. Version.
4. Date received.
5. Expiry date where applicable.
6. Related parcel/house/shared asset.
7. Extracted metadata.
8. Validation status.
9. Signature status.
10. Legal importance.
11. Retention period.

Acceptance criteria:

1. The system can generate a missing-document list by phase.
2. The system can produce a bank dossier, notaire dossier, permit dossier, insurer dossier, and handover dossier.
3. The system preserves old versions and shows which decisions relied on which version.

## 13. Governance for Two-Family Projects

### 13.1 Roles

The product must support project roles:

1. Family A owner.
2. Family B owner.
3. Family A representative.
4. Family B representative.
5. Shared project administrator.
6. External professional.
7. Read-only viewer.
8. Finance-only viewer.
9. Contractor-limited viewer.

### 13.2 Decision Rules

The product must support decision policies:

1. Any representative can approve.
2. One representative per family must approve.
3. Unanimous approval.
4. Majority by shares.
5. Majority by families.
6. Budget threshold approval.
7. Urgent safety exception.
8. Professional validation required before approval.

Decision records must include:

1. Decision title.
2. Options considered.
3. Financial impact.
4. Schedule impact.
5. Legal impact.
6. Affected house/shared asset.
7. Voters/approvers.
8. Decision rule used.
9. Attachments.
10. Final decision.
11. Date.
12. Reversal/change process.

Acceptance criteria:

1. A shared cost above a configurable threshold cannot be committed without the required family approvals.
2. The system can distinguish decisions affecting only House A, only House B, shared assets, or legal structure.
3. The system can export a chronological decision register.

### 13.3 Conflict and Exit Planning

The product must provide structured workflows for:

1. One family wants to abandon before land purchase.
2. One family wants to abandon after land purchase but before construction.
3. One family cannot obtain financing.
4. One family delays shared decisions.
5. One family exceeds private budget and cannot pay shared costs.
6. One family wants design changes affecting shared permit or infrastructure.
7. One family wants to sell before completion.
8. One family wants to sell after completion.
9. Death, divorce, separation, incapacity, or insolvency.
10. Dispute over shared maintenance.
11. Dispute over noise, access, parking, drainage, fences, pets, works, or rentals.
12. Damage caused by one house to shared infrastructure or the other house.

For each scenario, the product must provide:

1. Preventive clauses checklist.
2. Documents to consult.
3. Professionals to involve.
4. Financial settlement model.
5. Decision workflow.
6. Risk level.
7. Evidence checklist.

## 14. Shared Infrastructure Management

The product must model shared assets independently from houses:

1. Access road or driveway.
2. Gate and intercom.
3. Mailbox area.
4. Parking or turning area.
5. Retaining wall.
6. Boundary wall/fence.
7. Rainwater basin, soakaway, ditch, drainage network.
8. Wastewater system or connection segment.
9. Drinking water pipe.
10. Electrical service route.
11. Telecom/fiber duct.
12. Gas pipe where relevant.
13. External lighting.
14. Landscaping and trees.
15. Shared technical room.
16. Pump, lift station, treatment equipment.
17. Fire access or turning area.

For each shared asset, the product must track:

1. Owner.
2. Legal basis: easement, indivision, ASL, copropriete, SCI, private agreement.
3. Construction budget.
4. Maintenance budget.
5. Allocation rule.
6. Access rights.
7. Replacement cycle.
8. Insurance.
9. Responsible maintainer.
10. Emergency procedure.
11. Technical plans.
12. Warranty.

Acceptance criteria:

1. The system can generate a shared asset register for the notaire and future owners.
2. The system can calculate annual maintenance contributions per family.
3. The system warns if a shared asset has no legal ownership or maintenance rule.

## 15. Communications and Meetings

The product must provide:

1. Meeting agenda builder.
2. Meeting minutes.
3. Action items.
4. Decision capture.
5. Email import or forwarding address.
6. Message threading by topic.
7. Professional contact directory.
8. Formal notice templates with caution that legal review may be required.
9. Communication log with attachments.
10. Notification rules by role and object.

Acceptance criteria:

1. A decision made in meeting minutes can be converted into an approval workflow.
2. Communications can be linked to contracts, invoices, defects, tasks, and authorizations.
3. The system can export a chronological evidence bundle for disputes.

## 16. Risk Management

The product must maintain a risk register with:

1. Risk title.
2. Category: legal, planning, finance, technical, schedule, procurement, family governance, contractor, weather, safety, resale.
3. Probability.
4. Impact.
5. Owner.
6. Mitigation.
7. Trigger.
8. Related documents.
9. Status.
10. Residual risk.

Mandatory risk templates for two-family projects:

1. Planning authorization invalid for intended division.
2. One family's bank refuses financing due to ownership structure.
3. Shared access not legally secured.
4. Shared networks lack maintenance allocation.
5. Project blocked by disagreement on shared cost.
6. Permit modification required because one house changes design.
7. Contractor insurance does not cover actual work.
8. Soil condition increases foundation cost for one or both houses.
9. Land cannot be divided as expected.
10. Resale of one house is difficult because legal structure is unclear.

Acceptance criteria:

1. The system suggests risk templates when the user selects "two families / one land".
2. High risks must appear on the project dashboard until accepted, mitigated, or closed.
3. Risk acceptance requires a decision record.

## 17. User Experience Requirements

### 17.1 Main Navigation

The application must provide these primary sections:

1. Dashboard.
2. Land.
3. Legal structure.
4. Urbanism and permits.
5. Design and technical studies.
6. Budget and financing.
7. Contracts and professionals.
8. Procurement and materials.
9. Schedule.
10. Site and quality.
11. Documents.
12. Decisions and meetings.
13. Shared assets.
14. Risks.
15. Reports and exports.
16. Settings.

### 17.2 Dashboard

The dashboard must show:

1. Current phase.
2. Critical path.
3. Upcoming deadlines.
4. Missing approvals.
5. Budget committed vs actual vs forecast.
6. Cash forecast.
7. Open risks.
8. Open defects.
9. Missing documents.
10. Family A status.
11. Family B status.
12. Shared infrastructure status.

### 17.3 Scenario Mode

The product must include a scenario mode where users can compare:

1. Legal structures.
2. Parcel division strategies.
3. Permit strategies.
4. Financing strategies.
5. Construction delivery models.
6. Cost allocation methods.
7. Shared infrastructure designs.

Acceptance criteria:

1. Scenario assumptions are isolated from the active project until adopted.
2. Adopting a scenario creates a decision record and preserves rejected alternatives.

## 18. Data Model

Minimum entities:

1. Organization.
2. User.
3. Household/family.
4. Project.
5. Parcel.
6. Lot.
7. House.
8. SharedAsset.
9. LegalStructureScenario.
10. OwnershipShare.
11. ProfessionalContact.
12. Authorization.
13. PermitEvent.
14. PlanningRule.
15. Document.
16. DocumentVersion.
17. Contract.
18. Quote.
19. QuoteLine.
20. Budget.
21. BudgetLine.
22. CostAllocationRule.
23. Invoice.
24. Payment.
25. Loan.
26. Drawdown.
27. TaxEstimate.
28. TaxNotice.
29. Material.
30. PurchaseOrder.
31. Delivery.
32. InventoryItem.
33. Task.
34. Milestone.
35. Inspection.
36. Defect.
37. Reception.
38. Warranty.
39. Decision.
40. Approval.
41. Meeting.
42. Risk.
43. Notification.
44. AuditLogEntry.

Core relationships:

1. A project has one or more parcels.
2. A parcel may have zero or more lots.
3. A project has one or more houses.
4. A house belongs to one family, several families, or a legal entity.
5. A shared asset belongs to a project and may serve several houses/lots.
6. Every cost line must be assignable to a house, shared asset, parcel, authorization, contract, or general project overhead.
7. Every decision may affect multiple entities.
8. Every document version may be linked to the decision, contract, task, authorization, or invoice that relied on it.

## 19. Permissions and Privacy

The product must support granular permissions:

1. Private family financial data can be hidden from the other family unless explicitly shared.
2. Shared costs are visible to both families.
3. Professionals see only documents and tasks relevant to their scope.
4. Contractors cannot see competing quotes unless authorized.
5. Banks can receive export packages without access to live workspace.
6. Audit logs cannot be edited by ordinary users.

GDPR requirements:

1. Lawful basis tracking.
2. Data minimization.
3. Export of personal data.
4. Deletion/anonymization workflow subject to legal retention constraints.
5. Consent tracking for external sharing.
6. Secure storage of identity, financial, and contract documents.

## 20. Integrations

Potential integrations must be implemented behind explicit user consent:

1. Cadastre data lookup.
2. Georisques data lookup.
3. Geoportail de l'urbanisme document lookup.
4. Address/base adresse nationale lookup.
5. Mapping and parcel visualization.
6. Calendar sync.
7. Email import.
8. Cloud storage import/export.
9. E-signature providers.
10. Bank document export.
11. Accounting export.
12. OCR and document extraction.
13. Weather history for delay evidence.
14. Supplier catalogs.

Integration requirements:

1. Imported official data must display source and retrieval date.
2. The system must warn users that imported public data may not be sufficient for legal decisions.
3. Users must be able to override extracted data while preserving the original extracted value.

## 21. Reports and Exports

The product must generate:

1. Feasibility report.
2. Land due diligence report.
3. Legal structure comparison report.
4. Notaire question pack.
5. Bank financing dossier.
6. Permit dossier checklist.
7. Professional consultation package.
8. Quote comparison report.
9. Budget report.
10. Cash forecast.
11. Family settlement statement.
12. Shared asset register.
13. Risk register.
14. Construction progress report.
15. Reception report.
16. Warranty and maintenance manual.
17. Complete project archive.

All exports must support PDF and structured data export where practical.

## 22. Notifications and Deadline Engine

The product must calculate and track:

1. Land purchase condition deadlines.
2. Loan offer deadlines.
3. Planning application expected response dates.
4. Request-for-additional-documents deadlines.
5. Permit posting period.
6. Third-party recourse period.
7. Permit validity and extension deadlines.
8. DOC and DAACT milestones.
9. Insurance policy expiration.
10. Contractor certificate expiration.
11. Quote validity expiration.
12. Payment due dates.
13. Loan drawdown deadlines.
14. Delivery dates.
15. Warranty deadlines.
16. Shared maintenance schedules.

Acceptance criteria:

1. A deadline must show its source, calculation rule, uncertainty status, and responsible owner.
2. Users can mark a deadline as legally verified by a professional.
3. The system must not silently delete or recalculate legal deadlines without preserving history.

## 23. Auditability

The product must record audit log entries for:

1. Document upload, deletion, replacement, and validation.
2. Budget changes.
3. Cost allocation changes.
4. Approval and rejection.
5. Contract status changes.
6. Payment status changes.
7. Legal structure scenario adoption.
8. Risk acceptance.
9. Permission changes.
10. Export generation.

Audit log entries must include actor, timestamp, previous value, new value, reason where provided, and affected entity.

## 24. Security Requirements

1. Multi-factor authentication support.
2. Role-based access control.
3. Encryption in transit and at rest.
4. Object-level authorization checks.
5. Secure document storage.
6. Malware scanning for uploads.
7. Tamper-evident audit logs.
8. Backup and restore.
9. Data residency option in the EU.
10. Session management and device revocation.
11. Export access expiration.
12. Security event logging.

## 25. Reliability and Availability

1. The system must preserve data during intermittent connectivity.
2. Critical document uploads must be resumable.
3. Users must be able to export a full local archive.
4. The system must support read-only degraded mode if some integrations are unavailable.
5. Deadline notifications must be delivered through at least two channels when configured.

## 26. Mobile Requirements

The mobile experience must support site use:

1. Photo capture with automatic timestamp and location option.
2. Defect capture.
3. Delivery acceptance.
4. Task checklist completion.
5. Offline access to plans and checklists.
6. Voice notes.
7. QR code or label scanning for materials.
8. Quick call/email to professionals.
9. Weather capture.
10. Signature capture for site reports where legally appropriate.

## 27. MVP Scope

The MVP must include:

1. Project setup wizard with two-family/single-land mode.
2. Parcel and house model.
3. Legal structure scenario comparison.
4. Document repository.
5. Budget with cost allocation.
6. Permit and deadline tracker.
7. Contract and insurance tracker.
8. Task schedule.
9. Shared asset register.
10. Decision and approval workflow.
11. Risk register.
12. Core reports: notaire pack, bank pack, budget report, shared cost statement.

MVP may exclude:

1. Deep supplier catalog integration.
2. Full OCR automation.
3. Advanced BIM/takeoff.
4. Automated official form submission.
5. Predictive scheduling.
6. Full accounting integration.

## 28. Detailed Onboarding Wizard

The onboarding wizard must ask:

1. Is land already owned, under offer, or being searched?
2. How many families are participating?
3. How many houses or dwellings are planned?
4. Will the land remain one parcel, be divided, or is the structure unknown?
5. Who will own the land?
6. Who will own each house?
7. Will there be shared access or shared utilities?
8. Is a notaire already involved?
9. Is an architect required or already selected?
10. Is a builder/CCMI planned?
11. Are loans separate or shared?
12. Is any family dependent on selling another property?
13. Is any self-build work planned?
14. What is the commune and parcel reference?
15. What phase is the project in?

Based on answers, the system must create initial:

1. Project structure.
2. Families.
3. Houses.
4. Shared assets placeholders.
5. Risk templates.
6. Document checklist.
7. Deadline checklist.
8. Professional question list.
9. Budget categories.
10. Governance defaults.

## 29. Acceptance Tests for Two-Family Scenario

### Test 1: Two Families, One Parcel, Unknown Legal Structure

```gherkin
Given two families plan two houses on one parcel
When the project is created
Then the system must create House A, House B, shared infrastructure, legal structure scenarios, shared budget categories, governance rules, and risks for financing, division, easements, and shared maintenance.
```

### Test 2: Shared Driveway Invoice

```gherkin
Given a driveway invoice of 20,000 EUR
When the user assigns it to shared infrastructure with a 50/50 allocation
Then Family A owes 10,000 EUR and Family B owes 10,000 EUR, and the ledger shows who paid and who must reimburse whom.
```

### Test 3: Private Upgrade by One Family

```gherkin
Given Family A upgrades windows only for House A
When the quote is approved
Then the cost is allocated 100 percent to Family A and does not require Family B approval unless it affects shared permit, schedule, facade rules, or shared contract price.
```

### Test 4: Permit Strategy Comparison

```gherkin
Given the families compare separate permits, one permit for both houses, parcel division, and permis valant division
When they generate a comparison report
Then the report shows assumptions, deadlines, professionals to consult, documents needed, risks, and unresolved legal questions.
```

### Test 5: Missing Easement Rule

```gherkin
Given House B uses an access route crossing land allocated to House A
When no easement or shared ownership rule is recorded
Then the system marks the project as legally incomplete and adds a notaire validation task.
```

### Test 6: One Family Financing Failure

```gherkin
Given Family B's loan is refused
When the refusal is recorded
Then the system shows affected land purchase conditions, shared costs, permits, contracts, deposits, deadlines, and exit-clause checklist.
```

### Test 7: Shared Asset Without Maintenance Allocation

```gherkin
Given a shared pump is added
When no maintenance allocation is defined
Then the system warns that ownership, access, insurance, maintenance, replacement, and emergency rules are missing.
```

### Test 8: Contractor Insurance Scope Mismatch

```gherkin
Given a contractor is hired for waterproofing
When the uploaded decennale certificate does not list waterproofing activity
Then the system blocks ready-to-sign status and requests clarification or replacement certificate.
```

### Test 9: Reception of Shared Works

```gherkin
Given both houses are complete but the shared driveway has defects
When reception is performed
Then the system allows separate reception records for House A, House B, and the driveway, with reservations and holdback tracking by contract.
```

## 30. Open Legal Questions Requiring Professional Validation

The product must include a standard checklist of questions for a notaire, architect, municipality, insurer, and bank:

1. Can the parcel be divided as intended?
2. Does the project constitute a lotissement?
3. Is a declaration prealable or permis d'amenager required for division or common equipment?
4. Is a permis de construire valant division appropriate?
5. Are separate permits possible or preferable?
6. How should shared access and networks be legally secured?
7. Should an ASL, copropriete, SCI, indivision agreement, or easement structure be used?
8. How will each bank take security over its financed asset?
9. What happens if one family wants to sell?
10. What happens if one family defaults?
11. How are taxes and public charges allocated?
12. Are ABF or protected-site requirements applicable?
13. Is an architect mandatory based on surface and project structure?
14. What insurance is required before opening the site?
15. Does self-build work create resale or insurance risk?
16. What documents must be annexed to the deed?
17. What rules must survive resale to future owners?

## 31. Implementation Notes

1. Legal rules must be data-driven, not hard-coded into UI logic.
2. Every automated warning must cite the rule or project assumption that triggered it.
3. Scenario comparison must be reversible and auditable.
4. Shared and private scopes must be first-class concepts throughout the system.
5. The app must treat documents as authoritative evidence only after user or professional validation.
6. The system must support French labels and legal terms, with optional English explanations.
7. Monetary values must support EUR, VAT rates, inclusive/exclusive totals, and rounding rules.
8. Dates must support French administrative deadline conventions while preserving manual override and professional validation.
9. The product should avoid presenting uncertain legal pathways as simple green/red answers; use statuses such as "unknown", "to verify", "professionally validated", "blocked", and "not applicable".

## 32. Success Metrics

1. Percentage of required documents collected before signing or site start.
2. Number of unresolved high risks by phase.
3. Budget variance by category and by family.
4. Shared costs with approved allocation.
5. Deadlines missed.
6. Contractor certificates verified before signature.
7. Decisions recorded with required approvals.
8. Permit and insurance blockers resolved before work starts.
9. Defects closed within target time.
10. Completeness of handover and maintenance dossier.

## 33. Glossary

1. ABF: Architecte des Batiments de France.
2. ASL: Association Syndicale Libre, often used to manage shared equipment or common areas.
3. CCMI: Contrat de Construction de Maison Individuelle.
4. CU: Certificat d'urbanisme.
5. DAACT: Declaration attestant l'achevement et la conformite des travaux.
6. DOC: Declaration d'ouverture de chantier.
7. DP: Declaration prealable.
8. DTU: Document Technique Unifie.
9. Emprise au sol: ground footprint of construction as defined by planning rules.
10. Geometre-expert: surveyor authorized for boundary and division work.
11. Indivision: shared ownership where each owner holds an undivided share of the whole property.
12. Lotissement: land division operation creating lots intended for construction, subject to planning rules.
13. PC: Permis de construire.
14. PCVD: Permis de construire valant division.
15. PLU/PLUi: local/intercommunal planning document.
16. RE2020: French environmental regulation for new buildings.
17. Servitude: easement or legal burden benefiting another property or public utility.
18. SPANC: public service controlling non-collective sanitation.
19. Surface de plancher: regulated floor area calculation used for planning thresholds.
20. Taxe d'amenagement: development tax triggered by certain authorizations.
