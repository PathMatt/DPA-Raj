// Words for the deck, from "Hopefully final deck" (the PowerPoint script).
// Edit content here; assets/app.js only decides where and when it appears.
//
// Each demo has a rail (the step names) and a list of steps. A step has:
//   rail   which rail item is current (defaults to its position)
//   quote  what the speaker says on screen
//   chrome the title bar of the screen frame (defaults to the demo's)
//   tag    a flag in the title bar, e.g. "Research concept · not validated"
//   screen what the live demo shows (the placeholder text when there is no media)
//   images screenshots, clicked through in order (each can set a background); then the iframe, if there is one
//   iframe a live PathPresenter link (iframeAction labels the click that opens it)
//   previewImage  a still shown before the iframe loads
//   img    a single screenshot
//   html   a built visual
//   foot   optional footer text (defaults to "Step n of N")
//   notes  speaker notes (N)

const WSI = 'assets/wsi';
const EDU = 'assets/wsi/education/model';
// look-alike cases from other sources, for the image-search matches
const match = (n, label, extra = '') =>
  `<figure class="v-tile"><div style="background-image:url(assets/img/matches/match-${n}.jpg)"></div><figcaption>${label}${extra}</figcaption></figure>`;

window.CONTENT = {
  demos: {
    care: {
      kicker: '01 · Care', who: 'Swati Satturwar · The Ohio State University', chrome: 'PathPresenter · The Ohio State University · PV26-001',
      rail: ['In my worklist', 'Clinical context', 'Prior material', "Fellow's preview", 'Order stains', 'Navigate and measure', 'Show a colleague', 'Send for consult'],
      steps: [
        {
          quote: 'Before I start signing out, can I see which cases need my attention first?',
          screen: 'The worklist, with AI',
          images: [
            { src: 'assets/wsi/clinical-dashboard.png', alt: 'The clinical dashboard', background: '#fff' },
            { src: 'assets/wsi/in_worklist.png', alt: 'The case in the worklist', background: '#fff' }
          ],
          iframe: 'https://pathpresenter.net/public/display?token=b4e0dff7',
          iframeAction: 'Open the case',
          notes: 'Swati, beat 0. ON SCREEN: the worklist, with AI. Start where every morning starts: which cases need my attention first.'
        },
        {
          quote: 'Before I look at a single slide, I want to know the context.',
          screen: 'Clinical history, clinical images or imaging, and gross photos, all inside the case',
          images: [
            { src: 'assets/wsi/clinical-context.png', alt: 'Clinical context in the case' },
            { src: 'assets/wsi/clinical-context-info.png', alt: 'Clinical history and patient information' },
            { src: 'assets/wsi/slide-tray-select.png', alt: 'Select the slide tray' },
             { src: 'assets/wsi/radiology.png', alt: 'Select the slide tray' },
             { src: 'assets/wsi/radiology2.png', alt: 'Select the slide tray' },
            { src: 'assets/wsi/slidetrayexpand.png', alt: 'The slide tray, open' },
            { src: 'assets/wsi/gross-dialog-open.png', alt: 'Add a gross image' },
            { src: 'assets/wsi/add-gross-img.png', alt: 'Choose the gross image' },
            { src: 'assets/wsi/gross-img-check.png', alt: 'Gross image added to the case' },
            { src: 'assets/wsi/add-click-img-gross.png', alt: 'Open the gross image' },
            { src: 'assets/wsi/clinical-img-select.png', alt: 'Select a clinical image' },
            { src: 'assets/wsi/select-H&Eagain.png', alt: 'Back to the H&E' },
          ],
          notes: 'Swati, beat 1 (0:20 to 0:55). "Before I look at a single slide, I want to know the patient: age, site, history, imaging, the gross. With round blue cells, that context narrows the differential before I see a cell. A teenager with a soft tissue mass in the forearm points somewhere different from a young man with an abdominal mass or a child with a bone lesion. Here it\'s all in the case, not in another system."'
        },
        {
          quote: 'I want the history, imaging, gross findings, and prior material available while I review the case.',
          screen: 'Click through the side-by-side view. The prior case is shared from the education portal and imported into clinical as a prior, with a mock label',
          images: [
            { src: 'assets/wsi/select-H&Eagain.png', alt: 'The H&E' },
            { src: 'assets/wsi/add-prior-img.png', alt: 'Add the prior material' },
            { src: 'assets/wsi/view-prior-img.png', alt: 'The prior material in the case' },
            { src: 'assets/wsi/select-for-side-by.png', alt: 'Select slides for side by side' },
            { src: 'assets/wsi/prior-side-by-side.png', alt: 'Prior and current slides side by side' },
            { src: 'assets/wsi/compare-drowdown.png', alt: 'Compare options' },
            { src: 'assets/wsi/final-view-prior.png', alt: 'The prior next to today\'s slide' },
          ],
          notes: 'Swati, beat 2 (0:55 to 1:20). "If there\'s prior material, I want it next to today\'s case without putting in a request." Click through the side-by-side view. Raj shares the prior case in the education portal so it can be imported into clinical as a prior; make sure it carries a mock label.'
        },
        {
          quote: "My fellow has already reviewed the case and marked the areas we'd like to discuss.",
          screen: 'The fellow\'s annotations and draft diagnosis. Jump between “More nucleoli and pleomorphism than I\'d expect for Ewing?” and “Myxoid stroma between the lobules here: real or artifact?”, then type a reply on one',
          images: [
            { src: 'assets/wsi/final-view-prior.png', alt: 'The case with the prior' },
            { src: 'assets/wsi/close-fellow.png', alt: 'The fellow\'s annotations' },
            { src: 'assets/wsi/fellow-chat-noregion.png', alt: 'A question from the fellow' },
            { src: 'assets/wsi/fellow-chat-single.png', alt: 'A question from the fellow' },
            { src: 'assets/wsi/fellow-final-screen.png', alt: 'The fellow\'s questions answered' },
          ],
          notes: 'Swati, beat 3 (1:20 to 2:10). "My fellow previewed this case before I got to it. Each annotation is pinned to the exact spot, with a question. Both are fair questions, and the teaching point is that morphology alone won\'t settle a round cell sarcoma. I answer right here on the slide, and the teaching stays with the case instead of disappearing after sign-out."'
        },
        {
          quote: "I want to order the stains I need without leaving the case, and know when they're ready.",
          screen: 'Order CD99, ETV4 and WT1 from the viewer. Open the notification bell, then the expanded slide tray',
          images: [
            { src: 'assets/wsi/fellow-final-screen.png', alt: 'The case before ordering' },
            { src: 'assets/wsi/order-stain-select.png', alt: 'Select stains to order' },
            { src: 'assets/wsi/order-stain-open.png', alt: 'The order stains panel' },
            { src: 'assets/wsi/select-order-stain-dropdown.png', alt: 'Choose stains from the list' },
            { src: 'assets/wsi/order-stain-select-from-dropdown.png', alt: 'Stains selected' },
            { src: 'assets/wsi/order-stain-select.png', alt: 'Order placed' },
            { src: 'assets/wsi/notification-dropdown.png', alt: 'Notified when the stains are ready' },
            { src: 'assets/wsi/final-order-stain.png', alt: 'The stains in the case' },
          ],
          notes: 'Swati, beat 5 (2:40 to 3:25). "This is where I need stains, so I order from where I\'m looking. The order goes to the lab, and I don\'t keep checking. I\'m notified when the stains are scanned, and they land in the case. Here\'s the H&E next to the CD99. When I move one, both move. CD99 is positive, but patchy, not the crisp, diffuse membranous pattern I\'d expect in Ewing sarcoma." The deck\'s screen note orders CD99, ETV4 and WT1; confirm the CD99 description against the actual stain.'
        },
        {
          quote: "The tools I need are right here, whether I'm comparing slides, marking tumor, or preparing for molecular testing.",
          screen: 'Collapse back to the H&E alone. Annotate the tumor area in one segment, calculate the area, and show that only one slide needs to go for macrodissection',
          images: [
            { src: 'assets/wsi/navigate-screen.png', alt: 'Navigate the slide' },
            { src: 'assets/wsi/navigate-compare.png', alt: 'Compare slides' },
            { src: 'assets/wsi/measure-compare.png', alt: 'Measure the tumor' },
            { src: 'assets/wsi/navigate-side-by-side.png', alt: 'Slides side by side' },
            { src: 'assets/wsi/final-measure.png', alt: 'Tumor area marked and measured' },
          ],
          notes: 'Swati, beat 4 (flex). Collapse to the H&E, annotate the tumor area in one segment (as the fellow did), calculate the area, and show that only one slide needs to go for macrodissection.'
        },
        {
          quote: "CD99 doesn't settle the diagnosis. I'd like one of my colleagues to take a look.",
          screen: "Switch on de-identification mode and share with Archana at Cincinnati Children's",
          images: [
            { src: 'assets/wsi/d-ID-on.png', alt: 'De-identification mode on' },
            { src: 'assets/wsi/dIDOFF.png', alt: 'De-identification mode off' },
          ],
          notes: 'Swati, beat 7 (4:05 to 4:40). "This isn\'t a case I want to sign out alone. CD99 is positive, but lymphoblastic lymphoma can be CD99-positive too, so I want our hematopathologist to look. I share it with my annotations and a note. No Zoom, no walking glass down the hall. Here\'s the reply, inside the case, on the region I asked about. And when I want a colleague outside our institution to look, de-identification mode removes the patient\'s identifiers before the case leaves." The outside colleague on screen should be Archana, which sets up her opening.'
        },
        {
          quote: "I'll share the relevant slides, my findings, and the specific question I want answered.",
          screen: "Add the consult tag, then send to Cincinnati Children's",
          images: [
            { src: 'assets/wsi/d-ID-on.png', alt: 'De-identification mode on' },
            { src: 'assets/wsi/add-tags.png', alt: 'Add the consult tag' },
            { src: 'assets/wsi/share-report-consult.png', alt: 'Send for consult' },
          ],
          notes: 'Swati, beat 8 (4:40 to 5:10). "Last step. I mark the slides that need to go out, just these, add a note, and send them to Cincinnati Children\'s. I can track the consult from here. And this is where Archana picks it up."'
        },
      ],
    },

    consult: {
      kicker: '02 · Consult', who: "Archana Shenoy · Cincinnati Children's", chrome: "PathPresenter · Cincinnati Children's Hospital · PV26-001",
      rail: ['Email notification', 'Everything attached', 'Internal conference', 'Talk to Swati', 'More stains', 'Orders molecular', 'Report back'],
      steps: [
        {
          quote: "It's already in my LIS worklist. No separate login, no separate portal.", chrome: 'Mail · New consult from The Ohio State University',
          screen: 'The email notification. Click the view link',
          images: [
            { src: 'assets/wsi/consult/email-notfication.png', alt: 'Email notification for a new consult', background: '#fff' },
          ],
          notes: 'Archana, beat 1 (0:20 to 0:55). "The consult is in my worklist, next to my own cases. No courier, no glass in the mail, no separate portal to log into. Swati\'s lab scans on a different scanner than ours, and I shouldn\'t have to care. It opens like any of my slides, and it\'s already accessioned in our LIS."'
        },
        {
          quote: "I can review the slides alongside the history, prior findings, and referring pathologist's notes.",
          screen: 'Open case info, then the report to see the prior report. All the slides are there, including priors; click each one',
          images: [
            { src: 'assets/wsi/consult/everything-attached.png', alt: 'Everything attached to the consult' },
            { src: 'assets/wsi/consult/case-info.png', alt: 'Case information' },
            { src: 'assets/wsi/consult/case-info-with-report.png', alt: 'Case information with the referring report' },
          ],
          iframe: 'assets/wsi/consult/PV26-001_Preliminary_Report_DEMO.pdf',
          iframeAction: 'Open the preliminary report',
          notes: 'Archana, beat 2 (0:55 to 1:25). "Everything came with it: her report, the clinical history, her question, her annotations, and the CD99 she already ran. I\'m not calling her office to find out what was ordered. I start exactly where she stopped." The audience should recognize Swati\'s annotations from her segment.'
        },
        {
          quote: 'Easy consensus conference.',
          screen: 'The new dashboard. Open a conference with four other users',
          images: [
            { src: 'assets/wsi/consult/internal-conference.png', alt: 'Internal conference' },
            { src: 'assets/wsi/consult/internal-conference-live.png', alt: 'The conference, live' }
          ],
          notes: 'Archana. ON SCREEN: the new dashboard, then a consensus conference opened with four other users, all on the same slide.'
        },
        {
          quote: 'Discuss with the referring pathologist from the viewer itself.',
          screen: 'Open a chat with Swati. Archana asks, “Do you have the molecular report and DUX4 stain for the case?” Swati answers, “No, both are unavailable at our institute.”',
          images: [
            { src: 'assets/wsi/consult/chat-main.png', alt: 'Open the consult chat' },
            { src: 'assets/wsi/consult/blank-chat.png', alt: 'A new chat' },
            { src: 'assets/wsi/consult/chat-single.png', alt: 'The chat with Swati' },
            { src: 'assets/wsi/consult/chat-with-swati.png', alt: 'Chat with Swati about the case' },
          ],
          notes: 'Archana. Open a chat with Swati from the viewer: "Do you have the molecular report and DUX4 stain for the case?" Swati: "No, both are unavailable at our institute." No phone tag.'
        },
        {
          quote: 'I need additional stains. I want to review them alongside the original slides, regardless of which scanner was used.',
          screen: 'Request the DUX4 stain; the request goes to histology by email',
          images: [
            { src: 'assets/wsi/consult/more-order-stain.png', alt: 'Stain ordering options' },
            { src: 'assets/wsi/consult/order-stain-dropdown.png', alt: 'Choose a stain' },
            { src: 'assets/wsi/consult/open-dropdown.png', alt: 'The stain list' },
            { src: 'assets/wsi/consult/Order-stain-more.png', alt: 'Additional stain selected' },
            { src: 'assets/wsi/consult/duxStain.png', alt: 'DUX4 stain ordered', background: '#fff' },

          ],
          notes: 'Archana, beat 4 (2:05 to 2:40). Request DUX4. "These will tell me which way this goes. They\'re cut, scanned, and they land in this case with everything else, whichever lab cut them and whichever scanner they came off. I\'m notified when they\'re ready." The diagnosis is revealed after molecular testing, just before the report goes back.'
        },
        {
          quote: 'Can I mark the tumor, assess adequacy, and request the molecular testing needed to resolve the diagnosis?', chrome: "Beaker · Cincinnati Children's Hospital · PV26-001",
          screen: 'EWSR1::FLI1 FISH ordered',
          images: [
            { src: 'assets/wsi/consult/duxStain.png', alt: 'DUX4 stain ordered', background: '#fff' },
            { src: 'assets/wsi/consult/ordermol2.png', alt: 'The order list' },
            { src: 'assets/wsi/consult/ordermol3.png', alt: 'Choose the molecular test' },
            { src: 'assets/wsi/consult/ordermol4.png', alt: 'Molecular test ordered' },
             { src: 'assets/wsi/consult/ordermol5.png', alt: 'Molecular test ordered result' },
          ],
          notes: 'Archana. Mark the tumor, assess adequacy, and order the molecular test from the case: EWSR1::FLI1 FISH.'
        },
        {
          quote: 'My completed consultation goes back to the referring team, where they need it.', chrome: "Beaker · Cincinnati Children's Hospital · PV26-001",
          screen: 'The report as uploaded. From the email, open the expanded PDF report',
          images: [
            { src: 'assets/wsi/consult/final-report-mail.png', alt: 'The completed report by email', background: '#fff' },
            { src: 'assets/wsi/consult/again-move-report.png', alt: 'The report back in the referring case' },
          ],
          iframe: 'assets/wsi/consult/final-report.pdf',
          iframeAction: 'Open the final report',
          notes: 'Archana, beat 6 (3:15 to 4:15). "My report starts with what came in: the patient, the referring diagnosis, and the stains already done. I add my stains, the AI result I accepted, and my diagnosis and comment. The consult code is already right. When I sign out, the completed consult report goes electronically back into Swati\'s original Beaker case, and she\'s notified. She completes her reporting in her own LIS. There\'s no printing a report, faxing it, packaging slides, or shipping anything back."'
        },
      ],
    },

    discover: {
      kicker: '03 · Discover', who: 'Matthew Hanna · UPMC, Pittsburgh', chrome: 'PathPresenter Research · ADC Alliance',
      rail: ['Find similar cases', 'The ADC Alliance', 'Data from 35 sites', 'Searchable lists', 'Folders, permissions', 'Build a Study', 'Annotate', 'Export data', 'Build Model', 'Predict Outcomes'],
      steps: [
        {
          rail: 0, notes: 'Matt, beat 1 (0:20 to 1:05). "Before I write a single query, I start with the image. I draw a region on our case and ask the Alliance the question every pathologist asks: have we seen this before? The search runs on the pixels, not the words. The region becomes an image embedding, and it is compared against every slide this project is permitted to see. Back come the closest matches, from different sites, different scanners, different staining labs. Each one is a real case with a report, IHC, molecular results, treatment and follow-up behind it. For the pathologist, that\'s a reference library. For the researcher, it\'s the first glimpse of a cohort. But to search 35 institutions at once, you first need 35 institutions willing to work together." Site numbers, scanners and similarity scores are placeholders, not results.',
          quote: 'Have we seen this before? Ask with the slide itself.', chrome: 'PathPresenter Research · ADC Alliance · Search by image',
          html: `<div class="v-search">
            <div class="v-query"><p class="v-label">Query · our case</p>
              <figure class="v-tile v-tile-big"><div style="background-image:url(${WSI}/field40.jpg)"><i class="v-region"></i></div><figcaption>H&amp;E region drawn on our case</figcaption></figure>
              <p class="v-note">Region selected on the slide, converted to an image embedding, compared across every permitted slide.</p></div>
            <div class="v-matches"><p class="v-label">Similar cases</p>
              <div class="v-grid">${[['07', '0.94', 'A'], ['22', '0.92', 'C'], ['03', '0.91', 'B'], ['31', '0.89', 'A'], ['14', '0.88', 'D'], ['19', '0.86', 'B']].map(([s, c, k], i) => match(i + 1, `Site ${s} <b>${c}</b>`, `<span>Scanner ${k}</span>`)).join('')}</div></div>
            <p class="v-foot">Potential value: similar morphology linked to available records, within institutional permissions. Results shown are illustrative.</p>
            <p class="v-credit">Match images: Wikimedia Commons, CC BY-SA 3.0 / 4.0 and CC BY 2.0 (credits in README)</p></div>` },
        {
          rail: 1, notes: 'Matt, beat 2 (1:05 to 1:50). "That\'s why we built the ADC Alliance at UPMC. A model trained at one hospital learns that hospital: its scanner, its stain, its patients. Then it stumbles the first time it sees somebody else\'s slides. So we pooled the data. Thirty-five institutions contribute slides with their reports attached, de-identified, each under its own data use agreement. The result is one governed dataset with the real-world variation built in, and that variation is exactly what a model needs to generalize. The deal is simple: the institutions that contribute get the models back. Let me show you how a case moves through it." The 35-node ring is a schematic; dot colours are illustrative.',
          quote: 'Variation across sites is essential. Generalization must be demonstrated, not assumed.', chrome: 'ADC Alliance · Multisite data for generalizable AI',
          html: `<div class="v-alliance-layout">
            <img class="v-alliance-graphic" src="${WSI}/research/the-adc-alliance-graphcis.png" alt="ADC Alliance connects UPMC with contributing institutions.">
            <div class="v-alliance-cards">
              <div class="v-alliance-card"><strong>35</strong><p>contributing institutions, each under its own data use agreement</p></div>
              <div class="v-alliance-card"><strong>1</strong><p>governed, searchable dataset, with reports attached</p></div>
              <div class="v-alliance-card"><strong>Every</strong><p>contributor gets the models back</p></div>
              <div class="v-alliance-card v-alliance-card-takeaway"><p>Why pool? One site teaches one scanner, one stain, one population.</p></div>
            </div>
          </div>` },
        {
          rail: 1, notes: 'Matt, Alliance deep-dive (about 45 seconds; optional). "So what is the ADC Alliance? It\'s the AI Data Commons Alliance, a global consortium built to solve the problems that keep most pathology AI from generalizing: data that is too small and too uniform, too few people who can build and sustain models, privacy and governance silos, and the cost of storage and compute. The deal is simple. Sites contribute de-identified data under their own IRB. They keep full ownership and can withdraw. Pitt holds the data on HIPAA-compliant infrastructure in PathPresenter and covers storage. CPACE builds the algorithms. And value flows back: a royalty-free internal-use license to new IP from their data, and co-authorship on the publications. A steering committee sets priorities and approves proposals."',
          quote: 'Making AI in pathology accessible for all.', chrome: 'AI Data Commons (ADC) Alliance · What it is', foot: '03 · Discover · Step 2 of 8 · The Alliance',
          html: `<div class="v-alliance-details">
            <section class="v-alliance-problem">
              <p class="v-label">The problem</p>
              <div><strong>Data</strong><p>Limited, non-diverse data → biased models</p></div>
              <div><strong>Talent</strong><p>Most sites can't build or sustain AI alone</p></div>
              <div><strong>Silos</strong><p>Privacy, governance and organizational barriers</p></div>
              <div><strong>Cost</strong><p>Storage, compute and vendor models</p></div>
              <p class="v-alliance-result"><b>Result:</b> poorly generalized models, slow adoption, diminished clinical impact.</p>
            </section>
            <div class="v-alliance-deal-wrap">
              <p class="v-label">The deal · data consortium plan</p>
              <div class="v-alliance-deal">
                <article><strong>De-identified only</strong><p>Contributed under each site's IRB; WSI plus reports, molecular, treatment, outcomes</p></article>
                <article><strong>Sites own their data</strong><p>Full ownership and access retained; sites may withdraw</p></article>
                <article><strong>Pitt holds the data</strong><p>HIPAA-compliant storage on PathPresenter; Pitt covers storage costs</p></article>
                <article><strong>CPACE builds the AI</strong><p>Central hub for algorithm and tool development</p></article>
                <article class="v-alliance-card v-alliance-card-takeaway"><p>Royalty-free internal-use license to new IP; co-authorship</p></article>
                <article><strong>Steering group</strong><p>Reviews proposals, sets priorities, resolves disputes</p></article>
              </div>
            </div>
          </div>` },
        {
          rail: 2, quote: 'Ensuring the diversity of data.', chrome: 'AI Data Commons (ADC) Alliance · What it is',
          screen: 'Datasets in the ADC Alliance, each with an access request',
          images: [
            { src: `${WSI}/research/data-from-35-grpahics.png`, alt: 'Datasets from contributing institutions', background: '#fff' },
            { src: `${WSI}/research/data-from-35-grpahics-search.png`, alt: 'Searching across the contributed datasets', background: '#fff' },
          ],
          notes: 'Matt. The datasets contributing sites have shared into the Alliance, each with its own metadata and its own access request.'
        },
        {
          rail: 3, quote: 'Free text becomes fields I can search, and I can ask for more.',
          screen: 'Construct the query age < 18 and CIC-rearranged sarcoma, find a few slides per site, then the request-access workflow',
          images: [
            { src: `${WSI}/research/searchable-list.png`, alt: 'Searchable list of available cases', background: '#fff' },
            { src: `${WSI}/research/request-access.png`, alt: 'Request access to a dataset' },
            { src: `${WSI}/research/request-metadata.png`, alt: 'Request another metadata field' },
            { src: `${WSI}/research/searchable-list.png`, alt: 'The updated searchable list', background: '#fff' },
            { src: `${WSI}/research/approved-access.png`, alt: 'Access approved' },
            { src: `${WSI}/research/request-for-research.png`, alt: 'Research request' },
          ],
          notes: 'Matt, beat 5 (3:05 to 4:05). "The information lives in the reports, so it gets extracted: diagnosis, site, stains and their results, molecular findings. Free text becomes structured data I can search and sort, and every extracted field links back to its source report so I can verify it. But I can only search what I\'m permitted to use. If I realize the study also needs another data element, I can request that access from the institution. Once they approve it, that field becomes available to the project, without moving or duplicating the underlying data."'
        },
        {
          rail: 4, quote: 'Free text becomes fields I can search, and I can ask for more.',
          screen: 'How multiple studies are organized, each in its own folder with its own permissions',
          img: `${WSI}/research/folder-permission.png`,
          notes: 'Matt. Show how multiple studies are organized: folders, each carrying its own permissions.'
        },
        {
          rail: 5, quote: 'Every round cell sarcoma with a CD99 result, across 35 sites.',
          screen: 'Build a study: click through each screen',
          images: [
            { src: `${WSI}/research/buid-cohort.png`, alt: 'Build a cohort', background: '#fff' },
            { src: `${WSI}/research/project-details.png`, alt: 'Project details', background: '#fff' },
            { src: `${WSI}/research/document.png`, alt: 'Project documents', background: '#fff' },
            { src: `${WSI}/research/roi.png`, alt: 'Regions of interest', background: '#fff' },
            { src: `${WSI}/research/label.png`, alt: 'Labels', background: '#fff' },
            { src: `${WSI}/research/case-report.png`, alt: 'Case reports', background: '#fff' },
            { src: `${WSI}/research/preview-ecrf.png`, alt: 'Preview the electronic case report form', background: '#fff' },
            { src: `${WSI}/research/dataset.png`, alt: 'The cohort dataset', background: '#fff' },
            { src: `${WSI}/research/assign-dataset.png`, alt: 'Assign the dataset', background: '#fff' },
            { src: `${WSI}/research/assign-data-complete.png`, alt: 'Assign the dataset', background: '#fff' },
            { src: `${WSI}/research/project-launch.png`, alt: 'Launch the project', background: '#fff' },
          ],
          notes: 'Matt, beat 6 (4:05 to 4:45). "Now I can ask a real question: every round cell sarcoma with a CD99 result, across all 35 sites. Seconds, not months of chart review. And there\'s our case, the one Swati sent and Archana signed out, alongside the look-alikes the image search found." If the travelling case cannot be in the Alliance data, say "cases like ours".'
        },
        {
          rail: 6, quote: 'Ground truth means pathologists annotating, and every label is attributed.',
          screen: 'Annotation tools on a slide, the label set, and annotator assignments with progress',
          images: [
            { src: `${WSI}/research/assign-project-screen.png`, alt: 'Assign pathologists to an annotation project' },
            { src: `${WSI}/research/assign-project-list.png`, alt: 'Annotation assignments' },
            { src: `${WSI}/research/open-project.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation1.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation2.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation3.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation5.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation6.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation7.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation8.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation9.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation10.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation11.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation11A.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation11B.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation12.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation13.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation14.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation16.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation17.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation17a.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation18.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation19.png`, alt: 'Open the annotation project' },
             { src: `${WSI}/research/annotation18.png`, alt: 'Open the annotation project' }, 
            { src: `${WSI}/research/annotation20.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation21.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/annotation22.png`, alt: 'Open the annotation project' },
            
          ],
          notes: 'Matt, beat 8 (5:15 to 5:55). "Models need ground truth, and ground truth means pathologists annotating. The tools are built for that: regions, labels, assignments across sites, and a record of who annotated what."'
        },
        {
          rail: 7, quote: 'Ground truth means pathologists annotating, and every label is attributed.',
          screen: 'The data export workflow',
           images: [
            { src: `${WSI}/research/assign-project-screen.png`, alt: 'Assign pathologists to an annotation project' },
            { src: `${WSI}/research/result2.png`, alt: 'Annotation assignments' },
            { src: `${WSI}/research/result3.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/result4.png`, alt: 'Open the annotation project' },
            { src: `${WSI}/research/result5.png`, alt: 'Open the annotation project' },
            
            
          ],
          notes: 'Matt. Show the data export workflow, then hand to Junya.'
        },
        {
          rail: 8, quote: 'Build Model', chrome: 'PathPresenter Research · Build Model', tag: 'Final slide A',
          screen: 'Final slide A | Build Model',
          video: `${WSI}/research/WSI_Video.mp4`,
          videoTitle: 'WSI_Genie_CIC_Sarcoma_Demo_v2.mp4',
          notes: 'Final slide A · Build Model. Play the WSI_Genie_CIC_Sarcoma_Demo_v2.mp4 video.'
        },
        {
          rail: 9, quote: 'Overall Survival in Pediatric CIC-Rearranged Sarcoma Stratified by Nuclear Atypia and Mitotic Index (Fictitious Cohort).', chrome: 'PathPresenter Research · Predict Outcomes',
          screen: 'Overall Survival in Pediatric CIC-Rearranged Sarcoma Stratified by Nuclear Atypia and Mitotic Index (Fictitious Cohort)',
          img: `${WSI}/research/graphcis-chart.png`,
          imageClass: 'predict-outcomes-image',
          notes: 'Predict Outcomes · Overall Survival in Pediatric CIC-Rearranged Sarcoma Stratified by Nuclear Atypia and Mitotic Index (Fictitious Cohort).'
        },
      ],
    },

     teach: {
      kicker: '04 · Teach', who: 'Junya Fukuoka · Nagasaki University', chrome: 'PathPresenter Education · Nagasaki University',
      rail: ['Share for preview', 'Pre-assessment', 'Live-slide lecture', 'High-yield set', 'Conference', 'Course'],
      steps: [

        {
          quote: 'Attendees get to preview cases from anywhere in the world. Nothing to install.',
          screen: 'Create a share link, then open it on a phone or a second browser',
          images: [
            { src: 'assets/wsi/education/share-presentation.png', alt: 'Open the presentation sharing options' },
            { src: 'assets/wsi/education/share-presentation-dialog.png', alt: 'Choose presentation sharing settings' },
            { src: 'assets/wsi/education/share-presentation-link.png', alt: 'Copy the presentation share link' },
          ],
          iframe: 'https://pathpresenter.net/public/presentation/display?token=b060332b',
          notes: 'Junya, beat 2 (1:00 to 1:30). "Before the session, I send one link. Learners preview the presentation and the whole slides on any device, with nothing to install. They come to class having already looked."'
        },
        // {
        //   quote: 'Before I teach, I want to know what they know.',
        //   screen: "A question built on the whole-slide image with four options (Ewing sarcoma, alveolar rhabdomyosarcoma, CIC-rearranged sarcoma, DSRCT), the learner's view, then the baseline results",
        //   notes: 'Junya, beat 3 (1:30 to 2:05). "Before I teach, I want to know what they know. I build the question on the slide itself: here is the H&E, what is your diagnosis? This is where my learners start." It is the same differential Raj showed at the start; point back to it, but don\'t show the answer.'
        // },
        {
          quote: 'Before I teach, I want to know what they know.',
          screen: 'The same question after the session, then the pre-versus-post comparison',
          images: [
            { src: 'assets/wsi/education/dashboard.png', alt: 'Open the education dashboard' },
            { src: 'assets/wsi/education/assessment-list.png', alt: 'Choose an assessment from the assessment list' },
          ],
          iframe: 'https://pathpresenter.net/public/takeAssessment?token=9a3149d0',
          iframeAction: 'Open post-assessment',
          notes: 'Junya, beat 3 (1:30 to 2:05). "Before I teach, I want to know what they know. I build the question on the slide itself: here is the H&E, what is your diagnosis? This is where my learners start." It is the same differential Raj showed at the start; point back to it, but don\'t show the answer.'
        },
        {
          quote: 'I want my learners to explore the whole slide, just as they would sitting next to me at the microscope.',
          screen: "Import an existing PowerPoint, place the case's whole slide images into the slides, then zoom inside one",
          previewImage: {
            src: 'assets/wsi/education/share-presentation.png',
            alt: 'Preview of a whole-slide viewer'
          },
          iframe: 'https://pathpresenter.net/public/presentation/display?token=bf91ed49',
          notes: 'Junya, beat 1 (0:20 to 1:00). "I start with what every teacher already has: a PowerPoint. I bring it in as it is, and where I used to paste a photo, I put the whole slide. Now the learner doesn\'t see my picture of the tumor. They see the tumor, and they can go anywhere on the slide."'
        },
        {
          quote: 'I can build a collection of cases that learners can revisit whenever they need to.',
         screen: 'A high-yield set of six small round cell tumors in self-study mode: Ewing sarcoma, CIC-rearranged sarcoma, BCOR-altered sarcoma, alveolar rhabdomyosarcoma, DSRCT and lymphoblastic lymphoma, each with its key stains',
          images: [
            { src: 'assets/wsi/education/dashboard.png', alt: 'Open the education dashboard' },
            { src: 'assets/wsi/education/highyield-list.png', alt: 'View the high-yield case list' },
            { src: 'assets/wsi/education/highyiled-manage.png', alt: 'Manage the high-yield set' },
            { src: 'assets/wsi/education/highyiled-manage-inner.png', alt: 'View high-yield set details' },
          ],
          iframe: 'https://pathpresenter.net/public/case?token=86ad3aca',
          iframeAction: 'Open high-yield case',
          notes: 'Junya, beat 6 (3:15 to 3:55). "One case is a lesson. A set is a skill. I build a high-yield set of small round cell tumors, each with its key stains side by side. A resident can work through it alone, at night, as many times as they need."'
        },
        {
          quote: 'The same conference material can become a live presentation, an interactive case discussion, or part of a collaborative learning experience with experts and peers.',
         screen: 'A conference view with an in-room and online audience on one slide',
          images: [
            { src: 'assets/wsi/education/conference-dashboard.png', alt: 'Open the conference dashboard' },
             { src: 'assets/wsi/education/conference-list.png', alt: 'Open the conference dashboard' },
            { src: 'assets/wsi/education/conference-mainscreen.png', alt: 'View the main conference screen' },
            { src: 'assets/wsi/education/conference-lacture.png', alt: 'Conference lecture view' },
            { src: 'assets/wsi/education/conference-lacture-preview.png', alt: 'Conference lecture preview' },
            { src: 'assets/wsi/education/conference-preassessment.png', alt: 'Conference pre-assessment screen' },
            { src: 'assets/wsi/education/conference-poster.png', alt: 'Conference poster workspace' },
            { src: 'assets/wsi/education/conference-poster-list.png', alt: 'Conference poster list' },
            { src: 'assets/wsi/education/conferencce-poster-view.png', alt: 'Conference poster detail view' }
          ],
          notes: 'Junya, beat 6 (3:15 to 3:55). "One case is a lesson. A set is a skill. I build a high-yield set of small round cell tumors, each with its key stains side by side. A resident can work through it alone, at night, as many times as they need."'
        },
        {
          quote: 'The same teaching material can become a lecture, a self-study exercise, or part of a larger course.',
          screen: 'The same material inside a course with modules',
          images: [
            { src: 'assets/wsi/education/course-dashboard.png', alt: 'Open the course dashboard' },
            { src: 'assets/wsi/education/course-list.png', alt: 'View the course list' },
            { src: 'assets/wsi/education/couse-preview.png', alt: 'Preview a course' },
            { src: 'assets/wsi/education/course-view.png', alt: 'View course content' },
            { src: 'assets/wsi/education/course-assessment.png', alt: 'View the course assessment' },
          ],
          notes: 'Junya, beat 7 (3:55 to 4:30). "The same material goes into a course, with modules learners take at their own pace. Or into a conference, with the room and the online audience on the same slide. I build it once and use it everywhere."'
        },
      ],
    },

    // Junya's education model, from "Education model_PathPresenter_Fukuoka_20261016"
    edu: {
      kicker: '04 · Teach · Education model', who: 'Junya Fukuoka · Nagasaki University', chrome: 'Education model · Nagasaki University',
      rail: ['Lectures for students', 'Student feedback', 'QR slide seminars', 'Patient advocacy', 'Why PathPresenter'],
      steps: [
        {
          quote: 'Sharing presentations with medical students.',
          html: `<div class="v-edu-lecture">
            <video src="${EDU}/lectures.mp4" poster="${EDU}/lectures-poster.jpg" autoplay muted loop playsinline aria-label="Sharing a lecture presentation in PathPresenter"></video>
            <div class="v-edu-points">
              <p class="v-label">Today</p>
              <p>Students have access to lecture content through shared links.</p>
              <p>Each professor usually uploads PDF versions of their PowerPoint slides.</p>
              <p class="v-label">Using PathPresenter is easy</p>
              <ul><li>Embed a link to the lecture presentation.</li><li>Key WSIs are embedded in the PowerPoint file.</li><li>Comparing slides helps students understand the findings.</li><li>Annotations help students understand difficult cases.</li></ul>
            </div></div>`,
          notes: 'Junya. Education model, part 1: sharing presentations with medical students. Lecture content usually reaches students as PDFs of the slides; with PathPresenter the lecture is a link, the key whole-slide images sit inside the PowerPoint, and students can compare slides and follow annotations on difficult cases.'
        },
        {
          quote: 'Well accepted by the students.',
          img: `${EDU}/feedback.png`, imageClass: 'v-edu-chart',
          screen: 'Students rated the lecture from 1 to 10 (89 responses): 36 gave it 10, 11 gave 9 and 24 gave 8',
          notes: 'Junya. Student feedback: 89 responses rating the lecture from 1 to 10; 36 (40.4%) gave it 10, 11 gave 9 and 24 gave 8.'
        },
        {
          quote: 'Using QR codes for slide seminars.',
          video: `${EDU}/seminar.mp4`, poster: `${EDU}/seminar-poster.jpg`, videoTitle: 'Using QR codes for slide seminars',
          notes: 'Junya. Education model, part 2: QR codes for slide seminars. The case is presented with a QR code on the slide; attendees open the whole-slide image on their own phone or laptop and explore it while the seminar runs.'
        },
        {
          quote: 'QR code share for patient advocacy.',
          html: `<div class="v-edu-advocacy">
            <figure><img src="${EDU}/advocacy-event.jpg" alt="Audience at a patient advocacy event scanning a QR code on the screen"></figure>
            <div class="v-edu-qr"><img src="${EDU}/advocacy-qr.png" alt="QR code shared at the event"><p class="v-label">Scan to view</p></div>
            </div>`,
          notes: 'Junya. Education model, part 3: QR code sharing for patient advocacy. At public and patient events the audience scans a QR code and sees the actual slides on their own phones.'
        },
        {
          rail: 3, quote: 'Easy sharing of WSI slides by QR code.',
          video: `${EDU}/qr-sharing.mp4`, poster: `${EDU}/qr-sharing-poster.jpg`, videoTitle: 'Easy sharing of WSI slides by QR code',
          notes: 'Junya. Making the QR code: select the slides in PathPresenter and share; the QR code opens them on any device, without downloading files.'
        },
        {
          rail: 4, quote: 'From passive viewing to active learning.', chrome: 'Why PathPresenter for Education?',
          html: `<div class="v-edu-why">
            <div><b>Simple &amp; accessible</b><p>Easy to use on any device.</p></div>
            <div><b>Interactive learning</b><p>Explore WSIs independently while following the lecture.</p></div>
            <div><b>Easy sharing</b><p>Share via links or QR codes for anytime review.</p></div>
            <div><b>Secure access</b><p>View slides without downloading files.</p></div>
            <div><b>Privacy protection</b><p>Share de-identified slides without sensitive metadata.</p></div>
            <div><b>Excellent feedback</b><p>Highly appreciated by students and other learners.</p></div>
            </div>`,
          notes: 'Junya. Why PathPresenter for education: simple and accessible on any device; interactive, with learners exploring the slides themselves while following the lecture; easy sharing by link or QR code; secure, with no files to download; de-identified slides without sensitive metadata; and well received by students. From passive viewing to active learning.'
        },
      ],
    },
  },

  // Speaker notes for the slides that are not demo steps, by slide id.
  notes: {
    's-title': 'Raj, under a minute. "Good afternoon. A pathologist does far more than sign out cases. In a single day we diagnose, consult, teach and do research. For a century one instrument held all of that together: the microscope. When we went digital, we split those jobs into separate systems. This session is about putting them back together. No feature tour. One real case, four pathologists, four institutions, and you\'ll watch it travel: worked up in Columbus, sent for consult in Cincinnati, studied in Pittsburgh, and taught in Nagasaki. One platform, and no glass shipped."',
    's-disclosures': 'Raj, 20 seconds. Read the relationships plainly: I founded PathPresenter; Matt is a senior advisor; Swati, Archana and Junya have nothing to disclose. Then the four ground rules: sponsored session, and every institution on stage uses PathPresenter; every speaker is a practicing pathologist showing their own workflow; the case is de-identified; the handoffs were re-enacted on the platform for today.',
    's-question': 'Raj. Four essential roles: diagnose, consult, discover and teach. Too often, each sits in a separate system. Scanning the slide was the easy part. Connecting everything around it is harder.',
    's-case': 'Raj. Present the case: a 14-year-old, a forearm excision, a nodule growing over six months, a prior biopsy that was inconclusive. Let the H&E sit for a beat. "Every pathologist in this room has had this case on their desk." The slide on screen is the case\'s own H&E. Drag to move, scroll to zoom; V opens the full-screen viewer.',
    's-vote1': 'Raj. The differential for this case: Ewing sarcoma, alveolar rhabdomyosarcoma, CIC-rearranged sarcoma and desmoplastic small round cell tumor. Don\'t reveal the answer; it comes at the end.',
    's-second': 'Raj, 30 seconds. A population-based study across three European regions: of 1,463 patients, the first pathologist and the expert agreed fully in 56 percent; 35 percent differed in grade or subtype; 8 percent were completely discordant, such as benign versus malignant or a different tumor type. Small round cell tumors are exactly the cases we send out for a second opinion.',
    's-overview': 'Raj. This is the overview. Four stops, each a question a pathologist actually asks. Every speaker demos live, in the same format: what the pathologist needs, then where it lives in PathPresenter. The last click of each segment is the first screen of the next. Hand to Swati as the camera pulls back from the slide to Ohio State.',
    's-card1': 'Swati, beat 0 (0:00 to 0:20). "This is the case we\'ll follow through the whole session: a small round blue cell tumor in a 14-year-old. Every one of you has had this case on your desk. I\'m going to work it up the way I would on a normal morning. At each step I\'ll tell you what I need as the pathologist, then show you where it is." Her segment runs 5:10.',
    's-workspace': 'Swati. The whole case in one place, before the steps. The H&E tile is live: drag and scroll to move around the slide.',
    's-send1': 'Transition, about 10 seconds; Raj or silent. 159 km. The slides travel as whole-slide images in Ohio State\'s own scanner format: nothing converted, no glass shipped.',
    's-card2': 'Archana takes the clicker. Let the divider sit for a beat. Her segment runs 4:40, plus about two minutes for her consult-program slides.',
    's-glass-before': 'Archana, 15 seconds. The glass consult: slides packaged, in transit, unboxed, interpreted, reported, and shipped back. Six steps, two shipments, and the patient waits through all of them.',
    's-glass-after': 'Archana, 15 seconds. What changes when the slides can be shared electronically: reviewed by the first pathologist, transferred electronically, reviewed by the second, reported. Four steps, all in a day\'s work.',
    's-arrival': 'Archana, 20 seconds. Her Cincinnati Children\'s consult figures: glass by courier takes 24 hours locally and up to 72 internationally; whole-slide images arrive in 30 minutes to an hour, regardless of dock availability or working days. Confirm the figures before showing.',
    's-portal': 'Archana, about 45 seconds. Her consult-portal slides, merged into one: the LIS is the ground truth, so patient and case information flows into PathPresenter without re-entry; the workflow is the same for internal and external cases; molecular results come back tagged to the original referred case; and the referring institution can see key studies without waiting for slides to return. Then: "That\'s where Matt picks it up."',
    's-send2': 'Transition, about 10 seconds. 414 km. The archived case enters a shared research collection; nobody ships hard drives.',
    's-card3': 'Matt, beat 0 (0:00 to 0:20), suggested words: "Archana signed it out and archived it. Now it\'s one case among thousands, and the question changes from what is this to have we seen this before." Decide on the Alliance deep-dive steps and the flex beats at the dry run.',
    's-cohort': 'Matt. The cohort, visualized: the traveling case pulls back into the collection, then the query narrows it. If the traveling case cannot be in the alliance data, say "cases like ours".',
    's-send3': 'Transition, about 10 seconds. 11,317 km across the Pacific, into a teaching collection. Still no glass shipped.',
    's-card4': 'Junya, beat 0 (0:00 to 0:20). "Matt turned one case into a dataset. I\'m going to turn it into teaching, for a resident down the hall and for a pathologist on the other side of the world, at the same time." His segment runs 4:50.',
    's-world': 'Raj. 159 plus 414 plus 11,317 km: 11,890 km in all. Four sites, three handoffs, no glass shipped. Then back to the field at Ohio State.',
    's-home': 'Every site\'s work sits on the same field, in the same case. The camera dives back to Ohio State and the 40x field.',
    's-diagnosis': 'Archana, about 30 seconds, between molecular testing and the report back. "CIC-rearranged sarcoma." Walk what settled it: the CD99 was patchy instead of diffusely membranous; ETV4 and WT1 were nuclear, which pointed to a CIC rearrangement; DUX4 and fusion testing at Cincinnati Children\'s confirmed it. Then why it matters: it behaves worse than Ewing sarcoma and responds less to Ewing-type chemotherapy, so the name changes the conversation with the oncologist. Raj can echo the close later: "Four institutions, one answer, and the patient never waited for a box to arrive. That\'s what better together means." Confirm the stains and molecular result the case actually has before showing.',
    's-history': 'Raj, 45 seconds. "We built around the pathologist, not around a product category. In 2018 I needed a better way to teach. Then the FDA asked whether we could collect research-grade data at scale, so we built research. Then the pandemic locked pathologists out of their labs, and they started sending each other consults, so we built consults. Primary diagnosis came last. The build order is the argument: every module you saw today began as a gap we hit as pathologists, and was built for the person signing out the case." The 70,000+ users figure is carried over from an earlier draft; confirm before showing.',
    's-never': 'Raj, about 60 seconds. "So what makes one platform different? Look at what happened to this case: it never started over. In Columbus it picked up its history, the fellow\'s questions, three stains and a marked block. In Cincinnati it got a chat, a consensus conference, DUX4 and a fusion result, and the report went home on its own. In Pittsburgh it joined a cohort across 35 sites and left as a governed export. In Nagasaki it became a lecture, an assessment and a course. Nobody re-entered it, re-scanned it, re-uploaded it or re-explained it. Four things made that possible. It\'s pathologist-first, built for the person signing out the case. The context travels with the case, so Archana started exactly where Swati stopped. It\'s neutral by design: any scanner, any LIS, any AI model, inside the systems you already run. And the pathologist decides: AI works in the background, and the pathologist signs. One more thing. Look at who touched this case first and last: a fellow in Columbus and a learner in Nagasaki. That\'s what democratizing knowledge looks like when it\'s built in, not bolted on."',
    's-next': 'Raj, 60 to 75 seconds. Lift the energy, and be precise about status. "You\'re going to see a lot of agents at this meeting. Every department in this room works differently, and in this field any agent you freeze today is out of date in a few months. So we\'re not building agents for you. We\'re building the place where you build your own. We provide the infrastructure and keep it current. You build it, test it, deploy it, monitor it, and change it when your practice changes. The first three: a clinical summary agent that reads the EMR before you open the case; a case-tracking agent that knows where every case, stain and consult stands; and a report-drafting agent that hands you a structured, coded draft. Invisible until you need it. And the pathologist signs. Always. This is in design right now, and we\'re building it with the people in rooms like this one." Keep the last sentence only if you want design-partner conversations after the session.',
    's-status': 'Raj, 30 seconds. "And because enthusiasm is cheap, here is exactly where each piece stands. Every row has a label, and you should hold us to it." Resolve every row with the team before the dry run.',
    's-tissue': 'Raj, 60 seconds, and this is the peak. Slow down; let each line land. "When we started, the question was whether one platform could work with any scanner. Today you watched one case cross three scanners, and not a single file was converted. Then the question was whether it could work with any AI. The next question is bigger. Think about the slide Swati opened at the start of this session. It holds far more than morphology: the proteins, the spatial expression, the molecular alterations. Take our case. It took four institutions, three rounds of stains and a fusion test to answer one question: what is it? Imagine a first look at the H&E that already said: not Ewing-like, think CIC or BCOR. That\'s research today, not a validated tool. But that\'s where this is going. Our role isn\'t to own every model or modality. It\'s to make them usable together, in context, where the pathologist decides." Keep it honest if asked: spatial and proteomic data would come through partners, governed by the institution that owns the tissue.',
    's-always': 'Raj, 20 seconds, the last word. Build it line by line. "Pathology has always been better together. The microscope had a second head. The hallway had a second opinion. The sign-out room had a resident. Now, so does the software. Thank you to Swati, Archana, Matt and Junya. One case, four of us, one platform. That\'s better together." Then open to questions with the closing slide up.',
    's-close': 'Leave this up during the room\'s questions. The QR opens the same public PathPresenter link as the case.',
    's-thanks': 'Leave this up during the room\'s questions. The QR opens the same public PathPresenter link as the case.',
  },
};
