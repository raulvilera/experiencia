/**
 * Atividade de Ciências — Equipamentos Meteorológicos
 *
 * Este projeto recebe o JSON enviado pela atividade HTML, grava uma linha por aluno,
 * cria uma visão detalhada por questão, aplica cores de correção e monta um painel
 * com tabelas e gráficos.
 *
 * Antes de publicar, substitua SPREADSHEET_ID pelo ID da sua planilha.
 */

const CONFIG = {
  VERSION: '20260906-doughnuts-v1',
  SPREADSHEET_ID: '1VpvIvxX8-ubP89gEPlwfMBXOAo-5op2OpvjXRTP1VqU',
  RESPONSE_SHEETS: {
    '8º Ano A': 'Respostas — 8º Ano A',
    '8º Ano B': 'Respostas — 8º Ano B'
  },
  ASSESSMENT_SHEETS: {
    '8º Ano A': 'Avaliação — 8º Ano A',
    '8º Ano B': 'Avaliação — 8º Ano B'
  },
  SKILLS_SHEET: 'Habilidades',
  DASHBOARD_SHEET: 'Painel',
  objectiveQuestions: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
  allQuestions: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10'],
  answerKey: {
    Q1: 'b',
    Q2: 'c',
    Q3: 'b',
    Q4: 'c',
    Q5: 'a'
  },
  skills: {
    Q1: 'Interpretar dados meteorológicos para tomar decisões relacionadas ao tempo.',
    Q2: 'Relacionar instrumentos meteorológicos às variáveis que eles medem.',
    Q3: 'Analisar relações entre pressão atmosférica, umidade e mudanças no tempo.',
    Q4: 'Diferenciar velocidade e direção do vento e reconhecer seus instrumentos.',
    Q5: 'Interpretar precipitação, milímetros de chuva e volume de água por área.',
    Q6: 'Avaliar condições de instalação e qualidade das medições de uma estação.',
    Q7: 'Analisar um conjunto de variáveis para inferir mudanças nas condições do tempo.',
    Q8: 'Relacionar previsão meteorológica, riscos e tomada de decisão segura.',
    Q9: 'Interpretar umidade relativa do ar e possíveis efeitos para pessoas e ambiente.',
    Q10: 'Compreender como dados meteorológicos são integrados na previsão do tempo.'
  }
};

const COLORS = {
  blue: '#cfe2ff',
  blueText: '#1155cc',
  red: '#f4cccc',
  redText: '#990000',
  yellow: '#fff2cc',
  yellowText: '#7f6000',
  orange: '#fce5cd',
  header: '#17324d',
  white: '#ffffff',
  grid: '#d9e2ec'
};

function doGet() {
  return jsonResponse_({ ok: true, service: 'atividade-ciencias-appscript', version: CONFIG.VERSION });
}

function doPost(event) {
  try {
    const payload = parsePayload_(event);
    const result = appendSubmission_(payload);
    return jsonResponse_(result);
  } catch (error) {
    console.error(error.stack || error);
    return jsonResponse_({ ok: false, error: String(error.message || error) });
  }
}

/** Execute uma vez manualmente antes da primeira publicação. */
function setup() {
  const spreadsheet = getSpreadsheet_();
  const skillsSheet = getOrCreateSheet_(spreadsheet, CONFIG.SKILLS_SHEET);
  getOrCreateSheet_(spreadsheet, CONFIG.DASHBOARD_SHEET);

  Object.keys(CONFIG.RESPONSE_SHEETS).forEach((className) => {
    ensureHeaders_(getOrCreateSheet_(spreadsheet, CONFIG.RESPONSE_SHEETS[className]), responseHeaders_());
    ensureHeaders_(getOrCreateSheet_(spreadsheet, CONFIG.ASSESSMENT_SHEETS[className]), assessmentHeaders_());
  });
  writeSkillsSheet_(skillsSheet);
  Object.keys(CONFIG.RESPONSE_SHEETS).forEach((className) => {
    applyResponseFormatting_(spreadsheet.getSheetByName(CONFIG.RESPONSE_SHEETS[className]));
    applyAssessmentFormatting_(spreadsheet.getSheetByName(CONFIG.ASSESSMENT_SHEETS[className]));
  });
  rebuildDashboard_();

  return `Configuração concluída na planilha: ${spreadsheet.getName()}`;
}

