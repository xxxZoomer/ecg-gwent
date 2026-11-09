import type { ECGRhythm } from './types'

export type ECGDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'

interface ECGWaveformContent {
  label: string
  description: string
  features: string[]
  path: string
  markers?: { label: string; x: number; y: number; labelY: number }[]
}

export interface ECGWaveform extends ECGWaveformContent {
  heartRate: string
  educationNotes: string[]
  difficulty: ECGDifficulty
}

export interface ECGLibraryEntry extends ECGWaveform {
  rhythm: ECGRhythm
}

const waveformContent: Record<ECGRhythm, ECGWaveformContent> = {
  NSR: {
    label: 'Normal Sinus Rhythm',
    description: 'Regular rhythm with visible P waves and narrow QRS complexes.',
    features: ['P wave', 'Narrow QRS', 'T wave', 'Regular RR'],
    path: 'M0 64 H20 Q28 64 32 56 Q36 48 40 64 H55 L60 69 L65 64 L70 30 L76 94 L82 64 H90 Q100 64 106 48 Q112 32 118 64 H130 Q138 64 142 56 Q146 48 150 64 H165 L170 69 L175 64 L180 30 L186 94 L192 64 H200 Q210 64 216 48 Q222 32 228 64 H240 Q248 64 252 56 Q256 48 260 64 H275 L280 69 L285 64 L290 30 L296 94 L302 64 H310 Q320 64 326 48 Q332 32 338 64 H350 Q358 64 362 56 Q366 48 370 64 H385 L390 69 L395 64 L400 30 L406 94 L412 64 H420 Q430 64 436 48 Q442 32 448 64 H460 Q468 64 472 56 Q476 48 480 64 H495 L500 69 L505 64 L510 30 L516 94 L522 64 H530 Q540 64 546 48 Q552 32 558 64 H570 Q578 64 582 56 Q586 48 590 64 H605 L610 69 L615 64 L620 30 L626 94 L632 64 H640',
    markers: [
      { label: 'P', x: 32, y: 52, labelY: 28 },
      { label: 'QRS', x: 70, y: 30, labelY: 15 },
      { label: 'T', x: 112, y: 32, labelY: 20 },
    ],
  },
  Af: {
    label: 'Atrial Fibrillation',
    description: 'Irregularly irregular rhythm without distinct P waves.',
    features: ['No distinct P waves', 'Irregularly irregular RR', 'Variable beat spacing'],
    path: 'M0 64 L8 61 L14 66 L21 62 L29 65 L36 60 L43 64 L50 62 L56 64 L61 69 L66 62 L71 27 L77 94 L83 66 L90 62 L97 65 L104 60 L111 64 L118 61 L125 66 L132 62 L139 64 L146 60 L153 65 L160 63 L165 69 L170 63 L175 31 L181 91 L187 65 L194 61 L201 66 L208 62 L215 64 L222 60 L229 65 L236 62 L241 69 L246 63 L251 25 L257 96 L263 66 L270 62 L277 65 L284 61 L291 64 L298 60 L305 66 L312 62 L319 64 L326 61 L333 65 L340 62 L347 66 L354 60 L361 64 L368 62 L375 65 L382 61 L387 69 L392 62 L397 29 L403 94 L409 66 L416 62 L423 65 L430 60 L437 64 L444 62 L451 66 L458 61 L465 64 L472 60 L479 65 L484 69 L489 62 L494 28 L500 93 L506 65 L513 61 L520 66 L527 62 L534 64 L541 60 L548 65 L555 62 L562 66 L569 61 L576 64 L583 60 L590 65 L597 62 L604 66 L611 61 L618 64 L625 60 L632 66 L640 62',
  },
  AFL: {
    label: 'Atrial Flutter',
    description: 'Sawtooth flutter waves with a regular ventricular response.',
    features: ['Sawtooth F waves', 'No isoelectric baseline', 'Regular ventricular response'],
    path: 'M0 64 L8 46 L16 64 L24 46 L32 64 L40 46 L48 64 L56 46 L64 64 L72 46 L80 64 L88 46 L96 64 L104 46 L112 64 L118 68 L122 64 L126 34 L132 94 L138 64 L144 46 L152 64 L160 46 L168 64 L176 46 L184 64 L192 46 L200 64 L208 46 L216 64 L224 46 L232 64 L238 68 L242 64 L246 34 L252 94 L258 64 L264 46 L272 64 L280 46 L288 64 L296 46 L304 64 L312 46 L320 64 L328 46 L336 64 L344 46 L352 64 L358 68 L362 64 L366 34 L372 94 L378 64 L384 46 L392 64 L400 46 L408 64 L416 46 L424 64 L432 46 L440 64 L448 46 L456 64 L464 46 L472 64 L478 68 L482 64 L486 34 L492 94 L498 64 L504 46 L512 64 L520 46 L528 64 L536 46 L544 64 L552 46 L560 64 L568 46 L576 64 L584 46 L592 64 L598 68 L602 64 L606 34 L612 94 L618 64 L624 46 L632 64 L640 46',
    markers: [{ label: 'F', x: 12, y: 46, labelY: 28 }],
  },
  PSVT: {
    label: 'Paroxysmal Supraventricular Tachycardia',
    description: 'Fast, regular narrow-complex rhythm with abrupt onset.',
    features: ['Fast regular rhythm', 'Narrow QRS complexes', 'P waves often hidden'],
    path: 'M0 64 H13 L16 61 L19 67 L22 30 L27 94 L32 64 H65 L68 61 L71 67 L74 30 L79 94 L84 64 H117 L120 61 L123 67 L126 30 L131 94 L136 64 H169 L172 61 L175 67 L178 30 L183 94 L188 64 H221 L224 61 L227 67 L230 30 L235 94 L240 64 H273 L276 61 L279 67 L282 30 L287 94 L292 64 H325 L328 61 L331 67 L334 30 L339 94 L344 64 H377 L380 61 L383 67 L386 30 L391 94 L396 64 H429 L432 61 L435 67 L438 30 L443 94 L448 64 H481 L484 61 L487 67 L490 30 L495 94 L500 64 H533 L536 61 L539 67 L542 30 L547 94 L552 64 H585 L588 61 L591 67 L594 30 L599 94 L604 64 H637',
  },
  VT: {
    label: 'Ventricular Tachycardia',
    description: 'Fast rhythm with regular, wide-complex ventricular beats.',
    features: ['Wide QRS complexes', 'Fast regular rhythm', 'Ventricular origin'],
    path: 'M0 64 H12 L18 57 L23 70 L29 82 Q34 96 40 86 L48 24 Q54 8 61 34 L70 88 Q75 104 82 90 L91 64 H92 L98 57 L103 70 L109 82 Q114 96 120 86 L128 24 Q134 8 141 34 L150 88 Q155 104 162 90 L171 64 H172 L178 57 L183 70 L189 82 Q194 96 200 86 L208 24 Q214 8 221 34 L230 88 Q235 104 242 90 L251 64 H252 L258 57 L263 70 L269 82 Q274 96 280 86 L288 24 Q294 8 301 34 L310 88 Q315 104 322 90 L331 64 H332 L338 57 L343 70 L349 82 Q354 96 360 86 L368 24 Q374 8 381 34 L390 88 Q395 104 402 90 L411 64 H412 L418 57 L423 70 L429 82 Q434 96 440 86 L448 24 Q454 8 461 34 L470 88 Q475 104 482 90 L491 64 H492 L498 57 L503 70 L509 82 Q514 96 520 86 L528 24 Q534 8 541 34 L550 88 Q555 104 562 90 L571 64 H572 L578 57 L583 70 L589 82 Q594 96 600 86 L608 24 Q614 8 621 34 L630 88 Q635 104 640 90',
  },
  VF: {
    label: 'Ventricular Fibrillation',
    description: 'Chaotic ventricular activity without organized QRS complexes.',
    features: ['Disorganized waveform', 'No organized P-QRS-T complexes', 'Variable amplitude and interval'],
    path: 'M0 65 L11 48 L18 79 L26 32 L32 67 L41 92 L47 54 L56 61 L63 18 L70 45 L78 87 L85 72 L94 39 L101 59 L108 101 L116 74 L123 81 L131 28 L138 63 L145 52 L153 12 L160 46 L168 97 L175 58 L184 35 L191 76 L199 68 L207 105 L214 83 L220 43 L228 56 L236 17 L242 70 L250 89 L258 48 L267 60 L274 30 L281 94 L289 66 L296 77 L304 20 L311 50 L319 109 L326 73 L333 42 L340 63 L348 56 L356 14 L363 40 L371 92 L378 81 L386 33 L393 69 L401 101 L408 59 L416 47 L423 85 L431 27 L438 63 L446 75 L453 10 L460 38 L468 98 L475 68 L482 53 L490 91 L497 72 L504 23 L512 56 L520 104 L527 79 L535 41 L542 66 L550 16 L557 50 L565 86 L572 64 L580 32 L587 73 L595 100 L602 59 L610 45 L618 82 L625 28 L633 67 L640 54',
  },
  PAC: {
    label: '心房期外収縮（PAC）',
    description: '予定より早い形の異なるP波に続いて、通常幅のQRSが出現します。早期拍動後に休止がみられます。',
    features: ['早期出現する異所性P波', 'QRS幅は通常', '早期拍動後の休止'],
    path: 'M0 64 H28 Q36 64 40 56 Q44 48 48 64 H58 L63 69 L68 64 L73 30 L79 94 L85 64 H98 Q106 64 110 56 Q114 48 118 64 H130 Q138 64 142 55 Q146 47 150 64 H165 Q171 64 174 58 Q178 53 182 64 L188 65 L192 74 L198 64 L204 33 L210 91 L216 64 H326 Q334 64 338 56 Q342 48 346 64 H358 L363 69 L368 64 L373 30 L379 94 L385 64 H398 Q406 64 410 56 Q414 48 418 64 H430 Q438 64 442 56 Q446 48 450 64 H465 L470 69 L475 64 L480 30 L486 94 L492 64 H505 Q513 64 517 56 Q521 48 525 64 H537 L542 69 L547 64 L552 30 L558 94 L564 64 H577 Q585 64 589 56 Q593 48 597 64 H610 L615 69 L620 64 L625 30 L631 94 L637 64 H640',
    markers: [{ label: '早期P', x: 178, y: 53, labelY: 28 }, { label: 'QRS', x: 204, y: 33, labelY: 16 }],
  },
  PVC: {
    label: '心室期外収縮（PVC）',
    description: '先行するP波を伴わない早期の幅広い異常QRSと、その後の代償性休止が特徴です。',
    features: ['早期の幅広いQRS', '先行P波なし', '代償性休止'],
    path: 'M0 64 H28 Q36 64 40 56 Q44 48 48 64 H58 L63 69 L68 64 L73 30 L79 94 L85 64 H98 Q106 64 110 56 Q114 48 118 64 H130 L136 67 L142 61 L149 53 Q156 44 164 30 Q174 14 184 29 L198 94 Q205 106 214 85 L226 64 H380 Q388 64 392 56 Q396 48 400 64 H412 L417 69 L422 64 L427 30 L433 94 L439 64 H452 Q460 64 464 56 Q468 48 472 64 H484 L490 67 L496 62 L503 52 Q511 42 519 27 Q529 11 539 29 L553 95 Q560 105 569 84 L581 64 H640',
    markers: [{ label: '幅広いQRS', x: 184, y: 29, labelY: 13 }, { label: '休止', x: 300, y: 64, labelY: 48 }],
  },
  MobitzI: {
    label: '第2度房室ブロック（Mobitz I）',
    description: 'P波は規則的で、伝導するごとにPR間隔が延長し、最後にQRSが脱落します（Wenckebach周期）。',
    features: ['PR間隔が徐々に延長', 'QRS脱落', 'P-P間隔は一定'],
    path: 'M0 64 H18 Q24 64 28 56 Q32 48 36 64 H62 L67 69 L72 64 L77 30 L83 94 L89 64 H112 Q118 64 122 56 Q126 48 130 64 H166 L171 69 L176 64 L181 30 L187 94 L193 64 H206 Q212 64 216 56 Q220 48 224 64 H270 L275 69 L280 64 L285 30 L291 94 L297 64 H300 Q306 64 310 56 Q314 48 318 64 H400 Q406 64 410 56 Q414 48 418 64 H444 L449 69 L454 64 L459 30 L465 94 L471 64 H494 Q500 64 504 56 Q508 48 512 64 H548 L553 69 L558 64 L563 30 L569 94 L575 64 H588 Q594 64 598 56 Q602 48 606 64 H640',
    markers: [{ label: 'PR延長', x: 244, y: 64, labelY: 46 }, { label: 'QRS脱落', x: 360, y: 64, labelY: 46 }],
  },
  MobitzII: {
    label: '第2度房室ブロック（Mobitz II）',
    description: 'PR間隔は一定のまま、予告なくP波に続くQRSが脱落します。',
    features: ['PR間隔は一定', '突然のQRS脱落', 'P-P間隔は一定'],
    path: 'M0 64 H18 Q24 64 28 56 Q32 48 36 64 H62 L67 69 L72 64 L77 30 L83 94 L89 64 H112 Q118 64 122 56 Q126 48 130 64 H156 L161 69 L166 64 L171 30 L177 94 L183 64 H206 Q212 64 216 56 Q220 48 224 64 H300 Q306 64 310 56 Q314 48 318 64 H344 L349 69 L354 64 L359 30 L365 94 L371 64 H394 Q400 64 404 56 Q408 48 412 64 H438 L443 69 L448 64 L453 30 L459 94 L465 64 H488 Q494 64 498 56 Q502 48 506 64 H580 Q586 64 590 56 Q594 48 598 64 H640',
    markers: [{ label: '一定のPR', x: 148, y: 56, labelY: 37 }, { label: 'QRS脱落', x: 260, y: 64, labelY: 46 }],
  },
  CompleteAVBlock: {
    label: '完全房室ブロック',
    description: 'P波とQRSがそれぞれ規則的に出現しますが、心房と心室の電気活動は解離しています。',
    features: ['P波とQRSが独立', '房室解離', '心室補充調律'],
    path: 'M0 64 H12 Q18 64 22 56 Q26 48 30 64 H48 L53 69 L58 64 L63 30 L69 94 L75 64 H82 Q88 64 92 56 Q96 48 100 64 H168 Q174 64 178 56 Q182 48 186 64 H204 L209 69 L214 64 L219 30 L225 94 L231 64 H238 Q244 64 248 56 Q252 48 256 64 H324 Q330 64 334 56 Q338 48 342 64 H360 L365 69 L370 64 L375 30 L381 94 L387 64 H394 Q400 64 404 56 Q408 48 412 64 H480 Q486 64 490 56 Q494 48 498 64 H516 L521 69 L526 64 L531 30 L537 94 L543 64 H550 Q556 64 560 56 Q564 48 568 64 H640',
    markers: [{ label: 'P', x: 26, y: 48, labelY: 30 }, { label: 'QRS', x: 63, y: 30, labelY: 14 }, { label: '房室解離', x: 430, y: 64, labelY: 46 }],
  },
  RBBB: {
    label: '右脚ブロック（RBBB）',
    description: 'QRSが幅広く、V1誘導でrsR′（二峰性R波）、I・V6誘導で幅広い終末S波が典型です。',
    features: ['QRS幅 120 ms以上', 'V1：rsR′型', 'I・V6：幅広いS波'],
    path: 'M0 64 H25 Q32 64 36 56 Q40 48 44 64 H58 L64 69 L70 64 L76 45 L82 64 L88 24 L96 37 L104 92 L112 70 L120 64 H132 Q140 64 144 54 Q148 44 152 64 H166 L172 69 L178 64 L184 45 L190 64 L196 24 L204 37 L212 92 L220 70 L228 64 H240 Q248 64 252 54 Q256 44 260 64 H274 L280 69 L286 64 L292 45 L298 64 L304 24 L312 37 L320 92 L328 70 L336 64 H348 Q356 64 360 54 Q364 44 368 64 H382 L388 69 L394 64 L400 45 L406 64 L412 24 L420 37 L428 92 L436 70 L444 64 H456 Q464 64 468 54 Q472 44 476 64 H490 L496 69 L502 64 L508 45 L514 64 L520 24 L528 37 L536 92 L544 70 L552 64 H564 Q572 64 576 54 Q580 44 584 64 H598 L604 69 L610 64 L616 45 L622 64 L628 24 L636 37 L640 84',
    markers: [{ label: 'rsR′（V1）', x: 196, y: 24, labelY: 12 }, { label: '幅広いQRS', x: 212, y: 92, labelY: 108 }],
  },
  LBBB: {
    label: '左脚ブロック（LBBB）',
    description: 'QRSが幅広く、I・V6誘導で幅広い／ノッチ状R波、V1誘導で深いS波が典型です。',
    features: ['QRS幅 120 ms以上', 'I・V6：幅広いR波', 'V1：深いS波'],
    path: 'M0 64 H24 Q32 64 36 56 Q40 48 44 64 H58 L64 69 L70 64 L78 81 Q86 98 94 87 L104 25 Q112 14 120 25 L128 17 Q138 12 146 25 L158 64 H170 Q178 64 182 54 Q186 44 190 64 H204 L210 69 L216 64 L224 81 Q232 98 240 87 L250 25 Q258 14 266 25 L274 17 Q284 12 292 25 L304 64 H316 Q324 64 328 54 Q332 44 336 64 H350 L356 69 L362 64 L370 81 Q378 98 386 87 L396 25 Q404 14 412 25 L420 17 Q430 12 438 25 L450 64 H462 Q470 64 474 54 Q478 44 482 64 H496 L502 69 L508 64 L516 81 Q524 98 532 87 L542 25 Q550 14 558 25 L566 17 Q576 12 584 25 L596 64 H608 Q616 64 620 54 Q624 44 628 64 H640',
    markers: [{ label: '幅広いR波', x: 116, y: 19, labelY: 8 }, { label: '深いS波（V1）', x: 94, y: 87, labelY: 107 }],
  },
  STEMI: {
    label: 'ST上昇型心筋梗塞（STEMI）',
    description: '基線から持ち上がったST部分と、テント状のT波を示す模式図です。実際の診断は誘導・隣接誘導の基準で行います。',
    features: ['ST上昇', 'テント状T波', '隣接誘導での変化を確認'],
    path: 'M0 64 H24 Q32 64 36 56 Q40 48 44 64 H58 L63 69 L68 64 L73 30 L79 94 L85 64 H94 L100 54 H112 Q116 54 120 42 Q124 30 128 42 Q132 54 140 54 H156 Q164 64 168 56 Q172 48 176 64 H190 L195 69 L200 64 L205 30 L211 94 L217 64 H226 L232 54 H244 Q248 54 252 42 Q256 30 260 42 Q264 54 272 54 H288 Q296 64 300 56 Q304 48 308 64 H316 L322 54 H334 Q338 54 342 42 Q346 30 350 42 Q354 54 362 54 H378 Q386 64 390 56 Q394 48 398 64 H412 L418 54 H430 Q434 54 438 42 Q442 30 446 42 Q450 54 458 54 H474 Q482 64 486 56 Q490 48 494 64 H502 L508 54 H520 Q524 54 528 42 Q532 30 536 42 Q540 54 548 54 H564 Q572 64 576 56 Q580 48 584 64 H598 L604 54 H616 Q620 54 624 42 Q628 30 632 42 Q636 54 640 54',
    markers: [{ label: 'ST上昇', x: 110, y: 64, labelY: 49 }, { label: 'T波', x: 128, y: 30, labelY: 15 }],
  },
  Hyperkalemia: {
    label: '高カリウム血症',
    description: '尖鋭化した高いT波と、P波の平低化を示す模式図です。進行例ではPR延長やQRS幅の増大もみられます。',
    features: ['尖鋭T波（テント状）', 'P波平低化', '進行時：PR延長・QRS幅増大'],
    path: 'M0 64 H34 Q40 64 44 61 Q48 58 52 64 H62 L67 68 L72 64 L78 39 L84 88 L90 64 H102 Q108 64 112 61 Q116 58 120 64 H136 Q142 64 146 48 Q150 32 154 48 Q158 64 164 64 H178 L183 68 L188 64 L194 39 L200 88 L206 64 H218 Q224 64 228 61 Q232 58 236 64 H252 Q258 64 262 45 Q266 26 270 45 Q274 64 280 64 H294 L299 68 L304 64 L310 39 L316 88 L322 64 H334 Q340 64 344 61 Q348 58 352 64 H368 Q374 64 378 48 Q382 32 386 48 Q390 64 396 64 H410 L415 68 L420 64 L426 39 L432 88 L438 64 H450 Q456 64 460 61 Q464 58 468 64 H484 Q490 64 494 45 Q498 26 502 45 Q506 64 512 64 H526 L531 68 L536 64 L542 39 L548 88 L554 64 H566 Q572 64 576 61 Q580 58 584 64 H600 Q606 64 610 48 Q614 32 618 48 Q622 64 628 64 H640',
    markers: [{ label: '尖鋭T波', x: 270, y: 26, labelY: 12 }, { label: 'P波平低化', x: 232, y: 58, labelY: 42 }],
  },
  Hypokalemia: {
    label: '低カリウム血症',
    description: 'T波平低化、ST低下、T波後に続くU波が特徴です。',
    features: ['T波平低化', 'ST低下', 'U波（T波の後）'],
    path: 'M0 64 H24 Q32 64 36 56 Q40 48 44 64 H58 L63 69 L68 64 L73 30 L79 94 L85 64 H94 L100 69 H108 Q116 69 120 65 Q124 61 128 69 H132 Q138 69 142 60 Q146 52 150 60 Q154 69 160 64 H170 Q178 64 182 56 Q186 48 190 64 H204 L209 69 L214 64 L219 30 L225 94 L231 64 H240 L246 69 H254 Q262 69 266 65 Q270 61 274 69 H278 Q284 69 288 60 Q292 52 296 60 Q300 69 306 64 H316 Q324 64 328 56 Q332 48 336 64 H350 L355 69 L360 64 L365 30 L371 94 L377 64 H386 L392 69 H400 Q408 69 412 65 Q416 61 420 69 H424 Q430 69 434 60 Q438 52 442 60 Q446 69 452 64 H462 Q470 64 474 56 Q478 48 482 64 H496 L501 69 L506 64 L511 30 L517 94 L523 64 H532 L538 69 H546 Q554 69 558 65 Q562 61 566 69 H570 Q576 69 580 60 Q584 52 588 60 Q592 69 598 64 H608 Q616 64 620 56 Q624 48 628 64 H640',
    markers: [{ label: 'ST低下', x: 104, y: 69, labelY: 51 }, { label: 'U波', x: 146, y: 52, labelY: 36 }],
  },
}

