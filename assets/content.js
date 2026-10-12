// Words for the deck, from "Better Together · PV 2026 v4" (the PowerPoint script).
// Edit content here; assets/app.js only decides where and when it appears.
//
// Each demo has a rail (the step names) and a list of steps. A step has:
//   rail   which rail item is current (defaults to its position)
//   quote  what the speaker says on screen
//   chrome the title bar of the screen frame (defaults to the demo's)
//   tag    a flag in the title bar, e.g. "Research concept · not validated"
//   screen placeholder text for the live demo
//   img    optional screenshot shown instead of the placeholder
//   html   optional built visual shown instead of the placeholder
//   foot   optional footer text (defaults to "Step n of N")
//   notes  speaker notes (N)

const WSI = 'assets/wsi';
const tile = (i, label, extra = '') => {
  const x = (i % 8) * 100 / 7, y = Math.floor(i / 8) * 100 / 5;
  return `<figure class="v-tile"><div style="background-image:url(${WSI}/cohort.jpg);background-size:800% 600%;background-position:${x}% ${y}%"></div><figcaption>${label}${extra}</figcaption></figure>`;
};

window.CONTENT = {
  demos: {
    care: {
      kicker: '01 · Care', who: 'Swati Satturwar · The Ohio State University', chrome: 'PathPresenter · The Ohio State University · PV26-001',
      rail: ['In the worklist', 'Clinical context', 'Prior material', "Fellow's preview", 'Order stains', 'Navigate and measure', 'Show a colleague', 'Send for consult'],
      steps: [
        {
          quote: 'The model ran before I opened the case. I accept, modify or override.',
          screen: 'The [model name] result already on the slide. Open it, accept or modify it, and show it carried into the draft report',
          images: [
            { src: 'assets/wsi/clinical-dashboard.png', alt: 'Open the clinical dashboard' },
            { src: 'assets/wsi/in_worklist.png', alt: 'View the case in the worklist' }
          ],
           iframe: 'https://pathpresenter.net/public/display?token=b4e0dff7',
          notes: 'Swati, beat 6 (3:25 to 4:05). "AI shouldn\'t be another window or another login. The model ran before I opened the case. The result is on the slide, I can see what it found, and I decide: accept, modify, or override. Whatever I decide is what goes into my report." Model name to confirm with Swati.'
        },
        {
          quote: 'Before I look at a single slide, I want to know the patient.',
          screen: 'Clinical history and patient information',
          images: [
            { src: 'assets/wsi/clinical-context.png', alt: 'Whole-slide overview' },
            { src: 'assets/wsi/clinical-context-info.png', alt: 'Higher-magnification tissue detail' }
          ],
          notes: 'Swati, beat 1 (0:20 to 0:55). "Before I look at a single slide, I want to know the patient: age, site, history, imaging, the gross. With round blue cells, that context narrows the differential before I see a cell. A prior melanoma, an older patient with a skin nodule, a young man with an abdominal mass: each points somewhere different. Here it\'s all in the case, not in another system."'
        },
        {
          quote: "If there's prior material, I want it next to today's case, without a request.",
          screen: "Prior biopsy slides and report, open side by side with today's slide",
          images: [
            { src: 'assets/wsi/slide-tray-select.png', alt: 'Whole-slide overview' },
            { src: 'assets/wsi/slidetray-open.png', alt: 'Higher-magnification tissue detail' },
            { src: 'assets/wsi/add-gross-img.png', alt: 'Higher-magnification tissue detailss' },
            { src: 'assets/wsi/gross-img-check.png', alt: 'Gross image added to the case' },
            { src: 'assets/wsi/select-gross-viewer.png', alt: 'Higher-magnification tissue detailssss' },
          ],
          notes: 'Swati, beat 2 (0:55 to 1:20). "If there\'s prior material, I want it next to today\'s case without putting in a request. Here\'s the earlier specimen, slides and report, side by side." Drop this step if the case has no prior material.'
        },
        {
          quote: 'My fellow got there first, and left questions pinned to the slide.',
          screen: 'The fellow\'s annotations and draft diagnosis. Jump between “Nuclear molding and fine chromatin here. Merkel?” and “Is this desmoplastic stroma around the nests?”, then type a reply on one',
          images: [
            { src: 'assets/wsi/select-H&E.png', alt: 'Whole-slide overview' },
            { src: 'assets/wsi/report-issue-screen.png', alt: 'Higher-magnification tissue detail' },
            { src: 'assets/wsi/report-issue-dropdown.png', alt: 'Higher-magnification tissue detailss' },
            { src: 'assets/wsi/slide-issue-selected.png', alt: 'Gross image added to the case' },
            { src: 'assets/wsi/select-issue-again.png', alt: 'Gross image added to the case' },
            { src: 'assets/wsi/software-issue.png', alt: 'Higher-magnification tissue detailssss' },
            { src: 'assets/wsi/select-H&E.png', alt: 'Higher-magnification tissue detailssss' },
          ],
          notes: 'Swati, beat 3 (1:20 to 2:10). "My fellow previewed this case before I got to it. Each annotation is pinned to the exact spot, with a question. Both are fair questions, and the teaching point is that morphology alone won\'t settle a round blue cell tumor. I answer right here on the slide, and the teaching stays with the case instead of disappearing after sign-out."'
        },
        {
          quote: "I order from where I'm looking, and I'm told when the stains are back.",
          screen: 'The order panel in the viewer with keratin, CK20, synaptophysin, SOX10, CD45, desmin and WT1. Cut to the “stains ready” notification, then open the H&E and the key stain synchronized',
          images: [
            { src: 'assets/wsi/order-stain-select.png', alt: 'Select stains to order' },
            { src: 'assets/wsi/order-stain-open.png', alt: 'Open the order stains panel' },
            { src: 'assets/wsi/order-stain-view.png', alt: 'Open the order stains in the viewer' },
            { src: 'assets/wsi/order-stain-side-by-side.png', alt: 'View the slide and stain side by side' },
            { src: 'assets/wsi/order-stain-side-by-side-selected.png', alt: 'Select the stain to compare side by side' },
          ],
          notes: 'Swati, beat 5 (2:40 to 3:25). "This is where I need stains, so I order from where I\'m looking: a keratin, CK20 and synaptophysin for Merkel, SOX10 for melanoma, CD45 for lymphoma, desmin and WT1 for desmoplastic small round cell tumor. The order goes to the lab, and I don\'t keep checking. I get notified when the stains are scanned, and they land in the case. The H&E next to the stain that answers the question. When I move one, both move."'
        },
        {

          quote: 'I move with the keyboard or by touch, and measure right on the slide.',
          screen: 'Move between slides with the keyboard. Measure the tumor and mark the best area for stains and molecular testing',
          images: [
            { src: 'assets/wsi/navigate-measure.png', alt: 'Select annotation tool' },
            { src: 'assets/wsi/annoation-draw.png', alt: 'Draw an annotation on the slide' },
            { src: 'assets/wsi/annoatation-save.png', alt: 'Save the slide annotation' },
            { src: 'assets/wsi/annotation-preview.png', alt: 'Preview the saved annotation' },
          ],
          notes: 'Swati, beat 4 (2:10 to 2:40, flex). "I move between slides with the keyboard, or by touch on a touchscreen. I measure the tumor and mark the best area for stains and any molecular work, right here." In the 5-minute version, fold this into step 3 and skip the slide.'
        },
        {
          quote: "CD99 doesn't settle it. I don't want to sign this out alone.",
          screen: "Share with the hematopathologist, with annotations and a note, and show the reply on the slide. Then switch on de-identification mode and share with Archana at Cincinnati Children's",
          images: [
            { src: 'assets/wsi/show-collegue.png', alt: 'Then switch on de-identification mode' },
            { src: 'assets/wsi/didmode.png', alt: 'De-Identified Mode' },
          ],
          iframe: 'https://pathpresenter.net/public/display?token=b4e0dff7',
          notes: 'Swati, beat 7 (4:05 to 4:40). "CD99 doesn\'t settle it, and this isn\'t a case I want to sign out alone. I share it with my annotations and a note, and here\'s the reply, inside the case, on the region I asked about. If I want a colleague outside our institution to look, de-identification mode removes the patient\'s identifiers before the case leaves." The outside colleague on screen should be Archana, which sets up her opening.'
        },
        {
          quote: 'I send only the slides that need to go, with a note.',
          screen: "Select the slides to send, not the whole case. Add a note, send to Cincinnati Children's, and show the tracked status",
          images: [
            { src: 'assets/wsi/chat.png', alt: 'Open a chat with a colleague' },
            { src: 'assets/wsi/case-chat.png', alt: 'Discuss the case with a colleague' },
            { src: 'assets/wsi/chat-with-consult.png', alt: 'Discuss the case with a colleague' },
            { src: 'assets/wsi/send-consult.png', alt: 'Report to Consultant' },
            { src: 'assets/wsi/share-report-consult.png', alt: 'Share Report for Consult' },
          ],
          notes: 'Swati, beat 8 (4:40 to 5:10). "Last step. I mark the slides that need to go out, just these, add a note, and send them to Cincinnati Children\'s. I can track the consult from here. And this is where Archana picks it up."'
        },
      ],
    },

    consult: {
      kicker: '02 · Consult', who: "Archana Shenoy · Cincinnati Children's", chrome: "PathPresenter · Cincinnati Children's Hospital · PV26-001",
      rail: ['Email notification', 'Everything attached', 'Internal conference', 'Talk to Swati', 'More stains', 'Orders Molecular', 'Report back',],
      steps: [
        {
          quote: 'Its already in my LIS worklist. No separate login, no separate portal.', chrome: 'Mail · New consult from The Ohio State University',
          screen: "The email notification that a consult just came in. Open it into PathPresenter, logged in at Cincinnati Children's",
          images: [
            { src: 'assets/wsi/consult/email-notfication.png', alt: 'Email notification for a new consult' },
            { src: 'assets/wsi/consult/consult-notification.png', alt: 'Consult notification in PathPresenter' }
          ]
        },
        {
          quote: 'Everything came with it.',
          screen: "The referring report, clinical history, Swati's note and annotations, and the CD99 she already ran, all in the case",
          images: [
            { src: 'assets/wsi/consult/everything-attached-info.png', alt: 'View all information attached to the consult' },
            { src: 'assets/wsi/consult/case-info.png', alt: 'View the case information' },
            { src: 'assets/wsi/consult/case-info-with-report.png', alt: 'View case information with the report' },
            { src: 'assets/wsi/consult/case-report.png', alt: 'View the consult case report' }
          ]
        },
        {
          quote: 'We join the conference, review the slide together, and discuss what matters. All in one place.',
          screen: 'A question pinned to a region, “Any imaging? And can your lab cut two more stains?”, then Swati\'s reply opened in the case',
          images: [
            { src: 'assets/wsi/consult/internal-conference.png', alt: 'Internal conference case view' },
            { src: 'assets/wsi/consult/internal-conference-live.png', alt: 'Live internal conference view' }
          ]
        },
        {
          quote: 'I ask on the slide, pinned to the area I mean. No phone tag.',
          screen: 'A question pinned to a region, “Any imaging? And can your lab cut two more stains?”, then Swati\'s reply opened in the case',
          images: [
            { src: 'assets/wsi/consult/chat-main.png', alt: 'Open the consult chat' },
            { src: 'assets/wsi/consult/chat-single.png', alt: 'Open the consult chat with swati' },
            { src: 'assets/wsi/consult/chat-with-swati.png', alt: 'Chat with Swati about the consult' }
          ]
        },
        {
          quote: 'Two more stains, whichever lab cuts them, whichever scanner.',
          screen: 'Request ETV4 and WT1. Cut to the notification that they are scanned and attached, then open one next to the H&E',
          images: [
            { src: 'assets/wsi/consult/more-order-stain.png', alt: 'Open the stain ordering options' },
            { src: 'assets/wsi/consult/Order-stain-more.png', alt: 'Select additional stains for the consult' }
          ]
        },
        {
          quote: "The case doesn't disappear. It's one search away.",
          screen: 'The archived case with slides, both reports, the conversation and every stain together, then found again by search',
          images: [
            { src: 'assets/wsi/consult/case-report.png', alt: 'Consult case report' }
          ]
        },

        {
          quote: "The signed report goes back into Swati's Beaker case. Nothing is faxed.", chrome: "Beaker · Cincinnati Children's Hospital · PV26-001",
          screen: "The consult report in Beaker with the referring information populated. Add stains, the accepted AI result, diagnosis and comment, and show the consult CPT code. Sign out, then show it arriving in Swati's case. Keep the diagnosis line blurred",
          images: [
            { src: 'assets/wsi/consult/case-report.png', alt: 'Consult report sent back to the referring case' }
          ]
        },

      ],
    },

    discover: {
      kicker: '03 · Discover', who: 'Matthew Hanna · UPMC, Pittsburgh', chrome: 'PathPresenter Research · ADC Alliance',
      rail: ['Find similar cases', 'The ADC Alliance', 'Data from 35 sites', 'Folders, permissions', 'Searchable lists', 'Build a cohort', 'Aggregate for AI', 'Annotate', 'Build the model', 'Diagnostic model', 'Prognostic model', 'Predict our patient', 'Return and share'],
      steps: [
        {
          rail: 0, quote: 'Have we seen this before? Ask with the slide itself.', chrome: 'PathPresenter Research · ADC Alliance · Search by image', tag: 'Illustrative search concept · not live results',
          html: `<div class="v-search">
            <div class="v-query"><p class="v-label">Query · our case</p>
              <figure class="v-tile v-tile-big"><div style="background-image:url(${WSI}/field40.jpg)"><i class="v-region"></i></div><figcaption>H&amp;E region drawn on our case</figcaption></figure>
              <p class="v-note">Region selected on the slide, converted to an image embedding, compared across every permitted slide.</p></div>
            <div class="v-matches"><p class="v-label">Example matches · not study findings</p>
              <div class="v-grid">${[['07', '0.94', 'A'], ['22', '0.92', 'C'], ['03', '0.91', 'B'], ['31', '0.89', 'A'], ['14', '0.88', 'D'], ['19', '0.86', 'B']].map(([s, c, k], i) => tile(i * 6 + 3, `Site ${s} <b>${c}</b>`, `<span>Scanner ${k}</span>`)).join('')}</div></div>
            <p class="v-foot">Potential value: similar morphology linked to available records, within institutional permissions. Results shown are illustrative.</p></div>` },
        {
          rail: 1, quote: 'Variation across sites is essential. Generalization must be demonstrated, not assumed.', chrome: 'ADC Alliance · Multisite data for generalizable AI',
          html: `<div class="v-alliance">
            <svg class="v-dots" viewBox="-110 -110 220 220" aria-hidden="true">${Array.from({ length: 35 }, (_, i) => { const a = i / 35 * Math.PI * 2, r = 78 + (i % 3) * 9, c = ['#161616', '#9c423c', '#47698c', '#9a9a92'][i % 4]; return `<line x1="0" y1="0" x2="${(Math.cos(a) * r).toFixed(1)}" y2="${(Math.sin(a) * r).toFixed(1)}" stroke="rgba(22,22,22,.12)"/><circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="4.2" fill="${c}"/>`; }).join('')}<circle r="34" fill="#fafaf8" stroke="#161616" stroke-width="1.5"/><text y="-4" text-anchor="middle">ADC</text><text y="10" text-anchor="middle">Alliance</text><text y="62" text-anchor="middle" class="v-small">UPMC</text></svg>
            <div class="v-stats"><div><b>35</b>contributing institutions, each under its own data use agreement</div><div><b>1</b>governed, searchable dataset, with reports attached</div><div><b>Every</b>contributor gets the models back</div>
              <p class="v-note">Dot colour = scanner platform (illustrative)</p></div>
            <p class="v-foot">Why pool? One site teaches one scanner, one stain, one population.</p></div>` },
        {
          rail: 1, quote: 'Making AI in pathology accessible for all.', chrome: 'AI Data Commons (ADC) Alliance · What it is', foot: '03 · Discover · Step 2 of 13 · The Alliance',
          html: `<div class="v-two">
            <div><p class="v-label">The problem</p><dl class="v-list"><dt>Data</dt><dd>Limited, non-diverse data → biased models</dd><dt>Talent</dt><dd>Most sites can't build or sustain AI alone</dd><dt>Silos</dt><dd>Privacy, governance and organizational barriers</dd><dt>Cost</dt><dd>Storage, compute and vendor models</dd></dl>
              <p class="v-note">Result: poorly generalized models, slow adoption, diminished clinical impact.</p></div>
            <div><p class="v-label">The deal · data consortium plan</p><dl class="v-list"><dt>De-identified only</dt><dd>Contributed under each site's IRB; WSI plus reports, molecular, treatment, outcomes</dd><dt>Sites own their data</dt><dd>Full ownership and access retained; sites may withdraw</dd><dt>Pitt holds the data</dt><dd>HIPAA-compliant storage on PathPresenter; Pitt covers storage costs</dd><dt>CPACE builds the AI</dt><dd>Central hub for algorithm and tool development</dd><dt>Value comes back</dt><dd>Royalty-free internal-use license to new IP; co-authorship</dd><dt>Steering group</dt><dd>Reviews proposals, sets priorities, resolves disputes</dd></dl></div></div>` },
        {
          rail: 1, quote: 'Research to validation to the clinic, all under one roof.', chrome: 'ADC Alliance · Inside the UPMC ecosystem', foot: '03 · Discover · Step 2 of 13 · The Alliance',
          html: `<div class="v-eco">
            <p class="v-flowin"><b>ADC Alliance</b> multi-institutional data in →</p>
            <div class="v-boxes">
              <div><h4>CPACE</h4><p class="v-sub">Computational Pathology &amp; AI Center of Excellence</p><p class="v-role">Builds the models</p><ul><li>Opened Jan 2025</li><li>14 patents · 10 products</li><li>~30+ engineers &amp; faculty</li></ul></div>
              <div><h4>DPRC</h4><p class="v-sub">Digital Pathology Research Center</p><p class="v-role">Validates the models</p><ul><li>Inaugurated Jan 2025</li><li>Scanner &amp; tech evaluations</li><li>&gt;27 industry initiatives</li></ul></div>
              <div><h4>IAL</h4><p class="v-sub">CLIA-certified Image Analysis Lab</p><p class="v-role">Runs them clinically</p><ul><li>IHC quantification</li><li>Ki-67 and CD8 in service</li><li>Results to the LIS</li></ul></div>
            </div>
            <div class="v-base"><h4>OCP · Office of Collaborative Pathology</h4><p>The foundation underneath: agreements, project management, and IRB, legal and ethical compliance for every partner. 30+ industry-sponsored study agreements.</p></div></div>` },
        {
          rail: 2, quote: 'One case is an anecdote. I need thousands, from many institutions.',
          screen: 'Incoming data from several contributing sites: slides from different scanners with reports attached, and the de-identification and data use agreement status for each site'
        },
        {
          rail: 3, quote: 'The data is organized automatically, but the governance travels with it.',
          screen: 'Cases sorted into folders by site, project and tumor type. Show that each folder carries its own access permissions and approved data fields'
        },
        {
          rail: 4, quote: 'Free text becomes fields I can search, and I can ask for more.',
          screen: 'A source report next to its extracted fields, then the searchable list. Run an initial search, show the fields available, then a request to the contributing institution for one more field'
        },
        {
          rail: 5, quote: 'Every round cell sarcoma with a CD99 result, across 35 sites.',
          screen: 'The query across all sites, the results list, and the travelling case in the results'
        },
        {
          rail: 6, quote: 'The spread across sites and scanners is what a model needs.',
          screen: 'The cohort assembled as a dataset, with a breakdown by institution and scanner'
        },
        {
          rail: 7, quote: 'Ground truth means pathologists annotating, and every label is attributed.',
          screen: 'Annotation tools on a slide, the label set, and annotator assignments with progress'
        },
        {
          rail: 8, quote: 'Computer scientists train on the same data and the same labels.',
          screen: 'The labeled dataset handed to the training environment'
        },
        {
          rail: 9, quote: 'How a diagnostic model could learn from a governed, multicenter collection.', chrome: 'PathPresenter Research · ADC Alliance', tag: 'Research concept · H&E diagnostic model · not validated',
          html: `<div class="v-model">
            <ol class="v-pipe"><li><b>H&amp;E slide</b>Whole-slide image, any scanner</li><li><b>Tiles</b>Thousands of patches per slide</li><li><b>Foundation model</b>Each tile becomes a feature vector</li><li><b>Attention classifier</b>Weighs tiles into one slide-level call</li><li><b>Diagnosis + heatmap</b>Probability, and where it looked</li></ol>
            <div class="v-three">
              <div><p class="v-label">Ground truth</p><p>Final signed-out diagnosis, confirmed by IHC and fusion results extracted from the Alliance reports. The model never sees the IHC.</p></div>
              <div><p class="v-label">Validation · leave-site-out</p><p>Proposed validation: hold out entire institutions; report sensitivity, specificity and performance across scanners.</p></div>
              <div class="v-hypo"><p class="v-label">Hypothetical output · not a clinical result</p><p class="v-note">Illustration only</p><dl class="v-list v-out"><dt>Class A</dt><dd>—</dd><dt>Class B</dt><dd>—</dd><dt>Other classes</dt><dd>—</dd></dl></div>
            </div></div>` },
        {
          rail: 10, quote: 'Linked slide, clinical and outcome data may enable future prognosis research.', chrome: 'PathPresenter Research · ADC Alliance', tag: 'Research concept · multimodal prognosis · not validated',
          html: `<div class="v-prog">
            <div class="v-inputs"><div><b>H&amp;E features</b>Same slide encoder as the diagnostic model</div><div><b>Clinical + pathologic</b>Stage, margins, nodal status, site, age</div><div><b>Treatment received</b>Surgery, radiation, systemic therapy</div><div><b>Outcome</b>Training target: recurrence, survival, follow-up</div></div>
            <div class="v-arrow">→</div>
            <div class="v-curve"><p class="v-label">Multimodal survival model</p>
              <svg viewBox="0 0 200 120" aria-hidden="true"><path d="M20 10 V100 H190" fill="none" stroke="#161616" stroke-width="1"/><path d="M20 15 H55 V25 H90 V32 H130 V38 H185" fill="none" stroke="#161616" stroke-width="1.6"/><path d="M20 15 H40 V35 H70 V52 H100 V66 H140 V74 H185" fill="none" stroke="#9c423c" stroke-width="1.6" stroke-dasharray="4 3"/></svg>
              <p class="v-note">Schematic risk curves · not observed results</p></div>
            <p class="v-foot">Before clinical use: external-site validation, calibration and prospective evaluation would be required.</p></div>` },
        {
          rail: 11, quote: 'The opportunity: from archived cases toward responsibly validated insights.', chrome: 'PathPresenter Research · ADC Alliance', tag: 'Future research vision · not patient decision support',
          html: `<div class="v-predict">
            <figure class="v-tile v-tile-big"><div style="background-image:url(${WSI}/field40.jpg)"><i class="v-heat"></i></div><figcaption>Our case · PV26-001 · H&amp;E with attention heatmap (illustrative)</figcaption></figure>
            <div class="v-cards"><div><p class="v-label">Diagnostic model</p><p>No validated prediction shown</p></div><div><p class="v-label">Prognostic model</p><p>Not available for this patient</p></div><div><p class="v-label">Similar patients</p><p>Cohort and estimates not established</p><p class="v-note">Hypothetical curves · not clinical evidence</p></div></div>
            <p class="v-foot">Illustrative only. Observational associations do not establish treatment effects; no model here should guide this patient's care.</p></div>` },
        {
          rail: 12, quote: 'Contributors get the model back. Others get it through PathPresenter.', tag: 'Vision · shown as a still, not a live click',
          screen: 'Still: the finished model available in PathPresenter to contributing sites and to other institutions',
          notes: 'Matt, beat 13 (8:50 to 9:20). Say it as where this is going: "Here\'s what makes an alliance work. The institutions that gave the data get the model back. And through PathPresenter, an institution that never contributed can use it too, both the diagnostic and the prognostic model. Everything we learned along the way is also teaching material. That\'s Junya."'
        },
      ],
    },

    teach: {
      kicker: '04 · Teach', who: 'Junya Fukuoka · Nagasaki University', chrome: 'PathPresenter Education · Nagasaki University',
      rail: ['Share for preview', 'Pre-assessment', 'Live-slide lecture', 'High-yield set', 'Conference', 'Course'],
      steps: [

        {
          quote: 'One link, any device, nothing to install.',
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
        //   notes: 'Junya, beat 3 (1:30 to 2:05). "Before I teach, I want to know what they know. I build the question on the slide itself: here is the H&E, what is your diagnosis? This is where my learners start." The room\'s own vote 1 is the same question; point back to it.'
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
          notes: 'Junya, beat 3 (1:30 to 2:05). "Before I teach, I want to know what they know. I build the question on the slide itself: here is the H&E, what is your diagnosis? This is where my learners start." The room\'s own vote 1 is the same question; point back to it.'
        },
        {
          quote: 'I start with my PowerPoint and put the whole slide where the photo was.',
          screen: "Import an existing PowerPoint, place the case's whole slide images into the slides, then zoom inside one",
          previewImage: {
            src: 'assets/wsi/education/share-presentation.png',
            alt: 'Preview of a whole-slide viewer'
          },
          iframe: 'https://pathpresenter.net/public/presentation/display?token=bf91ed49',
          notes: 'Junya, beat 1 (0:20 to 1:00). "I start with what every teacher already has: a PowerPoint. I bring it in as it is, and where I used to paste a photo, I put the whole slide. Now the learner doesn\'t see my picture of the tumor. They see the tumor, and they can go anywhere on the slide."'
        },
        {
          quote: 'One case is a lesson. A set is a skill.',
          screen: 'A high-yield set of six small round blue cell tumors in self-study mode: Merkel cell carcinoma, small cell carcinoma, melanoma, lymphoma, DSRCT and Ewing sarcoma, each with its key stains',
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
          quote: 'One case is a lesson. A set is a skill.',
          screen: 'A high-yield set of six small round cell tumors in self-study mode: Ewing sarcoma, CIC-rearranged sarcoma, BCOR-altered sarcoma, alveolar rhabdomyosarcoma, DSRCT and lymphoblastic lymphoma, each with its key stains',
          images: [
            { src: 'assets/wsi/education/conference-dashboard.png', alt: 'Open the conference dashboard' },
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
          quote: 'I build it once and use it everywhere.',
          screen: 'The same material inside a course with modules, then a conference view with an in-room and online audience on one slide',
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
  },

  // Speaker notes for the slides that are not demo steps, by slide id.
  notes: {
    's-title': 'Raj. Welcome. One case, four institutions, one platform, and no glass shipped. Keep this under a minute.',
    's-disclosures': 'Raj, 20 seconds. Read the relationships plainly: I founded PathPresenter and sit on its board; Matt is a senior advisor; Swati, Archana and Junya have nothing to disclose. Then the four ground rules: sponsored session, and every institution on stage uses PathPresenter; every speaker is a practicing pathologist showing their own workflow; the case is de-identified; the handoffs were re-enacted on the platform for today.',
    's-question': 'Raj. Four essential roles: diagnose, consult, discover and teach. Too often, each sits in a separate system. The question is not whether we digitized the slide, but whether we connected the work around it.',
    's-case': 'Raj. Present the case: a 14-year-old, a forearm excision, a nodule growing over six months, a prior biopsy that was inconclusive. Let the H&E sit for a beat. "Every pathologist in this room has had this case on their desk." The slide on screen is a stand-in until the case\'s own H&E is added. Drag to move, scroll to zoom.',
    's-vote1': 'Raj. Open the poll and give the room 45 to 60 seconds. This vote is also the pre-assessment: we ask the same question at the end, so the room sees its own before and after. Don\'t reveal anything about the answer; it stays sealed until the second vote.',
    's-second': 'Raj, 30 seconds. A population-based study across three European regions: of 1,463 patients, the first pathologist and the expert agreed fully in 56 percent; 35 percent differed in grade or subtype; 8 percent were completely discordant, such as benign versus malignant or a different tumor type. Round cell sarcomas live in exactly this territory. That is why this case travels.',
    's-overview': 'Raj. This is the overview. Four stops, each a question a pathologist actually asks. Every speaker demos live, in the same format: what the pathologist needs, then where it lives in PathPresenter. The last click of each segment is the first screen of the next. Hand to Swati as the camera pulls back from the slide to Ohio State.',
    's-card1': 'Swati, beat 0 (0:00 to 0:20). "This is the case we\'ll follow through the whole session: a small round blue cell tumor in a 14-year-old. Every one of you has had this case on your desk. I\'m going to work it up the way I would on a normal morning. At each step I\'ll tell you what I need as the pathologist, then show you where it is." Her segment runs 5:10.',
    's-workspace': 'Swati. The whole case in one place, before the steps. The H&E tile is live: drag and scroll to move around the slide.',
    's-send1': 'Transition, about 10 seconds; Raj or silent. 159 km. The slides travel as whole-slide images in Ohio State\'s own scanner format: nothing converted, no glass shipped.',
    's-card2': 'Archana takes the clicker. Let the divider sit for a beat. Her segment runs 4:40, plus about two minutes for her consult-program slides at the end.',
    's-glass-before': 'Archana, 15 seconds. The glass consult: slides packaged, in transit, unboxed, interpreted, reported, and shipped back. Six steps, two shipments, and the patient waits through all of them.',
    's-glass-after': 'Archana, 15 seconds. The digital consult: reviewed by the first pathologist, transferred electronically, reviewed by the second, reported. Four steps, all in a day\'s work.',
    's-arrival': 'Archana, 20 seconds. Her Cincinnati Children\'s consult figures: glass by courier takes 24 hours locally and up to 72 internationally; whole-slide images arrive in 30 minutes to an hour, regardless of dock availability or working days. Confirm the figures before showing.',
    's-kg': 'Archana, 15 seconds. A consult box weighs more than a kilogram once it is packed, and it travels both ways. Whole-slide images weigh nothing, and the shipping cost goes with it.',
    's-portal': 'Archana, about 45 seconds. Her consult-portal slides, merged into one: the LIS is the ground truth, so demographics flow into PathPresenter without re-entry; the workflow is the same for internal and external cases; molecular results come back tagged to the original referred case; and the referring institution can see key studies without waiting for slides to return. Then: "That\'s where Matt picks it up."',
    's-send2': 'Transition, about 10 seconds. 414 km. The archived case enters a shared research collection; nobody ships hard drives.',
    's-card3': 'Matt, beat 0 (0:00 to 0:20), suggested words: "Archana signed it out and archived it. Now it\'s one case among thousands, and the question changes from what is this to have we seen this before." His segment runs about 9:20 without the two optional Alliance deep-dive slides, and about 10:50 with them. That is roughly twice the other segments, so decide on the deep-dives and the flex beats at the dry run.',
    's-cohort': 'Matt. The cohort, visualized: the traveling case pulls back into the collection, then the query narrows it. If the traveling case cannot be in the alliance data, say "cases like ours".',
    's-send3': 'Transition, about 10 seconds. 11,317 km across the Pacific, into a teaching collection. Still no glass shipped.',
    's-card4': 'Junya, beat 0 (0:00 to 0:20). "Matt turned one case into a dataset. I\'m going to turn it into teaching, for a resident down the hall and for a pathologist on the other side of the world, at the same time." His segment runs 4:50.',
    's-world': 'Raj. 159 plus 414 plus 11,317 km: 11,890 km in all. Four sites, three handoffs, no glass shipped. Then straight into the second vote.',
    's-vote2': 'Same question, same QR. This is the post-assessment; the room sees its own before and after.',
    's-compare': 'Fill in live from the poll. "Now we know whether we taught anything. That is evidence, not a feeling."',
    's-home': 'Every site\'s work sits on the same field, in the same case. The camera dives back to Ohio State and the 40x field.',
    's-close': 'Leave this up during the room\'s questions; the QR opens the case as a teaching module.',
  },
};