function parsePayload_(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error('O corpo da requisição está vazio.');
  }

  const payload = JSON.parse(event.postData.contents);
  if (!payload.studentName) {
    throw new Error('O nome do estudante é obrigatório.');
  }

  const normalized = {
    submissionId: clean_(payload.submissionId) || Utilities.getUuid(),
    submittedAt: clean_(payload.submittedAt) || new Date().toISOString(),
    activity: clean_(payload.activity) || 'Equipamentos meteorológicos — Ciências 8º ano',
    className: clean_(payload.className),
    studentName: clean_(payload.studentName),
    callNumber: clean_(payload.callNumber),
    institutionalEmail: clean_(payload.institutionalEmail),
    raNumber: clean_(payload.raNumber),
    raDigit: clean_(payload.raDigit),
    activityDate: clean_(payload.activityDate)
  };

  if (!CONFIG.RESPONSE_SHEETS[normalized.className]) {
    throw new Error('Turma inválida ou não informada.');
  }

  CONFIG.allQuestions.forEach((question) => {
    normalized[question] = clean_(payload[question] ?? payload[question.toLowerCase()]);
  });
  return normalized;
}

function appendSubmission_(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const spreadsheet = getSpreadsheet_();
    const responseSheet = getOrCreateSheet_(spreadsheet, CONFIG.RESPONSE_SHEETS[payload.className]);
    const assessmentSheet = getOrCreateSheet_(spreadsheet, CONFIG.ASSESSMENT_SHEETS[payload.className]);
    ensureHeaders_(responseSheet, responseHeaders_());
    ensureHeaders_(assessmentSheet, assessmentHeaders_());

    const existingIds = responseSheet.getLastRow() > 1
      ? responseSheet.getRange(2, 2, responseSheet.getLastRow() - 1, 1).getValues().flat()
      : [];
    if (existingIds.indexOf(payload.submissionId) !== -1) {
      return { ok: true, duplicate: true, submissionId: payload.submissionId };
    }

    const receivedAt = new Date();
    const responseRow = [
      receivedAt,
      payload.submissionId,
      payload.activity,
      payload.className,
      payload.studentName,
      payload.callNumber,
      payload.institutionalEmail,
      payload.raNumber,
      payload.raDigit,
      payload.activityDate,
      payload.Q1,
      payload.Q2,
      payload.Q3,
      payload.Q4,
      payload.Q5,
      payload.Q6,
      payload.Q7,
      payload.Q8,
      payload.Q9,
      payload.Q10,
      objectiveScore_(payload),
      CONFIG.objectiveQuestions.length,
      objectivePercentage_(payload),
      '',
      objectiveScore_(payload),
      '',
      'Aguardando correção das dissertativas',
      ''
    ];
    responseSheet.appendRow(responseRow);

    const assessmentRows = CONFIG.allQuestions.map((question) => {
      const objective = CONFIG.objectiveQuestions.indexOf(question) !== -1;
      const answer = payload[question];
      return [
        payload.submissionId,
        receivedAt,
        payload.className,
        payload.studentName,
        payload.callNumber,
        question,
        objective ? 'Múltipla escolha' : 'Dissertativa',
        answer,
        objective ? CONFIG.answerKey[question] : '',
        CONFIG.skills[question],
        objective ? (answer === CONFIG.answerKey[question] ? 'Correta' : answer ? 'Incorreta' : 'Pendente') : 'Pendente',
        objective ? (answer === CONFIG.answerKey[question] ? 1 : 0) : '',
        ''
      ];
    });
    assessmentSheet.getRange(assessmentSheet.getLastRow() + 1, 1, assessmentRows.length, assessmentRows[0].length).setValues(assessmentRows);

    applyResponseFormatting_(responseSheet);
    applyAssessmentFormatting_(assessmentSheet);
    rebuildDashboard_();

    return {
      ok: true,
      duplicate: false,
      submissionId: payload.submissionId,
      objectiveScore: objectiveScore_(payload),
      objectiveTotal: CONFIG.objectiveQuestions.length
    };
  } finally {
    lock.releaseLock();
  }
}