const educationData: Record<ECGRhythm, Pick<ECGWaveform, 'heartRate' | 'educationNotes' | 'difficulty'>> = {
  NSR: {
    heartRate: '60–100 bpm',
    educationNotes: ['P波の後にQRSが続く', 'RR間隔は規則的', 'PR間隔は一定'],
    difficulty: 'Beginner',
  },
  Af: {
    heartRate: '不規則（心室応答による）',
    educationNotes: ['P波消失', 'RR不整（絶対性不整脈）', '細動波を認めることがある'],
    difficulty: 'Beginner',
  },
  AFL: {
    heartRate: '2:1伝導では約150 bpm',
    educationNotes: ['鋸歯状F波', '2:1伝導では心拍数約150 bpm', '房室伝導比により心室レートが変化'],
    difficulty: 'Intermediate',
  },
  PSVT: {
    heartRate: '通常150–250 bpm',
    educationNotes: ['規則正しい狭QRS頻拍', 'P波がQRSに埋もれることがある', '突然発症・停止が特徴'],
    difficulty: 'Intermediate',
  },
  VT: {
    heartRate: '通常100 bpm超（多くは120–250 bpm）',
    educationNotes: ['Wide QRS頻拍', '規則正しいことが多い', 'AV解離を伴うことがある'],
    difficulty: 'Intermediate',
  },
  VF: {
    heartRate: '測定不能（有効な心拍なし）',
    educationNotes: ['組織化されたQRSを認めない', '脈拍を生じない致死的不整脈', '心拍数は測定できない'],
    difficulty: 'Beginner',
  },
  PAC: {
    heartRate: '基礎調律による（期外収縮で一時的に変化）',
    educationNotes: ['予定より早い異所性P波', 'QRSは通常幅', '非代償性休止を伴うことがある'],
    difficulty: 'Beginner',
  },
  PVC: {
    heartRate: '基礎調律による（期外収縮で一時的に変化）',
    educationNotes: ['早期に幅広いQRSが出現', '先行P波を伴わない', '代償性休止を伴うことがある'],
    difficulty: 'Beginner',
  },
  MobitzI: {
    heartRate: '心室応答による（伝導比で変化）',
    educationNotes: ['PR間隔が徐々に延長', 'その後QRSが脱落', 'Wenckebach周期を形成'],
    difficulty: 'Intermediate',
  },
  MobitzII: {
    heartRate: '心室応答による（伝導比で変化）',
    educationNotes: ['PR間隔は一定', '予告なくQRSが脱落', '高度房室ブロックへ進行することがある'],
    difficulty: 'Advanced',
  },
  CompleteAVBlock: {
    heartRate: '心室補充調律による（多くは20–40 bpm）',
    educationNotes: ['P波とQRSが独立して出現', '房室解離', '心室補充調律は通常遅い'],
    difficulty: 'Advanced',
  },
  RBBB: {
    heartRate: '基礎調律による（洞調律なら通常60–100 bpm）',
    educationNotes: ['QRS幅は通常120 ms以上', 'V1でrsR′型', 'I・V6で幅広い終末S波'],
    difficulty: 'Intermediate',
  },
  LBBB: {
    heartRate: '基礎調律による（洞調律なら通常60–100 bpm）',
    educationNotes: ['QRS幅は通常120 ms以上', 'I・V6で幅広い／ノッチ状R波', 'V1で深いS波'],
    difficulty: 'Intermediate',
  },
  STEMI: {
    heartRate: '一定しない（臨床状況による）',
    educationNotes: ['隣接誘導でのST上昇を確認', '誘導ごとの基準値を適用', '対側誘導のST低下を伴うことがある'],
    difficulty: 'Advanced',
  },
  Hyperkalemia: {
    heartRate: '一定しない（重症度・臨床状況による）',
    educationNotes: ['尖鋭化したテント状T波', 'P波平低化・消失やPR延長', '進行するとQRS幅が増大'],
    difficulty: 'Advanced',
  },
  Hypokalemia: {
    heartRate: '一定しない（重症度・臨床状況による）',
    educationNotes: ['T波平低化', 'ST低下', 'T波の後にU波が出現'],
    difficulty: 'Advanced',
  },
}

export const ecgRhythms: ECGRhythm[] = [
  'NSR', 'Af', 'AFL', 'PSVT', 'VT', 'VF',
  'PAC', 'PVC', 'MobitzI', 'MobitzII', 'CompleteAVBlock',
  'RBBB', 'LBBB', 'STEMI', 'Hyperkalemia', 'Hypokalemia',
]

export const ecgData: Record<ECGRhythm, ECGWaveform> = {
  NSR: { ...waveformContent.NSR, ...educationData.NSR },
  Af: { ...waveformContent.Af, ...educationData.Af },
  AFL: { ...waveformContent.AFL, ...educationData.AFL },
  PSVT: { ...waveformContent.PSVT, ...educationData.PSVT },
  VT: { ...waveformContent.VT, ...educationData.VT },
  VF: { ...waveformContent.VF, ...educationData.VF },
  PAC: { ...waveformContent.PAC, ...educationData.PAC },
  PVC: { ...waveformContent.PVC, ...educationData.PVC },
  MobitzI: { ...waveformContent.MobitzI, ...educationData.MobitzI },
  MobitzII: { ...waveformContent.MobitzII, ...educationData.MobitzII },
  CompleteAVBlock: { ...waveformContent.CompleteAVBlock, ...educationData.CompleteAVBlock },
  RBBB: { ...waveformContent.RBBB, ...educationData.RBBB },
  LBBB: { ...waveformContent.LBBB, ...educationData.LBBB },
  STEMI: { ...waveformContent.STEMI, ...educationData.STEMI },
  Hyperkalemia: { ...waveformContent.Hyperkalemia, ...educationData.Hyperkalemia },
  Hypokalemia: { ...waveformContent.Hypokalemia, ...educationData.Hypokalemia },
}

export const ecgLibrary: ECGLibraryEntry[] = ecgRhythms.map((rhythm) => ({
  rhythm,
  ...ecgData[rhythm],
}))