function responseHeaders_() {
  return [
    'Recebido em', 'ID do envio', 'Atividade', 'Turma', 'Nome', 'Nº de chamada',
    'E-mail institucional', 'RA', 'Dígito do RA', 'Data da atividade',
    'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10',
    'Acertos objetivas', 'Total objetivas', 'Percentual objetivas',
    'Correção dissertativas', 'Nota objetiva (0–5)', 'Nota total (0–10)',
    'Status da nota', 'Observações'
  ];
}

function assessmentHeaders_() {
  return [
    'ID do envio', 'Recebido em', 'Turma', 'Nome', 'Nº de chamada', 'Questão',
    'Tipo', 'Resposta do aluno', 'Gabarito', 'Aprendizagem essencial',
    'Status', 'Pontos', 'Observações do professor'
  ];
}

function writeSkillsSheet_(sheet) {
  const headers = ['Questão', 'Tipo', 'Aprendizagem essencial / habilidade trabalhada', 'Resposta esperada objetiva'];
  const rows = CONFIG.allQuestions.map((question) => [
    question,
    CONFIG.objectiveQuestions.indexOf(question) !== -1 ? 'Múltipla escolha' : 'Dissertativa',
    CONFIG.skills[question],
    CONFIG.answerKey[question] || 'Correção por rubrica do professor'
  ]);
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  formatHeader_(sheet.getRange(1, 1, 1, headers.length));
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
  sheet.setColumnWidth(3, 520);
}

function applyResponseFormatting_(sheet) {
  const headers = responseHeaders_();
  ensureHeaders_(sheet, headers);
  const lastRow = Math.max(sheet.getMaxRows(), 2);
  sheet.setFrozenRows(1);
  formatHeader_(sheet.getRange(1, 1, 1, headers.length));
  sheet.getRange(1, 1, lastRow, headers.length).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.getRange(2, 1, Math.max(lastRow - 1, 1), 1).setNumberFormat('dd/mm/yyyy hh:mm');
  sheet.getRange(2, 23, Math.max(lastRow - 1, 1), 1).setNumberFormat('0.0%');
  sheet.getRange(2, 25, Math.max(lastRow - 1, 1), 2).setNumberFormat('0.0');

  const rules = sheet.getConditionalFormatRules().filter((rule) => {
    return !rule.getRanges().some((range) => range.getSheet().getSheetId() === sheet.getSheetId());
  });
  CONFIG.objectiveQuestions.forEach((question, index) => {
    const column = 11 + index;
    const letter = columnToLetter_(column);
    const key = CONFIG.answerKey[question];
    const range = sheet.getRange(2, column, Math.max(lastRow - 1, 1), 1);
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=AND(${letter}2<>"";${letter}2="${key}")`)
      .setBackground(COLORS.blue)
      .setFontColor(COLORS.blueText)
      .setRanges([range])
      .build());
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=AND(${letter}2<>"";${letter}2<>"${key}")`)
      .setBackground(COLORS.red)
      .setFontColor(COLORS.redText)
      .setRanges([range])
      .build());
  });
  sheet.setConditionalFormatRules(rules);
}

function applyAssessmentFormatting_(sheet) {
  const headers = assessmentHeaders_();
  ensureHeaders_(sheet, headers);
  const lastRow = Math.max(sheet.getMaxRows(), 2);
  sheet.setFrozenRows(1);
  formatHeader_(sheet.getRange(1, 1, 1, headers.length));
  sheet.getRange(1, 1, lastRow, headers.length).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.setColumnWidth(8, 360);
  sheet.setColumnWidth(10, 460);
  sheet.setColumnWidth(13, 300);

  const statusRange = sheet.getRange(2, 11, Math.max(lastRow - 1, 1), 1);
  const validation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Correta', 'Parcial', 'Incorreta', 'Pendente'], true)
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(validation);

  const rules = sheet.getConditionalFormatRules().filter((rule) => {
    return !rule.getRanges().some((range) => range.getSheet().getSheetId() === sheet.getSheetId());
  });
  rules.push(statusRule_(statusRange, 'Correta', COLORS.blue, COLORS.blueText));
  rules.push(statusRule_(statusRange, 'Incorreta', COLORS.red, COLORS.redText));
  rules.push(statusRule_(statusRange, 'Pendente', COLORS.yellow, COLORS.yellowText));
  rules.push(statusRule_(statusRange, 'Parcial', COLORS.orange, '#b45f06'));
  sheet.setConditionalFormatRules(rules);
}

function statusRule_(range, status, background, fontColor) {
  return SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(status)
    .setBackground(background)
    .setFontColor(fontColor)
    .setRanges([range])
    .build();
}

function assessmentCountFormula_(questionColumn, questionCell, statusColumn, status) {
  return '=' + Object.values(CONFIG.ASSESSMENT_SHEETS).map((sheetName) =>
    `COUNTIFS('${sheetName}'!$${questionColumn}:$${questionColumn};${questionCell};'${sheetName}'!$${statusColumn}:$${statusColumn};"${status}")`
  ).join('+');
}

function responseSheetFormula_(expression) {
  return Object.values(CONFIG.RESPONSE_SHEETS).map((sheetName) => expression(sheetName)).join('+');
}

function rebuildDashboard_() {
  const spreadsheet = getSpreadsheet_();
  const sheet = getOrCreateSheet_(spreadsheet, CONFIG.DASHBOARD_SHEET);
  sheet.clear();
  sheet.getCharts().forEach((chart) => sheet.removeChart(chart));

  sheet.getRange('A1').setValue('Painel de acompanhamento — Ciências 8º ano');
  sheet.getRange('A2').setValue('Tema: equipamentos meteorológicos, clima, tempo e interpretação de dados.');
  sheet.getRange('A3').setValue('Leitura pedagógica para acompanhamento formativo; a aba Habilidades registra o alinhamento didático.');
  sheet.getRange('A1:G1').merge().setFontSize(16).setFontWeight('bold').setFontColor(COLORS.white).setBackground(COLORS.header);
  sheet.getRange('A2:G3').mergeAcross().setWrap(true);

  const summaryHeaders = ['Questão', 'Aprendizagem essencial', 'Corretas', 'Parciais', 'Incorretas', 'Pendentes', 'Domínio'];
  sheet.getRange(6, 1, 1, summaryHeaders.length).setValues([summaryHeaders]);
  formatHeader_(sheet.getRange(6, 1, 1, summaryHeaders.length));

  const summaryRows = CONFIG.allQuestions.map((question) => [question, CONFIG.skills[question], '', '', '', '', '']);
  sheet.getRange(7, 1, summaryRows.length, summaryHeaders.length).setValues(summaryRows);
  for (let i = 0; i < CONFIG.allQuestions.length; i += 1) {
    const row = 7 + i;
    sheet.getRange(row, 3, 1, 5).setFormulas([[
      assessmentCountFormula_('F', `$A${row}`, 'K', 'Correta'),
      assessmentCountFormula_('F', `$A${row}`, 'K', 'Parcial'),
      assessmentCountFormula_('F', `$A${row}`, 'K', 'Incorreta'),
      assessmentCountFormula_('F', `$A${row}`, 'K', 'Pendente'),
      `=IFERROR(C${row}/(C${row}+D${row}+E${row});0)`
    ]]);
  }
  sheet.getRange(7, 7, summaryRows.length, 1).setNumberFormat('0%');

  const skillStart = 20;
  const skillHeaders = ['Aprendizagem essencial', 'Corretas', 'Parciais', 'Incorretas', 'Pendentes', 'Domínio'];
  sheet.getRange(skillStart, 1, 1, skillHeaders.length).setValues([skillHeaders]);
  formatHeader_(sheet.getRange(skillStart, 1, 1, skillHeaders.length));
  const skillRows = CONFIG.allQuestions.map((question) => [CONFIG.skills[question], '', '', '', '', '']);
  sheet.getRange(skillStart + 1, 1, skillRows.length, skillHeaders.length).setValues(skillRows);
  for (let i = 0; i < CONFIG.allQuestions.length; i += 1) {
    const row = skillStart + 1 + i;
    sheet.getRange(row, 2, 1, 5).setFormulas([[
      assessmentCountFormula_('J', `$A${row}`, 'K', 'Correta'),
      assessmentCountFormula_('J', `$A${row}`, 'K', 'Parcial'),
      assessmentCountFormula_('J', `$A${row}`, 'K', 'Incorreta'),
      assessmentCountFormula_('J', `$A${row}`, 'K', 'Pendente'),
      `=IFERROR(B${row}/(B${row}+C${row}+D${row});0)`
    ]]);
  }
  sheet.getRange(skillStart + 1, 6, skillRows.length, 1).setNumberFormat('0%');

  sheet.getRange('I6:J6').setValues([['Questão', 'Domínio']]);
  sheet.getRange('I7:I16').setValues(CONFIG.allQuestions.map((question) => [question]));
  sheet.getRange('J7:J16').setFormulas(CONFIG.allQuestions.map((question, index) => [`=G${7 + index}`]));
  sheet.getRange('J7:J16').setNumberFormat('0%');
  sheet.getRange('L6:M6').setValues([['Indicador', 'Valor']]);
  sheet.getRange('L7:M9').setValues([
    ['Envios recebidos', ''],
    ['Média objetiva', ''],
    ['Questões com domínio ≥ 70%', '']
  ]);
  sheet.getRange('M7').setFormula(responseSheetFormula_((sheetName) => `COUNTA('${sheetName}'!$B$2:$B)`));
  sheet.getRange('M8').setFormula(`=IFERROR((${Object.values(CONFIG.RESPONSE_SHEETS).map((sheetName) => `SUM('${sheetName}'!$W$2:$W)`).join('+')})/M7;0)`).setNumberFormat('0%');
  sheet.getRange('M9').setFormula('=COUNTIF(G7:G16;">=70%")');

  const questionChart = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange('I6:J16'))
    .setOption('title', 'Domínio por questão')
    .setOption('vAxis', { title: 'Percentual', format: '0%' })
    .setOption('legend', { position: 'none' })
    .setOption('height', 320)
    .setOption('width', 620)
    .setPosition(12, 9, 0, 0)
    .build();
  sheet.insertChart(questionChart);

  const skillChart = sheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(sheet.getRange(`A${skillStart}:F${skillStart + skillRows.length}`))
    .setOption('title', 'Acompanhamento por aprendizagem essencial')
    .setOption('hAxis', { title: 'Quantidade de respostas' })
    .setOption('height', 420)
    .setOption('width', 760)
    .setPosition(30, 9, 0, 0)
    .build();
  sheet.insertChart(skillChart);

  buildLearningDoughnuts_(sheet, 35);

  sheet.setFrozenRows(6);
  sheet.setColumnWidth(1, 330);
  sheet.setColumnWidth(2, 470);
  sheet.setColumnWidths(3, 5, 105);
  sheet.setColumnWidth(9, 120);
  sheet.setColumnWidth(10, 100);
  sheet.getRange(1, 1, skillStart + skillRows.length, 13).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
}

function buildLearningDoughnuts_(sheet, startRow) {
  const doughnutTitleRow = startRow;
  const chartTopRow = startRow + 5;
  const helperStartColumn = 15; // Coluna O: dados auxiliares fora da área visual do painel.
  const helperColumnCount = CONFIG.allQuestions.length * 2;
  const requiredColumns = helperStartColumn + helperColumnCount - 1;
  const chartHeight = 230;

  sheet.getRange(doughnutTitleRow, 1, 100, 13).clearContent();
  if (sheet.getMaxColumns() < requiredColumns) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), requiredColumns - sheet.getMaxColumns());
  }
  sheet.getRange(1, helperStartColumn, 3, helperColumnCount).clearContent();
  sheet.showColumns(helperStartColumn, helperColumnCount);
  sheet.hideColumns(helperStartColumn, helperColumnCount);
  sheet.getRange(doughnutTitleRow, 1, 1, 10).merge().setValue('Aprendizagens essenciais — atingidas e não atingidas')
    .setFontWeight('bold').setFontSize(13).setFontColor(COLORS.white).setBackground(COLORS.header);

  CONFIG.allQuestions.forEach((question, index) => {
    const visualColumn = 1 + (index % 2) * 7;
    const helperColumn = helperStartColumn + index * 2;
    const chartRow = chartTopRow + Math.floor(index / 2) * 15;
    const skill = CONFIG.skills[question];
    const skillCriteria = JSON.stringify(skill);
    const correctFormula = assessmentCountFormula_('J', skillCriteria, 'K', 'Correta');
    const incorrectFormula = assessmentCountFormula_('J', skillCriteria, 'K', 'Incorreta');

    sheet.getRange(1, helperColumn, 3, 2).setValues([
      ['Resultado', 'Quantidade'],
      ['Atingida', ''],
      ['Não atingida', '']
    ]);
    sheet.getRange(2, helperColumn + 1, 2, 1).setFormulas([[correctFormula], [incorrectFormula]]);

    const chart = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange(1, helperColumn, 3, 2))
      .setOption('title', `${question} — ${shortSkill_(skill)}`)
      .setOption('pieHole', 0.62)
      .setOption('colors', ['#2e75b6', '#d9534f'])
      .setOption('legend', { position: 'bottom' })
      .setOption('height', chartHeight)
      .setOption('width', 430)
      .setPosition(chartRow, visualColumn, 0, 0)
      .build();
    sheet.insertChart(chart);
  });
}

function shortSkill_(skill) {
  return skill.length > 58 ? `${skill.slice(0, 55)}...` : skill;
}

function objectiveScore_(payload) {
  return CONFIG.objectiveQuestions.reduce((total, question) => {
    return total + (payload[question] === CONFIG.answerKey[question] ? 1 : 0);
  }, 0);
}

function objectivePercentage_(payload) {
  return objectiveScore_(payload) / CONFIG.objectiveQuestions.length;
}

function getSpreadsheet_() {
  if (!CONFIG.SPREADSHEET_ID || CONFIG.SPREADSHEET_ID === 'COLE_AQUI_O_ID_DA_PLANILHA') {
    throw new Error('Configure CONFIG.SPREADSHEET_ID antes de executar ou publicar o script.');
  }
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

function getOrCreateSheet_(spreadsheet, name) {
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function ensureHeaders_(sheet, headers) {
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const matches = headers.every((header, index) => current[index] === header);
  if (!matches) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  formatHeader_(sheet.getRange(1, 1, 1, headers.length));
}

function formatHeader_(range) {
  range.setFontWeight('bold')
    .setFontColor(COLORS.white)
    .setBackground(COLORS.header)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
}

function clean_(value) {
  return value === undefined || value === null ? '' : String(value).trim();
}

function columnToLetter_(column) {
  let result = '';
  let value = column;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
